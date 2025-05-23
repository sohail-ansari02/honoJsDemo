import { validate as emailValidate } from "deep-email-validator";
import { type Transporter, createTransport } from "nodemailer";
import { BRAND_NAME } from "../../../config/constants";
import type { EmailPayload } from "./email.types";

export class EmailService {
	private static _instance: EmailService;
	private transporter: Transporter;

	// Make constructor private to prevent external instantiation for singleton
	private constructor() {
		// Configure email transporter
		this.transporter = createTransport({
			service: "Gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	public static get instance(): EmailService {
		if (!EmailService._instance) {
			EmailService._instance = new EmailService();
		}
		return EmailService._instance;
	}

	async sendEmail(payload: EmailPayload) {
		await this.transporter.sendMail({
			from: `${BRAND_NAME} ${process.env.EMAIL_USER}`,
			to: payload.to,
			subject: payload.subject,
			html: payload.html,
		});
	}

	private async isEmailExistAndValid(email: string) {
		return (await emailValidate(email)).valid;
	}
}
