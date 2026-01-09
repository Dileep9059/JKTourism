export const LAYERS_VISIBLE_BY_DEFAULT = new Set([
  "State",
  "District",
  "Taluka",
  "Village",
]);

export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;
export const BASE_PATH = import.meta.env.VITE_BASE_PATH;

// masters
export const STATE_MASTER: Record<string, any> = {};
export const DISTRICT_MASTER: Record<string, any> = {};
export const QUALIFICATION_MASTER: Record<string, any> = {};
export const COURSE_MASTER: Record<string, any> = {};

export const ROLES = {
  MASTER_ADMIN: "ROLE_MASTER_ADMIN",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ADMIN: "ROLE_ADMIN",
  HOTEL: "ROLE_HOTEL"
}