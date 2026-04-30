/**
 * RichPageBody — clean, focused prose layout.
 *
 * No magazine ornaments (TOC sidebar, reading-time meta, drop caps,
 * chapter chips). Just well-typeset prose in a comfortable reading
 * width with subtle brand accents.
 */
import MarkdownBody from './MarkdownBody'

export default function RichPageBody({ content }) {
  if (!content?.trim()) return null
  return (
    <div className="max-w-3xl mx-auto">
      <MarkdownBody content={content} />
    </div>
  )
}
