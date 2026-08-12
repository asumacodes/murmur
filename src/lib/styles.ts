/** Shared marketing chrome class strings — prefer these over globals.css component rules. */

export const focusRingClass =
  "outline-none focus-visible:shadow-[0_0_0_2px_var(--bg-deep),0_0_0_4px_var(--gold-bright)]";

export const sectionPadClass = "py-[clamp(2.75rem,5.5vw,5.5rem)]";

/** Pipeline section pad (overrides shared sectionPad with asymmetric top / zero bottom). */
export const pipelineSectionPadClass =
  "pt-[clamp(3rem,8vw,4.5rem)] pb-0 lg:pt-[clamp(3.5rem,7vw,6rem)]";

export const containerClass = "mx-auto w-[min(100%-2rem,1240px)]";

export const skipLinkClass =
  "fixed top-4 left-4 z-[100] -translate-y-[150%] rounded-full border border-[var(--border-gold)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-primary)] transition-transform duration-[180ms] ease-[var(--ease-out)] focus:translate-y-0 focus:outline-none";

export const goldLinkClass =
  "relative text-[var(--gold)] after:absolute after:right-0 after:bottom-[-0.2rem] after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--gold)] after:transition-transform after:duration-150 after:ease-[var(--ease-out)] after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100";

export const navLinkClass =
  "relative text-[var(--text-secondary)] transition-colors duration-200 ease-[var(--ease-out)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)] aria-[current=location]:text-[var(--text-primary)] after:absolute after:right-0 after:bottom-[-0.35rem] after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--gold)] after:transition-transform after:duration-[220ms] after:ease-[var(--ease-out)] after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=location]:after:scale-x-100";

export const textInvertClass =
  "bg-[var(--text-primary)] px-[0.2em] py-[0.02em] text-[var(--bg-deep)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";
