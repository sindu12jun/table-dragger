/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import './main.css';
import DragColumn from './drag-column';
import DragRow from './drag-row';

(function sortableModule (factory) {
  /* eslint-disable no-undef */
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else {
    window.SortableTable = factory();
  }
}(() => {
    return function TableDragger (el, options) {
      if (options.mode === 'row') {
        return new DragRow(el, options);
      } else {
        return new DragColumn(el, options);
      }
    }
  }
));
