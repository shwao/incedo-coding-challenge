import ava, { TestFn } from "ava";
import nock from "nock";

import { buildServer, ServerInstance } from "../../../../../../server";
import { LAST_FM_API_URL } from "../../../../../../utils/searchArtists";
import { mapLastFmArtist } from "../../../../../../utils/mapLastFmArtist";
import { convertArtistsToCsv } from "../../../../../../utils/convertArtistsToCsv";

import LAST_FM_API_DEMO_RESPONSE from "../../../../../../json/demoResponse.json";

const test = ava as TestFn<{ server: ServerInstance }>;

test.beforeEach((t) =>
{
	t.context.server = buildServer({
		serverOptions: {
			disableRequestLogging: true,
		},
	});
});

test.afterEach((t) =>
{
	t.context.server.close();
});

test("GET /artist/search/:artistName/csv/get-as-file should return error because of missing artistName", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artist/search//csv/get-as-file",
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "params/artistName must NOT have fewer than 1 characters");
});

test("GET /artist/search/:artistName/csv/get-as-file should return error because of invalid csvFileName", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artist/search/test/csv/get-as-file",
		query: {
			csvFileName: "",
		}
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/csvFileName must NOT have fewer than 1 characters");
});

test("GET /artist/search/:artistName/csv/get-as-file should return error because of invalid randomFallbackAmount", async (t) =>
{
	const { server } = t.context;

	let response = await server.inject({
		method: "GET",
		url: "/artist/search/test/csv/get-as-file",
		query: {
			csvFileName: "test",
			randomFallbackAmount: "test",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be number");

	response = await server.inject({
		method: "GET",
		url: "/artist/search/test/csv/get-as-file",
		query: {
			csvFileName: "test",
			randomFallbackAmount: "-1",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be >= 1");

	response = await server.inject({
		method: "GET",
		url: "/artist/search/test/csv/get-as-file",
		query: {
			csvFileName: "test",
			randomFallbackAmount: "4",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be <= 3");
});

test("GET /artist/search/:artistName/csv/get-as-file should return generic error", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artist/search/test/csv/get-as-file",
		query: {
			csvFileName: "test",
		},
	});

	t.is(response.statusCode, 500);
	t.is(response.json().error, "Internal Server Error");
	t.is(response.json().message, "Error while searching for artists");
});

test.serial("GET /artist/search/:artistName/csv/get-as-file should return csv", async (t) =>
{
	const { server } = t.context;

	let mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, LAST_FM_API_DEMO_RESPONSE);

	process.env.LAST_FM_API_KEY = "test";

	/* Test with csvFileName */
	let response = await server.inject({
		method: "GET",
		url: "/artist/search/Cher/csv/get-as-file",
		query: {
			csvFileName: "get-as-file-test",
		},
	});

	t.true(mock.isDone());

	t.is(response.statusCode, 200);
	t.is(response.body, convertArtistsToCsv(LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.map(mapLastFmArtist)));
	t.is(response.headers["content-type"], "text/csv");
	t.is(response.headers["content-disposition"], "attachment; filename=get-as-file-test.csv");

	/* Without csvFileName should use artist name as filename */
	mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, LAST_FM_API_DEMO_RESPONSE);

	response = await server.inject({
		method: "GET",
		url: "/artist/search/Wiz Khalifa/csv/get-as-file",
	});

	t.true(mock.isDone());

	t.is(response.statusCode, 200);
	t.is(response.body, convertArtistsToCsv(LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.map(mapLastFmArtist)));
	t.is(response.headers["content-type"], "text/csv");
	t.is(response.headers["content-disposition"], "attachment; filename=wiz-khalifa.csv");

	nock.cleanAll();
});