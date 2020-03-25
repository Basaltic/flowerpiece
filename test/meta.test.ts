import { mergeMeta } from '../src/meta'

it('mergeMeta test 1', () => {
  const target = {
    age: 10,
    obj: {
      color: 10,
    },
  }

  const source = {
    age: 11,
    obj: {
      color: 11,
      ss: 10,
    },
  }

  let mergeResult = mergeMeta(target, source)
  expect(mergeResult).toEqual([
    { age: 11, obj: { color: 11, ss: 10 } },
    [
      { op: 'replace', path: ['obj', 'color'], value: 10 },
      { op: 'remove', path: ['obj', 'ss'] },
      { op: 'replace', path: ['age'], value: 10 },
    ],
  ])

  mergeResult = mergeMeta({}, null)
  expect(mergeResult).toBeNull()

  mergeResult = mergeMeta(null, null)
  expect(mergeResult).toBeNull()
})
