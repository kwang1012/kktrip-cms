import { expect, it } from 'vitest'
import { articleBlocks } from './article-blocks'

it('keeps duplicate and CJK headings aligned with the article outline', () => {
  const heading = (text: string) => ({ _type: 'block', style: 'h2', markDefs: [], children: [{ _type: 'span', text, marks: [] }] })
  const image = { _type: 'image', asset: { url: 'https://example.com/photo.png' } }
  const blocks = articleBlocks([heading('旅行'), image, heading('旅行')])
  expect(blocks[0]._headingId).toBe('旅行')
  expect(blocks[1]).toBe(image)
  expect(blocks[2]._headingId).toBe('旅行-2')
})
