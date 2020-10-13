import { Operation } from 'operations'
import StringBuffer from 'stringBuffer'

/**
 * Insert
 */
export class InsertOperation implements Operation {
  private buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  constructor(buffers: StringBuffer[]) {
    this.buffers = buffers
  }

  execute() {}

  getReverse() {
    return new InsertOperation()
  }
}
