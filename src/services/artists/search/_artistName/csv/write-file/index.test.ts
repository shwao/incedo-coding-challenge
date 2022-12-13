import ava, { TestFn } from "ava";
import nock from "nock";
import fs from "fs";
import path from "path";

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

test("GET /artists/search/:artistName/csv/write-file should return error because of missing artistName", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artists/search//csv/write-file",
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "params/artistName must NOT have fewer than 1 characters");
});

test("GET /artists/search/:artistName/csv/write-file should return error because of missing csvFileName", async (t) =>
{
	const { server } = t.context;

	let response = await server.inject({
		method: "GET",
		url: "/artists/search/test/csv/write-file",
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring must have required property 'csvFileName'");

	response = await server.inject({
		method: "GET",
		url: "/artists/search/test/csv/write-file",
		query: {
			csvFileName: "",
		}
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/csvFileName must NOT have fewer than 1 characters");
});

test("GET /artists/search/:artistName/csv/write-file should return error because of invalid randomFallbackAmount", async (t) =>
{
	const { server } = t.context;

	let response = await server.inject({
		method: "GET",
		url: "/artists/search/test/csv/write-file",
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
		url: "/artists/search/test/csv/write-file",
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
		url: "/artists/search/test/csv/write-file",
		query: {
			csvFileName: "test",
			randomFallbackAmount: "4",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be <= 3");
});

test("GET /artists/search/:artistName/csv/write-file should return generic error", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artists/search/test/csv/write-file",
		query: {
			csvFileName: "test",
		},
	});

	t.is(response.statusCode, 500);
	t.is(response.json().error, "Internal Server Error");
	t.is(response.json().message, "Error while searching for artists");
});

test.serial("GET /artists/search/:artistName/csv/write-file should write file", async (t) =>
{
	const { server } = t.context;

	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, LAST_FM_API_DEMO_RESPONSE);

	process.env.LAST_FM_API_KEY = "test";

	const response = await server.inject({
		method: "GET",
		url: "/artists/search/Cher/csv/write-file",
		query: {
			csvFileName: "write-file-test",
		},
	});

	t.true(mock.isDone());

	t.is(response.statusCode, 200);
	t.is(response.json().message, "File successfully written");

	const file = server.csvFileSystem.readFile("write-file-test");

	t.is(file, convertArtistsToCsv(LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.map(mapLastFmArtist)));

	fs.unlinkSync(path.resolve("./csv-files/write-file-test.csv"));
	nock.cleanAll();
});