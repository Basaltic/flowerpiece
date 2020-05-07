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

const changes = model.change((operations) => {
  operations.insert(0, 'test', {})
})

```

## Model

### operations

#### insert(offset: number, length: number, text: string, meta: PieceMeta | null): DocumentChange
#### insertText(offset: number, text: string, meta: PieceMeta | null): DocumentChange
#### insertLineBrea(offset: number, meta: PieceMeta | null): DocumentChange
#### insertLine(offset: number, meta: PieceMeta | null): DocumentChange
#### insertNonText(offset: number, meta: PieceMeta): DocumentChange

#### delete(offset: number, length: number): DocumentChange
#### deleteLine(lineNumber: number): DocumentChange

#### format(offset: number, length: number, meta: PieceMeta): DocumentChange
#### formatText(offset: number, length: number, meta: PieceMeta): DocumentChange
#### formatNonText(offset: number, length: number, meta: PieceMeta): DocumentChange
#### formatLine(lineNumber: number, meta: PieceMeta): DocumentChange
#### formatInLine(lineNumber: number, meta: PieceMeta): DocumentChange
#### formatTextInLine(lineNumber: number, meta: PieceMeta): DocumentChange
#### formatNonTextInLine(linetNumber: number, meat: PieceMeta): DocumentChange


### queries

#### getMaxOffset()
#### getCountOfCharacter()
#### getCountOfLine()
#### getAllText()
#### getLine(lineNumber: number): Piece[]
#### getLInes(): Line[]
#### getLineMeta(lineNumber: number): PieceMeta | null
#### getPieces(): Piece[]
#### forEachLine(callback: (line: IPiece[], lineNumber: number)

### Methods

#### change(callback: (operations: operations) => void)
#### redo()
#### undo()


## Piece

A Piece represet a piece content of the whole document

```typescript
interface Piece {
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
interface Diff {
  // Diff type
  type: 'insert' | 'remove' | 'replace'
  // Which line of content has change
  lineNumber: number
}
```

## PieceMeta

Must Be Plain Object

```typescript
interface PieceMeta {
  [key: string]: any
}
```

## DocumentChange
```typescript
interface DocumentChange {
  type: 'insert' | 'delete' | 'format'
  diffs: Diff[]
  startOffset: number
  length: number
}

```
