const TEMPLATES_PATH = `${process.cwd()}/public/templates`;
export const EMAIL_TEMPLATES_PATH = `${TEMPLATES_PATH}/email`;
export const HTML_TEMPLATES_PATH = `${TEMPLATES_PATH}/html`;

export const EMAIL_TEMPLATE_NAMES = [
	"order-recieved",
	"order-confirmation",
] as const;
export const TEMPLATE_FILE_EXT = "mustache";
export const TEMPLATE_TYPES = ["email", "html"] as const;
