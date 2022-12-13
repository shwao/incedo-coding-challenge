import { Type } from "@sinclair/typebox";

import { ServerInstance } from "../../../server";

export default async function (server: ServerInstance)
{
	server.get("/", {
		schema: {
			params: Type.Object({
				fileName: Type.String({ minLength: 1 }),
			}),
		}
	}, async (request, reply) =>
	{
		const { fileName } = request.params;

		let file: string | false;
		try
		{
			file = server.csvFileSystem.readFile(fileName);
		}
		catch (error)
		{
			console.log(error);
			server.log.error(error);

			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error while reading file",
			});
		}

		if (file === false)
		{
			return reply.code(404).send({
				error: "Not Found",
				message: "File not found",
			});
		}

		return reply
			.type("text/csv")
			.header("Content-Disposition", `attachment; filename=${fileName}.csv`)
			.send(file);
	});
}