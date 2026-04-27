import { useProcessingStore } from "../store";

function formatElapsed(ms: number): string {
  if (ms < 1000) return "";
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
}

export default function ProcessingBox() {
  const { steps, progress, elapsedMs } = useProcessingStore();
  const elapsed = formatElapsed(elapsedMs);

  // Dynamic label: hint about cold-start after 8s
  const isWarm = elapsedMs < 8000;
  const subLabel = isWarm
    ? "AI is analysing your image…"
    : "Server is warming up — this can take up to 30 s on first use";

  return (
    <div className="bg-white border border-line rounded-[28px] p-12 sm:p-16 text-center shadow-md">
      {/* Spinner */}
      <div className="w-14 h-14 mx-auto mb-7 rounded-full border-[3px] border-line border-t-purple animate-spin" />

      <h3 className="text-[17px] font-bold text-text mb-1.5">
        Removing background
      </h3>
      <p className="text-[13px] text-muted mb-2 leading-relaxed max-w-xs mx-auto">
        {subLabel}
      </p>

      {elapsed && (
        <p className="text-[12px] font-semibold text-purple mb-7 tabular-nums">
          {elapsed} elapsed
        </p>
      )}

      {!elapsed && <div className="mb-7" />}

      {/* Progress bar — only shown once upload starts reporting */}
      {progress > 0 && (
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-purple rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted2 mt-2 tabular-nums">
            {progress}%
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="inline-flex flex-col gap-2.5 text-left">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 text-[13px] font-medium transition-colors duration-300 ${
              step.status === "active"
                ? "text-purple"
                : step.status === "done"
                  ? "text-green-600"
                  : "text-muted2"
            }`}
          >
            {step.status === "done" ? (
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className="w-3 h-3 text-green-500 flex-shrink-0"
              >
                <path
                  d="M2 6l2.5 2.5L10 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span
                className={`w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all duration-300 ${
                  step.status === "active"
                    ? "bg-purple animate-pulseDot"
                    : "bg-line2"
                }`}
              />
            )}
            {step.label}
          </div>
        ))}
      </div>

      {/* Cold-start reassurance */}
      {elapsedMs > 12000 && (
        <p className="text-[11.5px] text-muted2 mt-8 max-w-[240px] mx-auto leading-relaxed">
          Still working — please don't close this tab. Large or complex images
          can take longer.
        </p>
      )}
    </div>
  );
}
