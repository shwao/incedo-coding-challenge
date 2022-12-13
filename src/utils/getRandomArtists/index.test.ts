import test from "ava";

import { getRandomArtists } from ".";

test("getRandomArtists should get random artists", t =>
{
	const randomArtists = getRandomArtists(1);

	t.is(randomArtists.length, 1);
	t.true(randomArtists[0].name.length > 0);
	t.true(randomArtists[0].mbid.length > 0);
	t.true(randomArtists[0].url.length > 0);
	t.true(randomArtists[0].image.length > 0);
	t.true(randomArtists[0].image_small.length > 0);
});