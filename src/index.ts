import { initializeEnv } from "./utils/initializeEnv";
import { buildServer } from "./server";

initializeEnv({
	requiredEnvVars: [
		"HOST",
		"PORT",
		"LAST_FM_API_KEY"
	],
});

const server = buildServer({
	serverOptions: {
		disableRequestLogging: true,
	}
});

server.listen({ host: process.env.HOST, port: +(process.env.PORT || "") }, (error, address) =>
{
	if (error)
		throw error;

	console.log(`Server listening at ${address}`);
});