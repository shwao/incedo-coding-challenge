import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify, { FastifyServerOptions } from "fastify";
import fastifyAutoLoad from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import path = require("path");
import { csvFileSystemPlugin } from "./plugins/csvFileSystem";

export function buildServer({
	servicesPath = path.resolve(__dirname, "services"),
	serverOptions,
}: {
	servicesPath?: string;
	serverOptions?: FastifyServerOptions;
} = {})
{
	const server = fastify(serverOptions).withTypeProvider<TypeBoxTypeProvider>();

	server.register(fastifyCors);
	server.register(fastifyHelmet);

	server.register(fastifyAutoLoad, {
		dir: servicesPath,
		autoHooks: true,
		cascadeHooks: true,
		routeParams: true,
		overwriteHooks: true,
	});

	server.register(csvFileSystemPlugin, {
		path: path.resolve("./csv-files"),
	});

	return server;
}

export type ServerInstance = ReturnType<typeof buildServer>;