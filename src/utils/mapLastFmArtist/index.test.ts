import test from "ava";

import { mapLastFmArtist } from ".";

import * as LAST_FM_API_DEMO_RESPONSE from "../../json/demoResponse.json";

test("mapLastFmArtist should map last fm artist", (t) =>
{
	t.deepEqual(mapLastFmArtist(LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist[0]), {
		name: "Cher",
		mbid: "bfcc6d75-a6a5-4bc6-8282-47aec8531818",
		url: "https://www.last.fm/music/Cher",
		image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
		image_small: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",
	});
});