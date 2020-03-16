# Flower Piece (WIP)

[![Build Status](https://travis-ci.org/github/Basaltic/flowerpiece.png?branch=master)](https://travis-ci.org/github/Basaltic/flowerpiece)

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

## Piece Tree

- redo()
- undo()
- insert(offset: number, length: number, text: string, meta: PieceMeta | null): Diff[]
- delete(offset: number, length: number): Diff[]
- format(offset: number, length: number, meta: PieceMeta): Diff[]

## Diff

- type
  - insert
  - remove
  - replace
- lineNumber: which line is inserted，removed or replaced

## PieceMeta

- Must be plain object
- Have to only have one level
