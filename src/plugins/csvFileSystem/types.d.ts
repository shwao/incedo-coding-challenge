import "fastify";

declare module "fastify"
{
	interface FastifyInstance
	{
		csvFileSystem: {
			/**
			 * Writes a CSV file with the given name and content in the directory
			 * specified in the plugin options.
			 * @param name - Name of the file.
			 * @param content - Content of the file.
			 */
			writeFile: (name: string, content: string) => void;
			/**
			 * Reads a CSV file with the given name in the directory specified in
			 * the plugin options.
			 * @param name - Name of the file.
			 * @returns Content of the file or false if the file does not exist.
			 */
			readFile: (name: string) => string | false;
		};
	}
}
