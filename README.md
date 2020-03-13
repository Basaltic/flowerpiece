# Flower Piece (WIP)

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

# Piece Tree API

- redo()
- undo()
- insert(offset: number, length: number, text: string, meta: PieceMeta | null)
- delete(offset: number, length: number)
- format(offset: number, length: number, meta: PieceMeta)
