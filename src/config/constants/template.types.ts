import type { EMAIL_TEMPLATE_NAMES, TEMPLATE_TYPES } from "./template.const";

export type EmailTemplateName = (typeof EMAIL_TEMPLATE_NAMES)[number];
export type TemplateType = (typeof TEMPLATE_TYPES)[number];
