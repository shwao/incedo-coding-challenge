import { config as dotenv } from "dotenv";
import * as fs from "fs";

/**
 * Initializes environment variables from a .env file.
 * @param requiredEnvVars - List of required environment variables.
 * @throws {Error} - If NODE_ENV is not set.
 * @throws {Error} - If NODE_ENV is not one of: production, development
 * @throws {Error} - If the environment file does not exist.
 * @throws {Error} - If a required environment variable is not set.
 */
export function initializeEnv({ requiredEnvVars }: {
	requiredEnvVars?: string[];
} = {})
{
	if (!process.env.NODE_ENV)
		throw new Error("NODE_ENV is not set");

	if (!["production", "development"].includes(process.env.NODE_ENV))
		throw new Error("NODE_ENV must be one of: production, development, test");

	const envFileName = `${process.env.NODE_ENV}.env`;

	if (!fs.existsSync(envFileName))
		throw new Error(`Environment file ${envFileName} does not exist`);

	dotenv({ path: envFileName });

	if (requiredEnvVars)
	{
		for (const envVar of requiredEnvVars)
		{
			if (!process.env[envVar])
				throw new Error(`Environment variable ${envVar} is not set`);
		}
	}
}