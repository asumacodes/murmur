import type { TemplateContent } from "./types";

/**
 * PRD template. Section order and feature fields mirror the PRD schema Murmur
 * generates (see src/content/runs/*.json → prd), so the template, the guide
 * and the real example on the page line up one-to-one.
 */
const markdown = `# [Product name]: Product requirements document

- **Owner:** [Name]
- **Status:** Draft | In review | Approved
- **Last updated:** [YYYY-MM-DD]
- **Related:** [Tech design doc] · [Designs] · [Jira project]

<!-- Guidance lives in HTML comments like this one. Most Markdown renderers
     hide them; delete them before you share the doc. -->

## One-liner

<!-- One sentence: what it is, who it is for, and how it differs from the
     closest alternative. Write it last, put it first. -->

[Product] helps [target user] [do the job] by [how it works], unlike
[closest alternative], which [its limitation].

## Problem

<!-- The problem, not the missing solution. Who hits it, what happens today,
     how they cope, and why that falls short. Cite evidence. -->

- **Who has it:**
- **What happens today:**
- **Current workaround:**
- **Why the workaround falls short:**
- **Evidence:** [interview notes, support tickets, usage data, research]

## Target user

<!-- One primary user, described by situation rather than demographics.
     Specific enough that you could find ten of them this week. -->

- **Primary user:**
- **Trigger moment:** [when they reach for this product]
- **Not for (this release):**

## Features

<!-- MoSCoW. Every feature has a title, a description of what the user can
     do, and a rationale that cites evidence: a user quote, a research
     finding, a competitor gap or a hard constraint. Acceptance criteria
     belong on the tickets, not here. -->

### Must have

<!-- Without these the release does not solve the problem. Test: if you
     cut it, would you still ship? If yes, it is not a Must. -->

#### [Feature title]

- **Description:**
- **Rationale:**

#### [Feature title]

- **Description:**
- **Rationale:**

### Should have

<!-- Important, but the release works without them. First to slip when
     time runs short. -->

#### [Feature title]

- **Description:**
- **Rationale:**

### Could have

<!-- Only if cheap, and only if nothing above is at risk. -->

#### [Feature title]

- **Description:**
- **Rationale:**

### Won't have (this release)

<!-- The things people will ask for, ruled out on purpose, each with a
     reason. This list is what keeps scope from creeping. -->

#### [Feature title]

- **Description:**
- **Rationale:**

#### [Feature title]

- **Description:**
- **Rationale:**

## Success metrics

<!-- Each target names a behavior, a number, a population and a time
     window. Aim for three to five, and decide how each one will be
     measured before launch. -->

| Metric | Target |
| --- | --- |
| [Activation: core action completed] | [≥ X% of new users do Y within N days] |
| [Repeat use] | |
| [Conversion or revenue] | |
| [Quality or satisfaction] | |

## Non-goals

<!-- Outcomes, audiences and problem areas you are deliberately not
     pursuing. Won't have rules out features; non-goals rule out goals. -->

- Not
- Not

## Risks

<!-- What could make this fail: value, usability, feasibility, viability.
     Pair each risk with what would reduce it. -->

- [Risk]. Mitigation:
- [Risk]. Mitigation:

## Open questions

<!-- Decisions not made yet, phrased as a choice between options, each
     with an owner and a decide-by date. -->

- [Option A or option B?] Owner: [Name]. Decide by: [YYYY-MM-DD].
- [Question] Owner: [Name]. Decide by: [YYYY-MM-DD].

## Competitive landscape

<!-- The closest alternatives, including spreadsheets, agencies and doing
     nothing. One line each: what they do versus what you do. -->

| Competitor | Positioning delta |
| --- | --- |
| [Competitor] | [They do X; we do Y] |
| [Status quo or manual workaround] | |
`;

const AAVAAS = { label: "Aavaas PRD", href: "/examples/aavaas#prd" };

export const prdTemplate: TemplateContent = {
  slug: "prd",
  filename: "prd-template.md",
  markdown,
  outline: [
    { title: "One-liner", note: "What, for whom, versus what" },
    { title: "Problem", note: "Today's workaround and the evidence" },
    { title: "Target user", note: "One person, one trigger moment" },
    { title: "Features", note: "Must · Should · Could · Won't, each with a rationale" },
    { title: "Success metrics", note: "Behavior, target, population, window" },
    { title: "Non-goals", note: "Outcomes you are not chasing" },
    { title: "Risks", note: "Each one paired with a mitigation" },
    { title: "Open questions", note: "Decisions with owners and dates" },
    { title: "Competitive landscape", note: "A one-line positioning delta" },
  ],
  guide: [
    {
      id: "one-liner",
      title: "One-liner",
      heading: "## One-liner",
      body: [
        "One sentence that says what the product is, who it is for, and why someone would pick it over the closest alternative. It is the line people repeat in stand-ups, pitch decks and hallway conversations, so it has to survive being repeated without you in the room.",
        "Write it last and put it first. If you can't write it after drafting everything else, the scope isn't settled yet. Name the alternative explicitly: a one-liner that doesn't say what it replaces invites \"how is this different from X?\" in every review. Cut adjectives like *seamless* and *powerful*; they don't distinguish you from anyone.",
      ],
      contrast: {
        weak: "An AI-powered platform that makes invoicing effortless.",
        strong:
          "Lets freelance designers send an invoice from the thread where the client approved the work, unlike accounting suites, which need a separate client record first.",
      },
    },
    {
      id: "problem",
      title: "Problem",
      heading: "## Problem",
      body: [
        "Describe what is broken for a specific person today, not the absence of your solution. \"There is no app for X\" is not a problem. \"People walk into their first architect meeting with no brief, then pay for it in months of revisions\" is.",
        "The most useful line is the **current workaround**. It tells you what you are really competing with (often a spreadsheet, a group chat, an agency or doing nothing) and how much friction you have to remove before anyone switches. Back the problem with evidence someone can check: interview notes, support tickets, usage data, competitor reviews. If you have none yet, say so, and add \"validate the problem\" to Open questions.",
      ],
    },
    {
      id: "target-user",
      title: "Target user",
      heading: "## Target user",
      body: [
        "One primary user, described by situation rather than demographics. \"Small businesses\" is a market. \"The office manager at a dental practice who confirms every appointment by phone\" is a user you could go and talk to this week.",
        "Add the **trigger moment**, when they reach for the product, and who it is **not for** in this release. The \"not for\" line stops features for a secondary persona from quietly entering Must have. The Aavaas PRD below narrows to first-time homeowners who own a plot and are about to meet an architect: specific enough to find, recruit and build for.",
      ],
    },
    {
      id: "moscow",
      title: "Features in MoSCoW",
      heading: "## Features",
      body: [
        "MoSCoW sorts every feature into four buckets. **Must have:** without it the release doesn't solve the problem; test by asking whether you would still ship if it were cut. **Should have:** important, but the release works without it, so it's the first to slip when time runs short. **Could have:** only if cheap, and only if nothing above is at risk. **Won't have:** explicitly out of this release.",
        "The usual failure is a Must list that holds almost everything, which is the same as having no priorities. DSDM, the agile method MoSCoW is best known from, recommends keeping Must-haves to no more than about 60% of the effort so the Shoulds and Coulds act as contingency. If your Must list is longer than the other three combined, run each item through the \"would we still ship?\" test again.",
      ],
    },
    {
      id: "feature-fields",
      title: "Title, description, rationale",
      heading: "#### [Feature title]",
      body: [
        "Every feature carries the same three fields. The **title** is a short noun phrase people can use in conversation (\"Free revision loop\"). The **description** says what the user can do, as observable behavior, not how it will be implemented.",
        "The **rationale** is what makes the PRD defensible. When someone asks why a feature is a Must, or why their request isn't, the rationale is the answer. Good rationales cite something checkable: a user quote, a research finding, a competitor gap, a deadline, a regulation. \"Users want it\" is not a rationale; the interview where a user asked for it is.",
        "Keep acceptance criteria out of the PRD. They belong on the tickets, where engineers work and where they can change without re-approving the whole document. Implementation detail belongs in the [technical design document](/templates/technical-design-document).",
      ],
      contrast: {
        weak: "Rationale: users will love being able to revise their plan.",
        strong: "Rationale: Directly from the transcript: 'you can come back any number of times you want for those floor plans.'",
        strongSource: AAVAAS,
      },
    },
    {
      id: "wont-have",
      title: "Won't have",
      heading: "### Won't have (this release)",
      body: [
        "This is the most valuable section for keeping scope under control, and the one most templates leave out. Scope creep rarely arrives as one big decision. It arrives as a string of reasonable requests mid-build: \"can we just add Google sign-in?\", \"sales needs a mobile app\". If the document is silent, every request becomes a fresh negotiation, and the default answer drifts toward yes.",
        "A written Won't-have list changes the conversation from \"should we?\" to \"we decided not to, here's why; do you want to reopen it?\" Reopening then becomes an explicit trade: something comes out of Must to make room. List the things people will actually ask for (adjacent features, integrations, platforms, admin tooling) and give each one a reason.",
        "\"Won't\" means not in this release, so the list doubles as a parking lot: good ideas are recorded instead of lost. The Aavaas PRD below has more Won't-haves (eight) than Must-haves (seven), which is a healthy sign.",
      ],
      quote: {
        title: "Won't have · CAD/DXF Professional Export",
        text: "GrehYug and Cadbull already serve the professional-drafting segment; we're explicitly not competing there.",
        ...AAVAAS,
      },
    },
    {
      id: "success-metrics",
      title: "Success metrics",
      heading: "## Success metrics",
      body: [
        "A measurable success metric has four parts: the **behavior** you count, a **target** number, the **population** it applies to, and a **time window**. \"Increase engagement\" has none of them, so nobody can ever say whether it was hit.",
        "Prefer leading indicators you can read within weeks (completing the core action, coming back a second time) over lagging ones like revenue alone. Three to five metrics is plenty: roughly one each for activation, repeat use, conversion and quality. Tie each one to a Must-have; if shipping a Must wouldn't move any metric, either the metric or the Must is wrong. Decide before launch how each will be measured (which event, which survey), or you'll find out on day 30 that you can't compute it.",
      ],
      contrast: {
        weak: "Users engage with the 3D model.",
        strong: "≥70% of users who start the plot/family intake complete a viewable 3D model within 60 days of launch",
        strongSource: AAVAAS,
        breakdown: [
          { label: "Behavior", value: "complete a viewable 3D model" },
          { label: "Target", value: "≥70%" },
          { label: "Population", value: "users who start the plot/family intake" },
          { label: "Window", value: "within 60 days of launch" },
        ],
      },
    },
    {
      id: "non-goals",
      title: "Non-goals",
      heading: "## Non-goals",
      body: [
        "Won't have rules out features. Non-goals rule out **outcomes, audiences and problem spaces**. \"Not replacing licensed architects\" (from the Aavaas PRD) isn't a feature you could put in a backlog, yet it shapes dozens of small decisions: the copy, the disclaimers, which exports to offer, which users to recruit.",
        "Write a non-goal wherever a reasonable reader might assume the opposite. If nobody would ever assume it, leave it out; it's noise.",
      ],
    },
    {
      id: "risks",
      title: "Risks",
      heading: "## Risks",
      body: [
        "Name what could make the product fail, specifically. \"Timeline risk\" tells a reader nothing. \"Vastu, climate, and setback rule logic combined could produce unbuildable or non-compliant layouts without expert validation\" (Aavaas) tells them exactly where to look.",
        "A useful checklist is the four risks from Marty Cagan's *Inspired*: **value** (will people want it), **usability** (can they figure it out), **feasibility** (can we build it) and **viability** (does it work for the business, legally and financially). Pair each risk with what would reduce it: a spike, a prototype test, a legal review, a narrower launch. A risk with no mitigation is just a worry.",
      ],
    },
    {
      id: "open-questions",
      title: "Open questions",
      heading: "## Open questions",
      body: [
        "Everything you don't know yet, written down so it doesn't get decided by accident in a pull request. Phrase each one as a decision between options, not a topic. \"Pricing?\" is a topic. \"Flat fee, or freemium with a paid export?\" is a decision someone can make.",
        "Give every question an owner and a decide-by date, and walk the list at each review. When a question is answered, move the answer into the section it affects and delete the question.",
      ],
      quote: {
        title: "Open question",
        text: "Should pricing be a flat fee like GrehYug or freemium-with-paid-export to maximize conversion without cannibalizing revenue?",
        ...AAVAAS,
      },
    },
    {
      id: "competitive-landscape",
      title: "Competitive landscape",
      heading: "## Competitive landscape",
      body: [
        "One row per alternative, including the ones that aren't products: spreadsheets, an agency, doing nothing. The **positioning delta** is a single line: what they do versus what you do. Squeezing it into one line forces a claim you can test with users.",
        "Check that every delta is backed by a feature. If your differentiator isn't in Must or Should, it isn't a differentiator yet, it's a hope. Keep the full research (pricing, strengths, weaknesses, sources) in a separate document; the PRD only needs the delta.",
      ],
    },
  ],
  faq: [
    {
      q: "What is a PRD?",
      a: "A product requirements document describes what a product or release should do and why: the problem, the target user, prioritized features, how success will be measured and what is out of scope. It is the shared reference for product, design and engineering. It describes behavior and intent; how the system will be built goes in a technical design document.",
    },
    {
      q: "How long should a PRD be?",
      a: "Long enough to answer the questions your team will ask, and no longer. A filled-in copy of this template usually fits in a few pages. If yours runs much longer, it probably contains acceptance criteria that belong on tickets or implementation detail that belongs in the technical design document.",
    },
    {
      q: "What does MoSCoW stand for?",
      a: "Must have, Should have, Could have and Won't have (this time). The lowercase o's are only there to make it pronounceable. The technique was created by Dai Clegg at Oracle in 1994 and later became part of the DSDM agile method.",
    },
    {
      q: "What's the difference between a PRD and a technical design document?",
      a: "The PRD says what to build and why, in terms a customer would recognize. The technical design document says how: components, data models, schema, stack and the order of engineering tasks. Write the PRD first, then the design doc once the Must-haves are stable.",
    },
    {
      q: "Can I use this template in Notion, Google Docs or GitHub?",
      a: "Yes. It is plain Markdown, so it pastes cleanly into Notion, GitHub, GitLab, Linear or Obsidian, and Google Docs can paste it as formatted text once Markdown is enabled in its preferences. The guidance sits in HTML comments, which GitHub and most Markdown previewers hide; delete them before sharing in tools that show them.",
    },
    {
      q: "Can Murmur fill in this template for me?",
      a: "Yes. Record a voice memo about your idea and Murmur researches competitors, then writes a PRD with these sections, features grounded in your memo and the research, plus a brand kit, engineering brief, roadmap, Jira board and Confluence space, in under 10 minutes. Your first idea is free.",
    },
  ],
};
