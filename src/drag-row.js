/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, sort, css } from './util';

export default class DragRow extends Drag {
  constructor (table = null, userOptions) {
    super(table, userOptions);
  }

  static create (el, options) {
    const d = new DragRow(el, options);
    return d && d.dragger;
  }
}
