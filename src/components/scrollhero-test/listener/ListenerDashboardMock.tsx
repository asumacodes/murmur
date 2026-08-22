"use client";

const IDEAS = [
  {
    title: "Have a new idea?",
    cta: "Run the pipeline →",
    launcher: true,
  },
  {
    title: "Convoy",
    meta: "Aug 21 · 27 secs",
    body: "An app for road trips where everyone in the car can contribute to one shared music queue.",
    artifacts: "8 artifacts",
  },
  {
    title: "Shotgun",
    meta: "Aug 30 · 33 secs",
    body: "An application designed for road trips, where everyone in the car can contribute to one shared music queue.",
    artifacts: "8 artifacts",
  },
  {
    title: "Trailhead",
    meta: "Jun 28 · 45 secs",
    body: "An application called Trailhead for weekend hikers who want to find trails that match their pace.",
    artifacts: "8 artifacts",
  },
] as const;

function IdeaCard({
  title,
  meta,
  body,
  artifacts,
  launcher,
  cta,
}: {
  title: string;
  meta?: string;
  body?: string;
  artifacts?: string;
  launcher?: boolean;
  cta?: string;
}) {
  if (launcher) {
    return (
      <div className="flex min-h-[168px] flex-col rounded-2xl border border-[rgba(201,169,110,0.3)] bg-white p-[18px] shadow-[0_1px_0_rgba(26,26,26,0.04)]">
        <span className="grid size-9 place-items-center rounded-full bg-[var(--gold)] text-white shadow-[0_0_0_5px_rgba(201,169,110,0.12)]">
          <span className="block size-3.5 rounded-full border-2 border-white" />
        </span>
        <h3 className="font-serif-display mt-auto text-[clamp(0.85rem,1.1vw,1.05rem)] leading-snug text-[#1a1a1a]">
          {title}
        </h3>
        <span className="mt-1.5 text-[0.58rem] font-medium tracking-[0.04em] text-[#8a7348]">
          {cta}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[168px] flex-col rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-[18px]">
      <p className="flex items-center gap-1.5 text-[9px] tracking-[0.12em] text-[#8a8278] uppercase">
        <span className="size-[6px] rounded-full bg-[var(--gold)]" />
        {artifacts}
      </p>
      <h3 className="font-serif-display mt-2.5 text-[clamp(0.85rem,1.1vw,1.05rem)] leading-snug text-[#1a1a1a]">
        {title}
      </h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-[0.58rem] leading-relaxed text-[#6b6760]">
        {body}
      </p>
      <p className="font-mono-text mt-2 text-[0.52rem] tracking-[0.08em] text-[#8a8278] uppercase">
        {meta}
      </p>
    </div>
  );
}

/** Static Projects dashboard — visual match for listener DesktopHomeGrid + rail. */
export function ListenerDashboardMock() {
  return (
    <div className="flex h-full w-full bg-[#fafaf7]">
      <aside className="flex w-[10%] min-w-[52px] max-w-[68px] shrink-0 flex-col items-center border-r border-[rgba(0,0,0,0.08)] py-[6%]">
        <span className="grid size-[clamp(2rem,3.2vw,2.75rem)] place-items-center rounded-full bg-[var(--gold)] text-white shadow-[0_0_0_5px_rgba(201,169,110,0.12)]">
          <span className="block size-3 rounded-full border-2 border-white" />
        </span>
        <span className="mt-1 text-[7px] font-medium tracking-[0.1em] text-[#8a8278] uppercase">
          Record
        </span>

        <nav className="mt-[12%] flex flex-col items-center gap-[10%]">
          {[
            { label: "Projects", active: true },
            { label: "Search", active: false },
            { label: "Account", active: false },
          ].map((item) => (
            <span
              key={item.label}
              className={`flex flex-col items-center gap-1 text-[7px] font-medium tracking-[0.1em] uppercase ${
                item.active ? "text-[#1a1a1a]" : "text-[#8a8278]"
              }`}
            >
              <span
                className={`grid size-7 place-items-center rounded-lg ${
                  item.active ? "bg-[rgba(201,169,110,0.14)]" : ""
                }`}
              >
                <span className="size-3 rounded-sm border border-current opacity-60" />
              </span>
              {item.label}
            </span>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[12%] min-h-[52px] shrink-0 items-center gap-3 border-b border-[rgba(0,0,0,0.08)] px-[5%]">
          <h1 className="font-serif-display shrink-0 text-[clamp(1rem,1.6vw,1.35rem)] leading-none text-[#1a1a1a]">
            Projects
          </h1>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <div className="hidden h-7 w-[clamp(6rem,14vw,10rem)] rounded-full border border-[rgba(0,0,0,0.08)] bg-white sm:block" />
            <div className="hidden h-7 w-24 rounded-full border border-[rgba(0,0,0,0.08)] bg-white md:block" />
            <span className="rounded-full bg-[var(--gold)] px-2.5 py-1 text-[8px] font-medium tracking-[0.06em] text-white uppercase">
              + New project
            </span>
          </div>
        </header>

        <div className="flex-1 px-[5%] pt-[4%] pb-[3%]">
          <div className="grid h-full grid-cols-2 gap-[3%] lg:grid-cols-4">
            {IDEAS.map((idea) => (
              <IdeaCard key={idea.title} {...idea} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
