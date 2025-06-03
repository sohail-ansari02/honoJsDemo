export class EmailPayload {
	constructor(
		public to: string,
		public subject: string,
		public html?: string,
	) {
		if (!subject) {
			throw new Error("Email subject is required");
		}

		if (!to) {
			throw new Error('Recipient email "to" is required');
		}
	}
}
