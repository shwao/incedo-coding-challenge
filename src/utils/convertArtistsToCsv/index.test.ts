import test from "ava";

import { convertArtistsToCsv } from ".";
import { mapLastFmArtist } from "../mapLastFmArtist";

import LAST_FM_API_DEMO_RESPONSE from "../../json/demoResponse.json";

test("convertArtistsToCsv should convert artists to csv", t =>
{
	const artists = LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist.slice(0, 1).map(mapLastFmArtist);

	t.is(convertArtistsToCsv(artists), `name, mbid, url, image_small, image
"Cher", "bfcc6d75-a6a5-4bc6-8282-47aec8531818", "https://www.last.fm/music/Cher", "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png", "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"`);
});