import { Artist } from "../searchArtists/types";

/**
 * Converts an array of artists to a CSV string with a header row.
 * @param artists - Array of artists.
 * @returns CSV string.
 */
export function convertArtistsToCsv(artists: Artist[])
{
	return [
		"name, mbid, url, image_small, image",
		...artists.map(artist => `"${[
			artist.name,
			artist.mbid,
			artist.url,
			artist.image_small,
			artist.image,
		].join("\", \"")}"`),
	].join("\n");
}