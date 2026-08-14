export type ArtifactStage = "capture" | "artifacts";
export type ArtifactSurface = "brand" | "jira" | "confluence";

export const artifacts = {
  eyebrow: "The artifacts",
  title: "Talk on your phone. Open your workspace on your laptop.",
  subhead:
    "Capture is a five-minute voice memo. What comes back is a brand kit, a Jira board, and a Confluence space — real artifacts in your own tools, not a summary you still have to act on.",
  stages: {
    capture: { label: "Capture", frameLabel: "Listener · iPhone" },
    artifacts: { label: "Artifacts", frameLabel: "Your workspace · Desktop" },
  },
  surfaces: {
    brand: { label: "Brand", panelTitle: "Brand kit" },
    jira: { label: "Jira", panelTitle: "Epics & stories" },
    confluence: { label: "Confluence", panelTitle: "Space & pages" },
  },
  brand: {
    productName: "Murmur",
    tagline: "Speak. Structure. Handoff.",
    palette: [
      { hex: "#0a0a0a", label: "Ink" },
      { hex: "#faf6ec", label: "Paper" },
      { hex: "#c9a96e", label: "Gold" },
      { hex: "#d63b30", label: "Seal" },
    ],
    type: {
      display: "Instrument Serif",
      displaySample: "Speak.",
      body: "Geist Sans",
      bodySample: "A five-minute memo becomes a project foundation.",
    },
    values: [
      "Honesty over theater",
      "Artifacts over summaries",
      "Your tools, your tenant",
    ],
  },
  jira: {
    columns: [
      {
        name: "Backlog",
        cards: [
          { title: "Listener PWA capture flow", epic: "Intake" },
          { title: "Transcript confidence gate", epic: "Intake" },
        ],
      },
      {
        name: "In progress",
        cards: [
          { title: "PRD schema validation", epic: "Foundation" },
          { title: "Brand kit generation", epic: "Fan-out" },
        ],
      },
      {
        name: "Done",
        cards: [
          { title: "Atlassian OAuth connect", epic: "Handoff" },
        ],
      },
    ],
  },
  confluence: {
    spaceName: "Murmur · Project space",
    pages: [
      { title: "Overview", depth: 0 },
      { title: "Product requirements", depth: 1 },
      { title: "Goals & non-goals", depth: 2 },
      { title: "Constraints", depth: 2 },
      { title: "Roadmap", depth: 1 },
      { title: "Sprint Zero → MVP", depth: 2 },
      { title: "Brand direction", depth: 1 },
      { title: "Research brief", depth: 1 },
    ],
  },
  liveSample: {
    href: null as string | null,
    enabledLabel: "View a live sample →",
    disabledLabel: "View a live sample — coming with our first public run",
  },
} as const;

export const ARTIFACT_STAGES: ArtifactStage[] = ["capture", "artifacts"];
export const ARTIFACT_SURFACES: ArtifactSurface[] = [
  "brand",
  "jira",
  "confluence",
];
