declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		EMAIL_USER: string;
		EMAIL_PASS: string;
		DEBUG: "true" | "false";
		ENV: "DEV" | "PROD";
	}
}
