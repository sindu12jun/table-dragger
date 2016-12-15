/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, empty, sort, css } from './util';

export default class DragColumn extends Drag {
  constructor (table = null, userOptions) {
    super(table, userOptions);
  }





  onDrop ({ from, to }) {
    this.sortColumn({ from, to });
  }

  static create (el, options) {
    const d = new DragColumn(el, options);
    return d && d.dragger;
  }
}
