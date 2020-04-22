import merge from 'lodash.merge'
import { enableES5, enablePatches, enableMapSet, produceWithPatches, Patch, immerable } from 'immer'

enableES5()
enablePatches()
enableMapSet()

export interface IPieceMeta {
  [key: string]: any
}

/**
 * Keep One Level. No nest object
 * TODO: Must Be Plain Object
 */
export class PieceMeta implements IPieceMeta {
  [immerable] = true
}

/**
 *
 * @param target
 * @param source
 */
export function mergeMeta(target: IPieceMeta | null, source: IPieceMeta | null): [IPieceMeta, Patch[]] | null {
  if (source) {
    if (target === null) target = {}

    const [nextState, , inversePatches] = produceWithPatches(target, draft => {
      merge(draft, source)
    })

    return [nextState, inversePatches]
  }

  return null
}
