/**
 * Keep One Level. No nest object
 */
export interface PieceMeta {
  [key: string]: any
}

/**
 * Merge Two Meta. Return the
 *
 *
 * @param target
 * @param source
 */
export function mergeMeta(target: PieceMeta | null, source: PieceMeta | null): PieceMeta | null {
  if (source) {
    const reverse: PieceMeta = {}

    if (target === null) {
      target = {}
    }

    for (const key of Object.keys(source)) {
      reverse[key] = target[key]
      target[key] = source[key]
    }

    return reverse
  }

  return null
}
