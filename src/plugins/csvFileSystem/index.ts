import { fastifyPlugin } from "fastify-plugin";
import fs from "fs";

export interface CsvFileSystemPluginOptions
{
	path: string;
}

export const csvFileSystemPlugin = fastifyPlugin<CsvFileSystemPluginOptions>(async (server, options) =>
{
	const { path } = options;

	if (!path)
		throw new Error("Path is not set");

	if (!fs.existsSync(path))
		fs.mkdirSync(path);

	server.decorate("csvFileSystem", {
		writeFile: (name: string, content: string) =>
		{
			return fs.writeFileSync(`${path}/${name}.csv`, content);
		},
		readFile: (name: string) =>
		{
			const filePath = `${path}/${name}.csv`;

			if (!fs.existsSync(filePath))
				return false;

			return fs.readFileSync(filePath, "utf8");
		},
	});
}, { name: "csvFileSystem" });