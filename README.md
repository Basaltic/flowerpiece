# Flower Piece (WIP)

[![Build Status](https://travis-ci.org/Basaltic/flowerpiece.svg?branch=master)](https://travis-ci.org/Basaltic/flowerpiece)
[![codecov](https://codecov.io/gh/Basaltic/flowerpiece/branch/master/graph/badge.svg)](https://codecov.io/gh/Basaltic/flowerpiece)

A Piece Table Text Sequence Implementation

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

- startChange()
- endChange()
- redo()
- undo()
- insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]
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
export interface PieceMeta {
  [key: string]: number | string | PieceMeta
}
```
