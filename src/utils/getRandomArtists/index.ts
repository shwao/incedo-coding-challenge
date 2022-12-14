import * as LAST_FM_API_DEMO_RESPONSE from "../../json/demoResponse.json";
import { mapLastFmArtist } from "../mapLastFmArtist";
import { Artist } from "../searchArtists/types";

/**
 * Returns a random selection of artists from the Last.fm API demo response.
 * @param amount - Amount of artists to return.
 * @returns Array of artists.
 */
export function getRandomArtists(amount: number): Artist[]
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