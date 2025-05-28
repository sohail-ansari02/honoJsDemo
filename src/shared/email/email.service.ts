import { BRAND_NAME } from "@config/constants/organization";
import { FileUtil } from "@core/utils/file";
import { validate as emailValidate } from "deep-email-validator";
import { type Transporter, createTransport } from "nodemailer";
import type { EmailPayload } from "./email.types";

export class EmailService {
	private static _instance: EmailService;
	private transporter!: Transporter;

	// Make constructor private to prevent external instantiation for singleton
	private constructor() {
		this.initTransporter();
	}

	static get instance(): EmailService {
		if (!EmailService._instance) {
			EmailService._instance = new EmailService();
		}
		return EmailService._instance;
	}

	// Configure email transporter
	private initTransporter() {
		this.transporter = createTransport({
			service: process.env.EMAIL_SMTP_SERVICE,
			host: process.env.EMAIL_SMTP_HOST,
			port: Number(process.env.EMAIL_SMTP_PORT),
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	private async isEmailExistAndValid(email: string) {
		return (await emailValidate(email)).valid;
	}

	/**
	 * Sends an email using the configured transporter.
	 * Validates the recipient email before sending.
	 *
	 * @param {EmailPayload} payload - An object containing `to`, `subject`, and `html` fields
	 * @throws {Error} If the email is invalid or sending fails
	 * @returns {void}
	 */
	async sendEmail(payload: EmailPayload) {
		const isValidEmail = await this.isEmailExistAndValid(payload.to);
		if (!isValidEmail) {
			throw new Error(`${payload.to} is invalid email address`);
		}

		try {
			await this.transporter.sendMail({
				from: `${BRAND_NAME} ${process.env.EMAIL_USER}`,
				to: payload.to,
				subject: payload.subject,
				html: payload.html,
			});
		} catch (error) {
			throw new Error(`Failed to send email to ${payload.to}`);
		}
	}

	async getTemplate<T = object>(templateName: string, data: T) {
		const filePath = `${process.cwd()}/public/${templateName}`;
		const fileContent = await FileUtil.readFile(filePath);
		console.log(fileContent);

		// // Now compile using your template engine (e.g., Handlebars)
		// const template = Handlebars.compile(content);
		// return template(data);
	}
}
