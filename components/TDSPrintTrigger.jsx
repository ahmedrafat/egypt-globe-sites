'use client'

import Icon from './ui/Icon'

/**
 * TDSPrintTrigger — small client island that adds a "Print / Save as
 * PDF" button to the TDS toolbar. Triggers window.print() — the
 * @media print rules in the TDS layout strip the toolbar so the
 * resulting PDF is a clean A4 document.
 */
export default function TDSPrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 bg-[#1d5fa1] hover:bg-[#14467a] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
    >
      <Icon name="print" className="w-3.5 h-3.5" /> Print / Save as PDF
    </button>
  )
}
