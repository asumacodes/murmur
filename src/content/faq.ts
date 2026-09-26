import { FOUNDING_REWARD_COPY } from "@/content/founding";

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "What exactly do I get from one idea?",
    a: "Eight artifacts: your transcript, a competitor map with source links, a PRD, a brand kit, an engineering brief, a three-phase roadmap, a new Jira project with epics and stories, and a Confluence space with six pages. The Jira project and Confluence space are created in your own Atlassian site.",
  },
  {
    q: "How long does a run take?",
    a: "Under 10 minutes from start to finish. The four public example runs took between 7m 02s and 9m 22s. You don't have to watch: close the tab and Murmur notifies you when it's ready.",
  },
  {
    q: "How long should my voice memo be?",
    a: "Fifteen seconds is enough to start; ten minutes is the maximum. The public examples range from 49 seconds to about 3 minutes. The more you say about who it's for and why, the sharper the PRD. You can also type your idea instead.",
  },
  {
    q: "What happens after my free idea?",
    a: "Every account gets one free idea, and a failed run doesn't count. After that, pick a plan or buy a single idea for $7. No subscription required.",
  },
  {
    q: "What if a run fails?",
    a: "Failures are on us. A failed run never uses an idea, and retrying a stage that stopped partway is free. An idea is only used when a run delivers.",
  },
  {
    q: "Do I need a paid Atlassian account?",
    a: "No. A free Atlassian account is enough. You connect it once; Murmur then creates a new Jira project and a new Confluence space in your own site for each idea.",
  },
  {
    q: "Can I edit what Murmur writes?",
    a: "Yes. The Jira board and Confluence space are yours to edit like anything else in Atlassian. The PRD, competitor map, engineering brief and transcript download as Markdown, and the brand kit downloads as a zip with the palette, typography and logo direction.",
  },
  {
    q: "Is my idea private?",
    a: "Yes. Runs are private to your account, and Murmur never publishes them. Results are kept for one month (six months on Builder and Studio), then deleted. The four examples on this site are the founder's own runs, published on purpose.",
  },
  {
    q: "Do unused ideas roll over?",
    a: "No. Subscription ideas reset monthly. If you need more in a month, buy top-ups at your plan's rate; top-ups never expire.",
  },
  {
    q: "What's the founding member reward?",
    a: FOUNDING_REWARD_COPY,
  },
  {
    q: "Who builds Murmur?",
    a: "SprintZero Studios, a one-person product studio in Chandigarh, India. Murmur is built in public by @AsumaCodes. Every question sent to hey@trymurmur.studio is read by a human.",
  },
];
