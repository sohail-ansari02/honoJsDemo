import {
	TEMPLATES_PATH,
	TEMPLATE_FILE_EXT,
} from "@config/constants/template.const";
import type { TemplateName } from "@config/constants/template.types";
import { FileUtil } from "@core/utils/file";
import Mustache from "mustache";

export class TemplateService {
	private static _instance: TemplateService;

	// Make constructor private to prevent external instantiation for singleton
	private constructor() {}

	static get instance(): TemplateService {
		if (!TemplateService._instance) {
			TemplateService._instance = new TemplateService();
		}
		return TemplateService._instance;
	}

	async render<T>(templateName: TemplateName, data: T) {
		try {
			const filePath = `${TEMPLATES_PATH}/${templateName}.${TEMPLATE_FILE_EXT}`;
			const content = await FileUtil.readFile(filePath);
			return Mustache.render(content, data);
		} catch (e) {
			throw new Error(
				`Failed to render ${templateName}.${TEMPLATE_FILE_EXT} template`,
			);
		}
	}
}
