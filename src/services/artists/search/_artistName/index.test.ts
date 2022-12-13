import ava, { TestFn } from "ava";
import nock from "nock";

import { buildServer, ServerInstance } from "../../../../server";
import { LAST_FM_API_URL } from "../../../../utils/searchArtists";

import LAST_FM_API_DEMO_RESPONSE from "../../../../json/demoResponse.json";

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

test("GET /artists/search/:artistName should return error because of missing artistName", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artists/search/",
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "params/artistName must NOT have fewer than 1 characters");
});

test("GET /artists/search/:artistName should return error because of invalid randomFallbackAmount", async (t) =>
{
	const { server } = t.context;

	let response = await server.inject({
		method: "GET",
		url: "/artists/search/test",
		query: {
			randomFallbackAmount: "test",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be number");

	response = await server.inject({
		method: "GET",
		url: "/artists/search/test",
		query: {
			randomFallbackAmount: "-1",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be >= 1");

	response = await server.inject({
		method: "GET",
		url: "/artists/search/test",
		query: {
			randomFallbackAmount: "4",
		},
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "querystring/randomFallbackAmount must be <= 3");
});

test("GET /artists/search/:artistName should return generic error", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/artists/search/test",
	});

	t.is(response.statusCode, 500);
	t.is(response.json().error, "Internal Server Error");
	t.is(response.json().message, "Error while searching for artists");
});

test.serial("GET /artists/search/:artistName should return artists", async (t) =>
{
	const { server } = t.context;

	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, LAST_FM_API_DEMO_RESPONSE);

	process.env.LAST_FM_API_KEY = "test";

	const response = await server.inject({
		method: "GET",
		url: "/artists/search/Cher",
	});

	t.true(mock.isDone());

	t.is(response.statusCode, 200);
	t.is(response.json().artists.length, 3);
	t.deepEqual(response.json().artists[0], {
		name: "Cher",
		mbid: "bfcc6d75-a6a5-4bc6-8282-47aec8531818",
		url: "https://www.last.fm/music/Cher",
		image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
		image_small: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",
	});

	nock.cleanAll();
});