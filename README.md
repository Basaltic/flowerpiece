# Flower Piece (WIP)

A Rich Text Editor Data Model

**Warning: Before 1.0.0 release, the api may change. It's not prepared for production now.**

[![Build Status](https://travis-ci.org/Basaltic/flowerpiece.svg?branch=master)](https://travis-ci.org/Basaltic/flowerpiece)
[![codecov](https://codecov.io/gh/Basaltic/flowerpiece/branch/master/graph/badge.svg)](https://codecov.io/gh/Basaltic/flowerpiece)


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
import { Model } from 'flowerpiece'

cconst model = new Model()
const { operations, queries } = model

model.change((operations) => {
  operations.insert(0, 'test', {})
})


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

## Model

### operations: Operations

##### insertText(offset: number, text: string, meta: PieceMeta | null)
##### insertLineBrea(offset: number, meta: PieceMeta | null)
##### insertLine(offset: number, meta: PieceMeta | null)
##### insertNonText(offset: number, meta: PieceMeta)
##### deleteLine(lineNumber: number)

##### formatText(offset: number, length: number, meta: PieceMeta): Diff[]
##### formatNonText(offset: number, length: number, meta: PieceMeta): Diff[]
##### formatLine(lineNumber: number, meta: PieceMeta)
##### formatInLine(lineNumber: number, meta: PieceMeta)
##### formatTextInLine(lineNumber: number, meta: PieceMeta)
##### formatNonTextInLine(linetNumber: number, meat: PieceMeta)

##### insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]
##### delete(offset: number, length: number): Diff[]
##### format(offset: number, length: number, meta: PieceMeta): Diff[]

### queries: Queries

##### getMaxOffset()
##### getCountOfCharacter()
##### getCountOfLine()
##### getAllText()
##### getLine(lineNumber: number): Piece[]
##### getLInes(): Line[]
##### getLineMeta(lineNumber: number): PieceMeta | null
##### getPieces(): Piece[]

## Methods

##### change(callback: (operations: operations) => void)
##### redo()
##### undo()

##### forEachLine(callback: (line: IPiece[], lineNumber: number)


