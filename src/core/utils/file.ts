export class FileUtil {
	static async readFile(filePath: string) {
		try {
			const file = Bun.file(filePath);
			const content = await file.text();
			return content;
		} catch {
			throw new Error(`Failed to read file: ${filePath}}`);
		}
	}
}
