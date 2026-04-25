import { useProcessingStore } from '../store'

export default function ProcessingBox() {
  const { steps, progress } = useProcessingStore()

  return (
    <div className="bg-white border border-line rounded-[28px] p-16 text-center shadow-md">
      {/* Spinner */}
      <div className="w-14 h-14 mx-auto mb-7 rounded-full border-[3px] border-line border-t-purple animate-spin" />

      <h3 className="text-[17px] font-bold text-text mb-1.5">Processing your image</h3>
      <p className="text-[13.5px] text-muted mb-9">This usually takes 2–4 seconds</p>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-purple rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted2 mt-2">{progress}%</p>
        </div>
      )}

      {/* Steps */}
      <div className="inline-flex flex-col gap-2.5 text-left">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 text-[13px] font-medium transition-colors duration-300 ${
              step.status === 'active' ? 'text-purple' :
              step.status === 'done'   ? 'text-green-600' :
                                         'text-muted2'
            }`}
          >
            <span
              className={`w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all duration-300 ${
                step.status === 'active' ? 'bg-purple animate-pulseDot' :
                step.status === 'done'   ? 'bg-green-500' :
                                           'bg-line2'
              }`}
            />
            {step.status === 'done' && (
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-green-500 -ml-4 mr-1 flex-shrink-0">
                <path d="M2 6l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}
