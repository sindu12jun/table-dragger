/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import './main.css';
import SortableTable from './OriginTable';

(function sortableModule (factory) {
  /* eslint-disable no-undef */
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else {
    window.SortableTable = factory();
  }
}(() => SortableTable
));
