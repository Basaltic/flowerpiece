export interface Operation {
  execute()
  getReverse(): Operation
}
