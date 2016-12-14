/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import './main.css';
import DragColumn from './drag-column';
import DragRow from './drag-row';

(function TableDraggerModule (factory) {
  /* eslint-disable no-undef */
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else {
    window.TableDragger = factory();
  }
}(
  () => function TableDragger (el, options) {
    return (options.mode === 'row' ? DragRow : DragColumn).create(el, options);
  }
));
