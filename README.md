# Flower Piece (WIP)

[![Build Status](https://travis-ci.org/Basaltic/flowerpiece.svg?branch=master)](https://travis-ci.org/Basaltic/flowerpiece)
[![codecov](https://codecov.io/gh/Basaltic/flowerpiece/branch/master/graph/badge.svg)](https://codecov.io/gh/Basaltic/flowerpiece)

A Piece Table Text Sequence Implementation

# installing

Using npm:

```
$ npm install flowerpiece
```

Using yarn:

```
$ yarn add flowerpiece
```

# Examples

```javascript
import { PieceTree } from 'flowerpiece'

const tree = new PieceTree()
```

# APIs

## Piece Tree API

- redo()
- undo()
- insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]
- delete(offset: number, length: number): Diff[]
- format(offset: number, length: number, meta: PieceMeta): Diff[]

## Diff

Diff indicate which line of content is newly added, removed or modified after operation

```typescript
export interface Diff {
  type: 'insert' | 'remove' | 'replace'
  lineNumber: number
}
```

## PieceMeta

```typescript
export interface PieceMeta {
  [key: string]: number | string | PieceMeta
}
```
