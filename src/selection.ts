import { Range } from './selection-range'

export class Selection {
    public range: Range

    constructor(range: Range = new Range()) {
        this.range = range
    }
}
