import { mergeMeta, PieceMeta } from '../src/meta'

it('flower piece: mergeMeta', () => {
  let reverse = mergeMeta(null, null)
  expect(reverse).toBe(null)

  reverse = mergeMeta(null, { width: 100, color: 'red' })
  expect(reverse).not.toBe(null)
  if (reverse) {
    expect(reverse.width).toBe(undefined)
    expect(reverse.color).toBe(undefined)
  }

  const target: PieceMeta = { color: 'green', height: 100 }
  reverse = mergeMeta(target, { width: 100, color: 'red' })
  expect(reverse).not.toBe(null)
  if (reverse) {
    expect(reverse.width).toBe(undefined)
    expect(reverse.color).toBe('green')
  }
})
