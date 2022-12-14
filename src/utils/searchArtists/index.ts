import fetch, { Response } from "node-fetch";
import { mapLastFmArtist } from "../mapLastFmArtist";

import { Artist } from "./types";

export const LAST_FM_API_URL = "https://ws.audioscrobbler.com/2.0/";

/**
 * Searches for artists on Last.fm.
 * @param artistName - Name of the artist to search for.
 * @param lastFmApiKey - Last.fm API key.
 * @returns Array of artists.
 * @throws {Error} - If no artist name is provided.
 * @throws {Error} - If no Last.fm API key is provided.
 * @throws {Error} - If an error occurs while getting data from Last.fm.
 * @throws {Error} - If an error occurs while parsing data from Last.fm.
 * @throws {Error} - If an invalid response is received from Last.fm.
 * @throws {Error} - If an invalid API key is provided.
 */
export async function searchArtists({ artistName, lastFmApiKey }: {
	artistName: string;
	lastFmApiKey: string;
})
{
	if (!artistName)
		throw new Error("No artist name provided");

	if (!lastFmApiKey)
		throw new Error("No Last.fm API key provided");

	const url = new URL(LAST_FM_API_URL);

	url.searchParams.append("method", "artist.search");
	url.searchParams.append("format", "json");
	url.searchParams.append("artist", artistName);
	url.searchParams.append("api_key", lastFmApiKey);

	let response: Response;
	try
	{
		response = await fetch(url.toString());
	}
	catch (error: any)
	{
		throw new Error("Error while getting data from Last.fm");
	}

	if (!response.ok)
	{
		if (response.status === 403)
			throw new Error("Invalid API key");

		throw new Error("Invalid response from Last.fm");
	}

	let artists: Artist[];
	try
	{
		const json = await response.json();

		artists = json.results.artistmatches.artist.map(mapLastFmArtist);
	}
	catch (error: any)
	{
		if (error.message.endsWith("image found"))
			throw error;

		throw new Error("Error while parsing data from Last.fm");
	}

	return artists;
}