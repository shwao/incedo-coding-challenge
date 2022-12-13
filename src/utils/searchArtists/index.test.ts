import test from "ava";
import nock from "nock";

import { LAST_FM_API_URL, searchArtists } from "./index";

import LAST_FM_API_DEMO_RESPONSE from "../../json/demoResponse.json";

test.afterEach(() =>
{
	nock.cleanAll();
});

test("searchArtists should throw error because of missing artist name", async t =>
{
	await t.throwsAsync(searchArtists({ artistName: "", lastFmApiKey: "test" }), {
		message: "No artist name provided"
	});
});

test("searchArtists should throw error because of missing API key", async t =>
{
	await t.throwsAsync(searchArtists({ artistName: "test", lastFmApiKey: "" }), {
		message: "No Last.fm API key provided"
	});
});

test.serial("searchArtists should throw error because of invalid response", async t =>
{
	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.replyWithError("no connection");

	await t.throwsAsync(searchArtists({ artistName: "test", lastFmApiKey: "test	test" }), {
		message: "Error while getting data from Last.fm"
	});

	t.true(mock.isDone());
});

test("searchArtists should throw error because of invalid API key", async t =>
{
	await t.throwsAsync(searchArtists({ artistName: "test", lastFmApiKey: "test" }), {
		message: "Invalid API key"
	});
});

test.serial("searchArtists should throw error because of missing small image", async t =>
{
	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, {
			results: {
				...LAST_FM_API_DEMO_RESPONSE.results,
				artistmatches: {
					artist: LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.map(artist => ({
						...artist,
						image: [],
					})),
				},
			},
		});

	await t.throwsAsync(searchArtists({ artistName: "test", lastFmApiKey: "test" }), {
		message: "No small image found"
	});

	t.true(mock.isDone());
});

test.serial("searchArtists should throw error because of missing image", async t =>
{
	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, {
			results: {
				...LAST_FM_API_DEMO_RESPONSE.results,
				artistmatches: {
					artist: LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.map(artist => ({
						...artist,
						image: [
							artist.image[0],
						],
					})),
				},
			}
		});

	await t.throwsAsync(searchArtists({ artistName: "test", lastFmApiKey: "test" }), {
		message: "No mega image found"
	});

	t.true(mock.isDone());
});

test.serial("searchArtists should return array of artists", async t =>
{
	const mock = nock(LAST_FM_API_URL)
		.get(() => true)
		.reply(200, LAST_FM_API_DEMO_RESPONSE);

	const artists = await searchArtists({ artistName: "cher", lastFmApiKey: "test" });

	t.true(mock.isDone());
	t.deepEqual(artists, [
		{
			name: "Cher",
			mbid: "bfcc6d75-a6a5-4bc6-8282-47aec8531818",
			url: "https://www.last.fm/music/Cher",
			image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
			image_small: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",
		},
		{
			image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
			image_small: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",
			mbid: "48fbfb0b-92ee-45eb-99c2-0bde4c05962e",
			name: "Cher Lloyd",
			url: "https://www.last.fm/music/Cher+Lloyd",
		},
		{
			image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
			image_small: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",
			mbid: "2d499150-1c42-4ffb-a90c-1cc635519d33",
			name: "Cheryl Cole",
			url: "https://www.last.fm/music/Cheryl+Cole",
		},
	]);
});