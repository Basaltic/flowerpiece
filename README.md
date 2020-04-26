# Flower Piece (WIP)

[![Build Status](https://travis-ci.org/Basaltic/flowerpiece.svg?branch=master)](https://travis-ci.org/Basaltic/flowerpiece)
[![codecov](https://codecov.io/gh/Basaltic/flowerpiece/branch/master/graph/badge.svg)](https://codecov.io/gh/Basaltic/flowerpiece)

A Rich Text Editor Data Model

**Warning: Before 1.0.0 release, the api may change. It's not prepared for production now.**

# Features

##### Rich Text Manipulation Operations
##### Build-in Redo/Undo
##### Statistic / Counts

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

# Objects

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
interface Line {
  meta: PieceMeta
  pieces: Piece[]
}
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

# APIs

## Piece Tree API

##### change(callback: (...args: any) => void)
##### startChange()
##### endChange()
##### redo()
##### undo()

##### insertText(offset: number, text: string, meta: PieceMeta | null)
##### insertLineBrea(offset: number, meta: PieceMeta | null)
##### insertLine(offset: number, meta: PieceMeta | null)
##### insertNonText(offset: number, meta: PieceMeta)
##### deleteLine(lineNumber: number)
##### formatLine(lineNumber: number, meta: PieceMeta)

##### insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]
##### delete(offset: number, length: number): Diff[]
##### format(offset: number, length: number, meta: PieceMeta): Diff[]

##### getAllText()
##### getLine(lineNumber: number): Piece[]
##### getLInes(): Line[]
##### getLineMeta(lineNumber: number): PieceMeta | null
##### getPieces(): Piece[]

##### forEachLine(callback: (line: IPiece[], lineNumber: number)


