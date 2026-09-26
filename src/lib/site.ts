export const SITE_URL = "https://www.trymurmur.studio";
export const SITE_NAME = "Murmur";
export const ORG_NAME = "SprintZero Studios";

export const socials = {
  x: "https://x.com/trymurmurhq",
  founderX: "https://x.com/AsumaCodes",
  github: "https://github.com/asumacodes",
  youtube: "https://www.youtube.com/@AsumaCodes",
} as const;

export const emails = {
  hello: "hey@trymurmur.studio",
  support: "support@trymurmur.studio",
} as const;

export const sprintZeroUrl = "https://sprint0.trymurmur.studio";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
