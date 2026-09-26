import type { TemplateContent } from "./types";

/**
 * Technical design document template. Sections mirror the engineering brief
 * Murmur generates (see src/content/runs/*.json → engineering), including the
 * seven tech-stack layers, so the template and the real example line up.
 */
const FENCE = "```";

const markdown = `# [Project name]: Technical design document

- **Author:** [Name]
- **Reviewers:** [Names]
- **Status:** Draft | In review | Approved
- **Last updated:** [YYYY-MM-DD]
- **PRD:** [Link]

<!-- Guidance lives in HTML comments like this one. Most Markdown renderers
     hide them; delete them before you share the doc. -->

## Overview

<!-- One or two paragraphs: what is being built, the shape of the system,
     the constraints that drive the design, and the one thing it must get
     right. Link the PRD instead of restating requirements. -->

## Data flow

<!-- Follow one user action end to end, naming components as they appear.
     Then say what happens when a step fails: retries, idempotency and
     what the user sees. -->

1.
2.
3.

**On failure:**

## Components

<!-- One row per module or service with a clear owner. Responsibility =
     what it owns, what it takes in, what it produces. -->

| Component | Responsibility |
| --- | --- |
| [Name] | [Owns ... Inputs: ... Outputs: ...] |
| [Name] | |

## Data models

<!-- One block per entity: fields with types, then relationships written
     as sentences. Uniqueness and cardinality are business rules. -->

### [Entity]

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| [field] | [type] | [Nullable? Why?] |
| created_at | timestamp | |

**Relationships**

- [Entity] belongs to [Other entity]
- [Entity] has many [Other entity]
- Unique ([field], [field])

## Schema

<!-- DDL for the core tables, with NOT NULL, CHECK, UNIQUE, foreign keys
     and the indexes your main queries need. Not on SQL? Use the
     TypeScript block instead. -->

${FENCE}sql
CREATE TABLE [table_name] (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  [parent]_id uuid NOT NULL REFERENCES [parents](id),
  status text NOT NULL CHECK (status IN ('[a]', '[b]')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON [table_name] ([parent]_id);
${FENCE}

${FENCE}ts
export type [Entity] = {
  id: string;
  [parent]Id: string;
  status: "[a]" | "[b]";
  createdAt: Date;
};
${FENCE}

## Tech stack

<!-- A choice and a reason for every layer. "Not required" is a valid
     answer; say why, ideally by pointing at a PRD non-goal. -->

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | | |
| Backend | | |
| Database | | |
| Auth | | |
| LLM | | |
| Infra | | |
| Dev tools | | |

## Engineering tasks

<!-- In build order: foundations first (schema, access, deploy), then the
     riskiest component, then the rest. Each task says how you will know
     it is done. -->

1. **[Task title]:** [What to build]. Done when [observable condition].
2. **[Task title]:**
3. **[Task title]:**

## Open engineering questions

<!-- Unresolved decisions, plus every assumption this doc made that needs
     sign-off. Give each one an owner. -->

- [Question] Owner: [Name].
- [This doc assumed ... Needs sign-off from: Name.]
`;

const CREATURE_CLASH = { label: "Creature Clash engineering brief", href: "/examples/creature-clash#engineering" };

export const technicalDesignTemplate: TemplateContent = {
  slug: "technical-design-document",
  filename: "technical-design-document-template.md",
  markdown,
  outline: [
    { title: "Overview", note: "Shape, constraints, the one thing to get right" },
    { title: "Data flow", note: "One action end to end, plus failure" },
    { title: "Components", note: "Name and responsibility" },
    { title: "Data models", note: "Entities, fields, relationships" },
    { title: "Schema", note: "SQL or TypeScript, with constraints" },
    { title: "Tech stack", note: "Seven layers, a reason for each" },
    { title: "Engineering tasks", note: "Build order with done conditions" },
    { title: "Open questions", note: "Including assumptions to sign off" },
  ],
  guide: [
    {
      id: "overview",
      title: "Overview",
      heading: "## Overview",
      body: [
        "One or two paragraphs covering what is being built, the overall shape of the system (a single client, a monolith, a handful of services) and the constraints that drive the design: team size, deadline, compliance, cost, existing infrastructure. Link to the PRD instead of restating requirements; two copies of the requirements will drift.",
        "End with **the one thing the design must get right**. That sentence tells reviewers where to spend their attention, and it tells you which component to design first and in the most depth.",
      ],
      quote: {
        text: "The one thing this project must get right is the turn-resolution logic for the stat duel (type triangle + abilities + growth), so that component is designed first and in depth",
        ...CREATURE_CLASH,
      },
    },
    {
      id: "data-flow",
      title: "Data flow",
      heading: "## Data flow",
      body: [
        "Follow one real user action from input to stored result, naming each component as it appears. Numbered steps are usually enough; reach for a sequence diagram only when the flow branches.",
        "This is where reviewers find the expensive bugs: a missing permission check, two writes that should be one transaction, a synchronous call that should be a queue, personal data landing somewhere it shouldn't. After the happy path, add a line on failure. What happens when step three fails? Is the operation safe to retry? What does the user see? The Creature Clash brief marks its XP and creature-swap writes as idempotent for exactly this reason.",
      ],
    },
    {
      id: "components",
      title: "Components",
      heading: "## Components",
      body: [
        "One row per module or service, each with a **name** and a **responsibility**. A good responsibility states what the component owns (state, decisions), what it takes in and what it produces. That makes the boundary testable and gives each engineering task something concrete to point at.",
        "Check for two smells. Two components that both claim the same decision means bugs will live at the seam. A responsibility with \"and\" in it three times should be split. Components should map onto real code boundaries (a package, a module, a service), not just boxes on a diagram.",
      ],
    },
    {
      id: "data-models",
      title: "Data models",
      heading: "## Data models",
      body: [
        "Before the schema, describe each entity in plain terms: its **fields** with types, and its **relationships** written as sentences (\"Badge belongs to Trainer and Gym\"). Product managers and designers can review this layer, and it's where missing concepts show up early.",
        "Cardinality and uniqueness are business rules, so write them down. `unique (trainerId, gymId)` says a trainer earns each badge once; leave it out and nothing stops a duplicate. For every nullable field, know why it can be empty.",
      ],
    },
    {
      id: "schema",
      title: "Schema",
      heading: "## Schema",
      body: [
        "The actual DDL, or TypeScript types if you aren't on SQL, for the tables the design depends on. Include the constraints: NOT NULL, CHECK, UNIQUE, foreign keys, and the indexes your main queries need. Constraints are business rules the database enforces for free. A `CHECK (role IN ('player','ai_route','gym_leader'))` can't be forgotten by a code path the way an if-statement can.",
        "An excerpt of the core tables is enough for review. The full migration belongs in the repository, reviewed as code.",
      ],
    },
    {
      id: "tech-stack",
      title: "Tech stack",
      heading: "## Tech stack",
      body: [
        "One line per layer (frontend, backend, database, auth, LLM, infra and dev tools), each with a choice and a reason tied to a requirement or constraint. The reason is what makes the choice reviewable. Without it, the stack is a list of preferences.",
        "\"Not required\" is a legitimate and valuable answer. The Creature Clash brief below declares no backend, no auth and no LLM, each with a reason traced back to the PRD. Every layer you don't build is one you don't have to secure, host or maintain. Default to what the team already runs, and justify anything new.",
      ],
    },
    {
      id: "tasks",
      title: "Engineering tasks",
      heading: "## Engineering tasks",
      body: [
        "An ordered list of shippable units, each with a done condition. Order matters: foundations first (schema and migrations, access, the deploy path), then the riskiest component, then everything around it. Building the risky part early surfaces design flaws while they're still cheap to fix.",
        "Each task should be small enough to become one or a few tickets. If a task needs a paragraph to describe, split it. The Creature Clash brief puts persistence, access and deploy first, then the Duel Battle Engine with its test suite, then the systems that feed it.",
      ],
    },
    {
      id: "open-questions",
      title: "Open engineering questions",
      heading: "## Open engineering questions",
      body: [
        "Unresolved technical decisions, plus **every assumption the document made to keep moving**. Flagging assumptions is the most useful habit in a design doc: \"this doc assumed X, needs sign-off\" lets a reviewer challenge the assumption in a comment instead of discovering it in production.",
        "Give each question an owner. Mark questions carried over from the PRD as such, so it's clear which ones product still owns and which ones engineering can close.",
      ],
      quote: {
        text: "What is the exact round-resolution/damage formula and tie-break rule when both sides pick the same category or land equal adjusted stats? (this doc assumed 'difference in stat value, no damage on tie' — needs founder sign-off)",
        ...CREATURE_CLASH,
      },
    },
  ],
  faq: [
    {
      q: "What is a technical design document?",
      a: "A technical design document (also called a design doc, engineering design doc or tech spec) explains how a system will be built to meet its requirements: the architecture, how data moves, the components and their responsibilities, the data model and schema, the stack, and the order of work. It exists so the team can find design mistakes in review, when they cost a comment, instead of in code.",
    },
    {
      q: "When should I write one?",
      a: "Before building anything that is expensive to reverse: a new service, a new data model, a migration, a new third-party dependency, anything touching auth or personal data. Skip it for small changes you could undo in an afternoon. Start once the PRD's Must-haves are stable, and finish before the work is broken into tickets.",
    },
    {
      q: "How is a technical design document different from a PRD?",
      a: "The PRD says what to build and why: the problem, the user, prioritized features and success metrics. The technical design document says how: components, data flow, schema, stack and build order. A design doc should link to its PRD rather than restate it, so there is only one source of truth for requirements.",
    },
    {
      q: "How detailed should the schema section be?",
      a: "Detailed enough that a reviewer can check the data model supports every Must-have and spot integrity problems: the core tables, their keys and the constraints that encode business rules. You don't need every column of every table; the full migration lives in the repository.",
    },
    {
      q: "Who should review a technical design document?",
      a: "The engineers who will build and operate the system, plus the product owner for the scope-related parts such as the task order and open questions. Bring in security or data specialists when the design touches authentication, payments or personal data. Written comments first, then a short meeting only for what the comments didn't settle, works well.",
    },
    {
      q: "Can Murmur write this for me?",
      a: "Yes. Murmur turns a voice memo into a PRD and then an engineering brief with this structure: overview, data flow, components, data models, a SQL schema, a reasoned tech stack, ordered tasks and open questions, alongside a roadmap and a Jira board. The whole run takes under 10 minutes, and your first idea is free.",
    },
  ],
};
