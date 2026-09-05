import type { CSSProperties } from "react";

export function CrackerLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="relative pb-6">
        <svg
          viewBox="0 0 64 64"
          className="cracker-rocket h-14 w-14"
          aria-hidden="true"
        >
          {/* stick */}
          <line
            x1="32"
            y1="40"
            x2="32"
            y2="62"
            stroke="oklch(0.55 0.08 60)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* nose cone */}
          <polygon points="24,20 40,20 32,6" fill="var(--color-gold)" />
          {/* body */}
          <rect
            x="24"
            y="20"
            width="16"
            height="22"
            rx="3"
            fill="var(--color-primary)"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
          />
          {/* gold band */}
          <rect x="24" y="27" width="16" height="4" fill="var(--color-gold)" />
        </svg>
        {/* fuse glow at rocket base */}
        <span className="cracker-fuse" aria-hidden="true" />
        {/* sparks */}
        <span className="cracker-spark" style={{ "--sx": "-16px", "--sy": "26px" } as React.CSSProperties} aria-hidden="true" />
        <span className="cracker-spark" style={{ "--sx": "14px", "--sy": "30px", animationDelay: "0.15s" } as React.CSSProperties} aria-hidden="true" />
        <span className="cracker-spark" style={{ "--sx": "-6px", "--sy": "34px", animationDelay: "0.3s" } as React.CSSProperties} aria-hidden="true" />
        <span className="cracker-spark" style={{ "--sx": "22px", "--sy": "20px", animationDelay: "0.45s" } as React.CSSProperties} aria-hidden="true" />
        <span className="cracker-spark" style={{ "--sx": "-24px", "--sy": "18px", animationDelay: "0.6s" } as React.CSSProperties} aria-hidden="true" />
      </div>
      {label && (
        <p className="cracker-text text-center text-sm font-semibold text-primary">
          {label}
        </p>
      )}
    </div>
  );
}
