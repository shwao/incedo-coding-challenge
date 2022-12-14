import { fastifyPlugin } from "fastify-plugin";
import fs from "fs";

export interface CsvFileSystemPluginOptions
{
	path: string;
}

/**
 * Plugin that adds methods to the server to store and read CSV files. Creates 
 * the directory if it does not exist.
 * @param server - Fastify server instance.
 * @param options - Plugin options.
 * @param options.path - Path to the directory where the CSV files will be stored.
 * @throws {Error} - If the path is not set.
 */
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