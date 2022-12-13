declare namespace NodeJS
{
	interface ProcessEnv
	{
		NODE_ENV: "development" | "production";
		HOST: string;
		PORT: string;
		LAST_FM_API_KEY: string;
	}
}