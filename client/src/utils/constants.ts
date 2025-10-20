export const LAYERS_VISIBLE_BY_DEFAULT = new Set([
  "State",
  "District",
  "Taluka",
  "Village",
]);

export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

// masters
export const STATE_MASTER: Record<string, any> = {};
export const DISTRICT_MASTER: Record<string, any> = {};
export const QUALIFICATION_MASTER: Record<string, any> = {};
export const COURSE_MASTER: Record<string, any> = {};
