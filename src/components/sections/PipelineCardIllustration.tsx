import type { PipelineIllustration } from "@/content/home";

export function PipelineCardIllustration({
  variant,
  compact = false,
  hero = false,
}: {
  variant: PipelineIllustration;
  compact?: boolean;
  hero?: boolean;
}) {
  const sizeClass = hero ? " pipeline-card-art--hero" : compact ? " pipeline-card-art--compact" : "";

  return (
    <div
      className={`pipeline-card-art pipeline-card-art--${variant}${sizeClass}`}
      aria-hidden="true"
    >
      {variant === "capture" ? (
        <>
          <span className="pipeline-art-mic" />
          <div className="pipeline-art-waveform">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className="pipeline-art-bar" />
            ))}
          </div>
        </>
      ) : null}

      {variant === "transcript" ? (
        <div className="pipeline-art-lines">
          {[92, 78, 88, 64].map((width) => (
            <span key={width} className="pipeline-art-line" style={{ width: `${width}%` }} />
          ))}
        </div>
      ) : null}

      {variant === "research" ? (
        <div className="pipeline-art-search">
          <span className="pipeline-art-node pipeline-art-node--a" />
          <span className="pipeline-art-node pipeline-art-node--b" />
          <span className="pipeline-art-node pipeline-art-node--c" />
          <span className="pipeline-art-link pipeline-art-link--ab" />
          <span className="pipeline-art-link pipeline-art-link--bc" />
        </div>
      ) : null}

      {variant === "schema" ? (
        <div className="pipeline-art-schema">
          <span className="pipeline-art-brace">{"{"}</span>
          <div className="pipeline-art-lines">
            {[70, 54, 62].map((width) => (
              <span key={width} className="pipeline-art-line" style={{ width: `${width}%` }} />
            ))}
          </div>
          <span className="pipeline-art-brace">{"}"}</span>
        </div>
      ) : null}

      {variant === "parallel" ? (
        <div className="pipeline-art-parallel">
          {["Brand", "Jira", "Confluence", "Eng"].map((label) => (
            <span key={label} className="pipeline-art-chip">
              {label}
            </span>
          ))}
        </div>
      ) : null}

      {variant === "brand" ? (
        <div className="pipeline-art-swatches">
          <span className="pipeline-art-swatch pipeline-art-swatch--a" />
          <span className="pipeline-art-swatch pipeline-art-swatch--b" />
          <span className="pipeline-art-swatch pipeline-art-swatch--c" />
        </div>
      ) : null}

      {variant === "jira" ? (
        <div className="pipeline-art-tickets">
          {[0, 1, 2].map((ticket) => (
            <span key={ticket} className="pipeline-art-ticket" />
          ))}
        </div>
      ) : null}

      {variant === "confluence" ? (
        <div className="pipeline-art-pages">
          {[0, 1].map((page) => (
            <span key={page} className="pipeline-art-page" />
          ))}
        </div>
      ) : null}

      {variant === "engineering" ? (
        <div className="pipeline-art-code">
          <span>&lt;/&gt;</span>
        </div>
      ) : null}

      {variant === "repo" ? (
        <div className="pipeline-art-repo">
          <span className="pipeline-art-folder" />
          <div className="pipeline-art-lines">
            {[76, 58, 68].map((width) => (
              <span key={width} className="pipeline-art-line" style={{ width: `${width}%` }} />
            ))}
          </div>
        </div>
      ) : null}

      {variant === "deploy" ? (
        <div className="pipeline-art-deploy">
          <span className="pipeline-art-browser-bar" />
          <span className="pipeline-art-browser-body" />
        </div>
      ) : null}
    </div>
  );
}
