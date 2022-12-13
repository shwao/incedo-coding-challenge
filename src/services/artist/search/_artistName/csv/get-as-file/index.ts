import { Type } from "@sinclair/typebox";

import { ServerInstance } from "../../../../../../server";
import { convertArtistsToCsv } from "../../../../../../utils/convertArtistsToCsv";
import { getRandomArtists } from "../../../../../../utils/getRandomArtists";
import { searchArtists } from "../../../../../../utils/searchArtists";
import { Artist } from "../../../../../../utils/searchArtists/types";

export default async function (server: ServerInstance)
{
	server.get("/", {
		schema: {
			params: Type.Object({
				artistName: Type.String({ minLength: 1 }),
			}),
			querystring: Type.Object({
				randomFallbackAmount: Type.Number({ minimum: 1, maximum: 3, default: 1 }),
				csvFileName: Type.Optional(Type.String({ minLength: 1 })),
			}),
		},
	}, async (request, reply) =>
	{
		const { artistName } = request.params;
		const { randomFallbackAmount, csvFileName } = request.query;

		let artists: Artist[];
		try
		{
			artists = await searchArtists({
				artistName,
				lastFmApiKey: process.env.LAST_FM_API_KEY,
			});
		}
		catch (error: any)
		{
			/* Log the error to analyze the actual problem. */
			server.log.error(error);

			/* 
				We don't need to check for the name or API key error here. The name
				can not be empty because of the schema used up top. The API key can not
				be empty because its checked when the server is started. The user can
				not change anything about the other errors, so we just return a generic
				error message. (Debatable)
			*/
			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error while searching for artists",
			});
		}

		/* Get random artists if Last.fm response was empty. */
		if (artists.length === 0)
		{
			try
			{
				artists = getRandomArtists(randomFallbackAmount);
			}
			catch (error)
			{
				server.log.error(error);

				return reply.code(500).send({
					error: "Internal Server Error",
					message: "Error while getting random artists",
				});
			}
		}

		let csv: string;
		try
		{
			csv = convertArtistsToCsv(artists)
		}
		catch (error)
		{
			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error while creating CSV file",
			});
		}

		const fileName = csvFileName || artistName.toLowerCase().replace(/[^a-z0-9]/g, "-");

		return reply
			.type("text/csv")
			.header("Content-Disposition", `attachment; filename=${fileName}.csv`)
			.send(csv);
	});
}