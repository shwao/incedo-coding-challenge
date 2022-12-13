import "fastify";

declare module "fastify"
{
	interface FastifyInstance
	{
		csvFileSystem: {
			writeFile: (name: string, content: string) => void;
			readFile: (name: string) => string | false;
		};
	}
}
