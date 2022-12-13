import { Artist } from "../searchArtists/types";

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