/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import SortableTable from './OriginTable';

// const table2 = window.document.querySelector('#table2');

/* eslint-disable no-new */
// new SortableTable(table2, { mode: 'row' });
// new SortableTable(table2, { mode: 'column' });
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
