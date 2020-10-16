export class Selection {
  public focus: number
  public anchor: number

  constructor(focus: number, anchor: number) {
    this.focus = focus
    this.anchor = anchor
  }
}
