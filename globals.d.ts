declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		EMAIL_USER: string;
		EMAIL_PASS: string;
		EMAIL_SMTP_HOST: string
		EMAIL_SMTP_PORT: string
		EMAIL_SMTP_SERVICE: "Gmail"
		DEBUG: "true" | "false";
		ENV: "DEV" | "PROD";
	}
}
