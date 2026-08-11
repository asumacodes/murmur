export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "What happens after my free idea?",
    a: "You get one free delivered idea per account, ever. After that, pick a plan or buy a single idea at $7. No subscription required.",
  },
  {
    q: "What if a run fails?",
    a: "Failures are on us. A failed pipeline never consumes an idea. You're only charged for a successfully delivered result.",
  },
  {
    q: "Do unused ideas roll over?",
    a: "No. Subscription ideas reset monthly. If you need more in a given month, buy top-ups at your tier's rate.",
  },
  {
    q: "Do I need a paid Atlassian account?",
    a: "No. A free Atlassian account is enough. Murmur writes your Jira board and Confluence space into your own tenant.",
  },
  {
    q: "Will prices change after I sign up?",
    a: "The first 100 subscribers keep their price for 12 months. It's a price lock, not a limited-time discount, and it's explicitly not lifetime.",
  },
] as const;
