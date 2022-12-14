import { Artist } from "../searchArtists/types";

/**
 * Maps a Last.fm artist to an Artist object.
 * @param lastFmArtist - Last.fm artist.
 * @returns Artist object.
 * @throws {Error} - If no small image is found.
 * @throws {Error} - If no mega image is found.
 */
export function mapLastFmArtist(lastFmArtist: any): Artist
{
	const image_small = lastFmArtist.image.find((image: any) => image.size === "small");

	if (!image_small)
		throw new Error("No small image found");

	const image = lastFmArtist.image.find((image: any) => image.size === "mega");

	if (!image)
		throw new Error("No mega image found");

	return {
		name: lastFmArtist.name,
		mbid: lastFmArtist.mbid,
		url: lastFmArtist.url,
		image: image["#text"],
		image_small: image_small["#text"],
	};
}