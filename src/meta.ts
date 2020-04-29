import merge from 'lodash.merge'
import { enableES5, enablePatches, enableMapSet, produceWithPatches, Patch } from 'immer'

enableES5()
enablePatches()
enableMapSet()

export interface PieceMeta {
  [key: string]: any
}

/**
 *
 * @param target
 * @param source
 */
export function mergeMeta(target: PieceMeta | null, source: PieceMeta | null): [PieceMeta, Patch[]] | null {
  if (source) {
    if (target === null) target = {}

    const [nextState, , inversePatches] = produceWithPatches(target, draft => {
      merge(draft, source)
    })

    return [nextState, inversePatches]
  }

  return null
}
