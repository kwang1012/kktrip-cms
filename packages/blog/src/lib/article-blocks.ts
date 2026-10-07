import { contentHtml } from './emdash-post'
import { addHeadingIds } from './toc'

/** Attach matching outline IDs while retaining EmDash's image/table/embed blocks. */
export function articleBlocks(blocks: Array<{ _type: string; [key: string]: unknown }>) {
  const { toc } = addHeadingIds(contentHtml(blocks))
  let heading = 0
  return blocks.map(block => {
    if (block._type !== 'block' || (block.style !== 'h2' && block.style !== 'h3')) return block
    const { toc: own } = addHeadingIds(contentHtml([block]))
    return own.length ? { ...block, _headingId: toc[heading++]?.id } : block
  })
}
