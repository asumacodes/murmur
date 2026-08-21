"use client";

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Container, SectionHeader } from "@/components/ui";
import { DEMO_DEVICES, demo, type DemoDevice } from "@/content/demo";
import {
  trackDemoDeviceToggled,
  trackDemoVideoPlayed,
} from "@/lib/analytics/events";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { PREMIUM_EASE, scrollEnter } from "@/lib/motion";
import { focusRingClass, sectionPadClass } from "@/lib/styles";

function onTabListKeyDown(
  event: ReactKeyboardEvent<HTMLDivElement>,
  items: readonly DemoDevice[],
  current: DemoDevice,
  select: (next: DemoDevice) => void,
) {
  const index = items.indexOf(current);
  if (index < 0) {
    return;
  }

  let nextIndex = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (index + 1) % items.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (index - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = items.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  const next = items[nextIndex]!;
  select(next);

  const tabs = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs[nextIndex]?.focus();
}

function DesktopIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.75"
        y="4.75"
        width="18.5"
        height="12.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 20.25h8M12 17.25v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MobileIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7.25"
        y="2.75"
        width="9.5"
        height="18.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 5.25h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.75" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * YouTube media is always 16:9.
 * - fill (desktop): zoom the player past the screen and clip — crops baked-in
 *   pillarbox without stretching the picture.
 * - crop (mobile): stage is 9:16; keep a 16:9 well at full height, center it,
 *   clip sides so letterboxed portrait footage fills the phone.
 */
function MediaWell({
  crop,
  children,
}: {
  crop: boolean;
  children: ReactNode;
}) {
  if (!crop) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* 136% = enough to eat typical desktop recording side bars */}
        <div className="absolute top-1/2 left-1/2 h-[105%] w-[100%] -translate-x-1/2 -translate-y-1/2">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 aspect-video h-[100%] max-w-none -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
}

function VideoSlot({
  device,
  played,
  onPlay,
}: {
  device: DemoDevice;
  played: boolean;
  onPlay: () => void;
}) {
  const d = demo.devices[device];

  if (!played) {
    return (
      <MediaWell crop={d.crop}>
        <button
          type="button"
          onClick={onPlay}
          className={`${focusRingClass} group relative block h-full w-full cursor-pointer`}
          aria-label={`Play the ${d.label} demo`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube poster; avoid next/image remotePatterns */}
          <img
            src={d.poster}
            alt={`${d.label} demo, real Murmur run`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              const img = event.currentTarget;
              if (img.src.includes("maxresdefault")) {
                img.src = `https://img.youtube.com/vi/${d.videoId}/hqdefault.jpg`;
              }
            }}
          />
          <span className="absolute inset-0 grid place-items-center bg-[rgba(10,10,10,0.22)]">
            <span
              className={[
                "grid place-items-center rounded-full border border-[color-mix(in_srgb,var(--gold)_55%,transparent)]",
                "bg-[color-mix(in_srgb,var(--gold)_10%,transparent)]",
                "shadow-[0_0_34px_-6px_rgba(201,169,110,0.35)] transition-transform duration-300 group-hover:scale-110",
                device === "desktop" ? "size-[4.25rem]" : "size-14",
              ].join(" ")}
            >
              <span
                className={[
                  "ml-1 border-y-transparent border-l-[var(--gold)]",
                  device === "desktop"
                    ? "border-y-[11px] border-l-[17px]"
                    : "border-y-[9px] border-l-[14px]",
                ].join(" ")}
              />
            </span>
          </span>
        </button>
      </MediaWell>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${d.videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;

  return (
    <MediaWell crop={d.crop}>
      <iframe
        src={src}
        title={`${d.label} demo`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </MediaWell>
  );
}

function MacBookFrame({
  played,
  onPlay,
}: {
  played: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      id="demo-panel-desktop"
      role="tabpanel"
      aria-labelledby="demo-tab-desktop"
      className="demo-device-desktop mx-auto w-full max-w-[920px]"
    >
      <div
        className={[
          "rounded-[14px_14px_6px_6px] p-px sm:p-0.5",
          "bg-[linear-gradient(158deg,#43454a_0%,#2b2d31_42%,#1b1c1f_100%)]",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),0_40px_70px_-40px_rgba(0,0,0,0.95)]",
          "max-lg:rounded-[10px_10px_4px_4px]",
        ].join(" ")}
      >
        <div
          className={[
            "relative aspect-video overflow-hidden rounded-[12px] bg-[#050505]",
            "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.9)]",
            "max-lg:rounded-[6px]",
          ].join(" ")}
        >
          <div
            className="absolute top-0 left-1/2 z-[3] flex h-[17px] w-[136px] -translate-x-1/2 items-center justify-center rounded-b-[9px] bg-[#202226] max-lg:h-2.5 max-lg:w-16 max-lg:rounded-b-[5px]"
            aria-hidden="true"
          >
            <span className="size-[5px] rounded-full bg-[#0e1013] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] max-lg:hidden" />
          </div>
          <VideoSlot device="desktop" played={played} onPlay={onPlay} />
        </div>
      </div>
      <div
        className="relative -ml-[2%] h-[13px] w-[104%] rounded-b-[11px] bg-[linear-gradient(180deg,#4c4e53_0%,#33353a_55%,#191a1d_100%)] shadow-[0_22px_34px_-20px_rgba(0,0,0,0.9)] max-lg:h-2 max-lg:rounded-b-[7px] max-lg:shadow-none"
        aria-hidden="true"
      >
        <span className="absolute top-0 left-1/2 h-[5px] w-[118px] -translate-x-1/2 rounded-b-[7px] bg-[linear-gradient(180deg,#141518,#222428)] max-lg:hidden" />
      </div>
      <div
        className="h-8 bg-[radial-gradient(ellipse_46%_60%_at_50%_0%,rgba(0,0,0,0.75),transparent_72%)] max-lg:h-4"
        aria-hidden="true"
      />
    </div>
  );
}

function IPhoneFrame({
  played,
  onPlay,
}: {
  played: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      id="demo-panel-mobile"
      role="tabpanel"
      aria-labelledby="demo-tab-mobile"
      className="demo-device-mobile mx-auto w-[min(100%,20rem)] sm:w-[22rem] lg:w-[24rem]"
    >
      <div
        className={[
          "relative rounded-[46px] p-[9px]",
          "bg-[linear-gradient(150deg,#4a4c51_0%,#2c2e32_40%,#1a1b1e_100%)]",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_40px_70px_-30px_rgba(0,0,0,0.95)]",
          "max-lg:rounded-[34px] max-lg:p-[7px]",
        ].join(" ")}
      >
        <span
          className="absolute top-[112px] -left-0.5 h-[34px] w-[3px] rounded-l-[2px] bg-[linear-gradient(180deg,#4a4c51,#26282b)] max-lg:top-20 max-lg:h-6"
          aria-hidden="true"
        />
        <span
          className="absolute top-[158px] -left-0.5 h-[34px] w-[3px] rounded-l-[2px] bg-[linear-gradient(180deg,#4a4c51,#26282b)] max-lg:top-28 max-lg:h-6"
          aria-hidden="true"
        />
        <span
          className="absolute top-[132px] -right-0.5 h-[52px] w-[3px] rounded-r-[2px] bg-[linear-gradient(180deg,#4a4c51,#26282b)] max-lg:top-[94px] max-lg:h-[38px]"
          aria-hidden="true"
        />
        <div
          className={[
            "relative aspect-[9/19.2] overflow-hidden rounded-[38px] bg-[#050505]",
            "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.9)]",
            "max-lg:rounded-[28px]",
          ].join(" ")}
        >
          <div
            className="absolute top-[11px] left-1/2 z-[3] h-[21px] w-[74px] -translate-x-1/2 rounded-full bg-[#0d0d0f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] max-lg:top-2 max-lg:h-4 max-lg:w-[54px]"
            aria-hidden="true"
          />
          <div
            className={[
              "absolute inset-[9px] overflow-hidden rounded-[32px] bg-[#0c0c0c]",
              "shadow-[inset_0_0_0_1px_rgba(232,230,225,0.07)]",
              "max-lg:inset-[7px] max-lg:rounded-[23px]",
            ].join(" ")}
          >
            <VideoSlot device="mobile" played={played} onPlay={onPlay} />
          </div>
        </div>
      </div>
      <div
        className="h-6 bg-[radial-gradient(ellipse_42%_58%_at_50%_0%,rgba(0,0,0,0.8),transparent_72%)]"
        aria-hidden="true"
      />
    </div>
  );
}

export function Demo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [device, setDevice] = useState<DemoDevice>("desktop");
  const [played, setPlayed] = useState<Record<DemoDevice, boolean>>({
    desktop: false,
    mobile: false,
  });

  useSectionReveal({
    scope: sectionRef,
    scrollEnter,
    groups: [
      {
        selector: ".demo-header > *",
        trigger: ".demo-header",
        from: { autoAlpha: 0, y: 40 },
        to: { duration: 0.95, stagger: 0.14, ease: PREMIUM_EASE },
      },
      {
        selector: ".demo-toggle",
        trigger: ".demo-toggle",
        from: { autoAlpha: 0, y: 24 },
        to: { duration: 0.8, ease: PREMIUM_EASE },
      },
      {
        selector: ".demo-stage",
        trigger: ".demo-stage",
        from: { autoAlpha: 0, y: 36 },
        to: { duration: 0.95, ease: PREMIUM_EASE },
      },
      {
        selector: ".demo-footer > *",
        trigger: ".demo-footer",
        from: { autoAlpha: 0, y: 16 },
        to: { duration: 0.7, stagger: 0.1, ease: PREMIUM_EASE },
      },
    ],
  });

  function selectDevice(next: DemoDevice) {
    if (next === device) {
      return;
    }
    setDevice(next);
    trackDemoDeviceToggled(next);
  }

  function play(d: DemoDevice) {
    setPlayed((prev) => ({ ...prev, [d]: true }));
    trackDemoVideoPlayed(d);
  }

  return (
    <section id="demo" ref={sectionRef} className={sectionPadClass}>
      <Container>
        <SectionHeader
          className="demo-header !max-w-3xl"
          eyebrowClassName="opacity-0"
          titleClassName="opacity-0"
          subheadClassName="opacity-0"
          eyebrow={demo.eyebrow}
          title={
            <>
              {demo.titleLine1}{" "}
              <span className="italic text-[var(--text-secondary)]">
                {demo.titleLine2}
              </span>
            </>
          }
          subhead={demo.subhead}
        />

        <div
          className={[
            "demo-toggle relative mt-2 inline-flex cursor-pointer rounded-full border border-[rgba(232,230,225,0.12)] p-1 opacity-0",
            "bg-[linear-gradient(180deg,rgba(232,230,225,0.045),rgba(232,230,225,0.01))]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          ].join(" ")}
          role="tablist"
          aria-label="Choose a device"
          onKeyDown={(event) =>
            onTabListKeyDown(event, DEMO_DEVICES, device, selectDevice)
          }
        >
          <span
            className={[
              "pointer-events-none absolute top-1 left-1 size-11 rounded-full",
              "bg-[linear-gradient(180deg,#dcbb7d,#c9a96e)]",
              "shadow-[0_6px_16px_-8px_rgba(201,169,110,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]",
              "transition-transform duration-[420ms] ease-[cubic-bezier(0.6,0.05,0.2,1)]",
              device === "mobile" ? "translate-x-11" : "translate-x-0",
            ].join(" ")}
            aria-hidden="true"
          />
          {DEMO_DEVICES.map((d) => {
            const active = d === device;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                id={`demo-tab-${d}`}
                aria-label={demo.devices[d].label}
                aria-selected={active}
                aria-controls={`demo-panel-${d}`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectDevice(d)}
                className={[
                  focusRingClass,
                  "relative z-[1] grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent transition-colors duration-300",
                  active
                    ? "text-[#12100c]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                {d === "desktop" ? (
                  <DesktopIcon className="size-5" />
                ) : (
                  <MobileIcon className="size-5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="demo-stage mt-8 w-full opacity-0 lg:mt-10">
          {device === "desktop" ? (
            <MacBookFrame
              played={played.desktop}
              onPlay={() => play("desktop")}
            />
          ) : (
            <IPhoneFrame
              played={played.mobile}
              onPlay={() => play("mobile")}
            />
          )}
        </div>

        <div className="demo-footer mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-text text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)] opacity-0">
            {demo.disclaimer}
          </p>
          <a
            href={demo.fullRunHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${focusRingClass} inline-flex cursor-pointer items-center gap-2 font-mono-text text-[0.7rem] uppercase tracking-[0.12em] text-[var(--gold)] opacity-0 transition-colors hover:text-[var(--gold-bright)]`}
          >
            Watch the full run on YouTube
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
