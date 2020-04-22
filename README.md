# Flower Piece (WIP)

[![Build Status](https://travis-ci.org/Basaltic/flowerpiece.svg?branch=master)](https://travis-ci.org/Basaltic/flowerpiece)
[![codecov](https://codecov.io/gh/Basaltic/flowerpiece/branch/master/graph/badge.svg)](https://codecov.io/gh/Basaltic/flowerpiece)

A （Rich） Text Data Model

**Warning: Before 1.0.0 release, the api may change. It's not prepared for production now.**

# Features

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

```typescript
import { PieceTree } from 'flowerpiece'

const tree = new PieceTree()

tree.startChange()

tree.insert(0, 'this is an example')
tree.delete(0, 10)

tree.endChange()
```

# APIs

## Piece Tree API

- initialize(pieces: Piece[])
- change(callback: (...args: any) => void)
- startChange()
- endChange()

```typescript
// operations between 'startChange' and 'endChange' are considered as a operation combination.

const tree = new PieceTree()

tree.startChange()

tree.insert(0, 'test')
tree.insert(2, 'tt)

tree.endChange()

// Above two operations will redo and undo togethor
tree.undo()
tree.redo()

```

- redo()
- undo()
- insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]

```typescript
const tree = new PieceTree()

tree.insert(0, 'This is an example')
```

- delete(offset: number, length: number): Diff[]
- format(offset: number, length: number, meta: PieceMeta): Diff[]
- getAllText()
- getLine(lineNumber: number): Piece[]
- getPieces(): Piece[]
- forEachLine(callback: (line: IPiece[], lineNumber: number)
- forEachPiece(callback: (piece: IPiece, index: number)

## Piece

A Piece represet a piece content of the whole document

```typescript
export interface Piece {
  // Text Content
  text: string
  // Length of this piece
  length: number
  // Meta info of this piece
  meta: PieceMeta | null
}
```

## Line

A Line is a list of pieces

```typescript
declare type Line = Piece[]
```

## Diff

Diff indicate which line of content is newly added, removed or modified after operation

```typescript
export interface Diff {
  // Diff type
  type: 'insert' | 'remove' | 'replace'
  // Which line of content has change
  lineNumber: number
}
```

## PieceMeta

```typescript
export interface IPieceMeta {
  [key: string]: any
}

export class PieceMeta implements IPieceMeta {
  [immerable] = true
}
```
