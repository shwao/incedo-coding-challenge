import * as LAST_FM_API_DEMO_RESPONSE from "../../json/demoResponse.json";
import { mapLastFmArtist } from "../mapLastFmArtist";

export function getRandomArtists(amount: number)
{
	const artists = LAST_FM_API_DEMO_RESPONSE.results.artistmatches.artist;
	const randomArtists = [];

	for (let i = 0; i < amount; i++)
	{
		const randomIndex = Math.floor(Math.random() * artists.length);
		randomArtists.push(artists[randomIndex]);
	}

	return randomArtists.map(mapLastFmArtist);
}