export const navItems = [
  { label: "Real runs", href: "/#runs", id: "runs" },
  { label: "How it works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Pipeline", href: "/#pipeline", id: "pipeline" },
  { label: "Pricing", href: "/#pricing", id: "pricing" },
  { label: "Examples", href: "/examples", id: null },
] as const;

export const spyIds = ["runs", "how-it-works", "pipeline", "pricing", "faq"] as const;

export const footerLinks = {
  product: [
    { label: "Real runs", href: "/#runs" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "The pipeline", href: "/#pipeline" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  resources: [
    { label: "PRD examples", href: "/examples" },
    { label: "PRD template", href: "/templates/prd" },
    { label: "Tech design template", href: "/templates/technical-design-document" },
    { label: "PRD → Jira CSV tool", href: "/tools/prd-to-jira-csv" },
    { label: "Murmur vs ChatPRD", href: "/compare/chatprd" },
    { label: "Murmur vs Atlassian Rovo", href: "/compare/atlassian-rovo" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "SprintZero Studio", href: "https://sprint0.trymurmur.studio" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
