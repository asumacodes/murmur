import { readFileSync } from "node:fs";
import { join } from "node:path";

const legalDir = join(process.cwd(), "src/content/legal");

export function getLegalMarkdown(filename: "privacy.md" | "terms.md") {
  return readFileSync(join(legalDir, filename), "utf8");
}
