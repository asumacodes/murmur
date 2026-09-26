export const ctaCopy = {
  waitlist: {
    button: "Get early access",
    short: "Get access",
    placeholder: "you@company.com",
    reassurance: ["First idea free", "No card", "Free Atlassian account works"],
    dialogTitle: "Get early access",
    dialogBody:
      "Invites go out in batches. When yours lands, your first idea runs free: research, PRD, brand kit, engineering brief, roadmap, Jira and Confluence.",
  },
  signup: {
    button: "Get started free",
    short: "Get started",
    reassurance: ["First idea free", "No card", "Free Atlassian account works"],
  },
  signIn: "Sign in",
} as const;

export const roles = [
  { id: "founder", label: "Founder" },
  { id: "pm", label: "Product manager" },
  { id: "agency", label: "Agency / studio" },
  { id: "engineer", label: "Engineer" },
] as const;
