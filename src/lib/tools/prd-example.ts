import type { Feature, RunExample } from "@/content/runs";

/**
 * Builds a Markdown PRD from a real Murmur run's MoSCoW feature list, in the
 * shape the PRD → Jira CSV tool parses: `#` title, `##` MoSCoW buckets,
 * one bullet per feature ("Title: description") and the rationale as an
 * indented sub-bullet.
 */
export function buildExamplePrdMarkdown(run: RunExample): string {
  const { prd } = run;
  const buckets: [string, Feature[]][] = [
    ["Must have", prd.features.must_have],
    ["Should have", prd.features.should_have],
    ["Could have", prd.features.could_have],
  ];

  const out: string[] = [`# ${prd.productName}`, "", prd.oneLiner, ""];
  if (prd.targetUser) out.push(`Target user: ${prd.targetUser}`, "");

  for (const [label, features] of buckets) {
    if (!features.length) continue;
    out.push(`## ${label}`, "");
    for (const f of features) {
      out.push(`- **${f.title}**: ${f.description}`);
      if (f.rationale) out.push(`  - Why: ${f.rationale}`);
    }
    out.push("");
  }

  return out.join("\n").trim() + "\n";
}
