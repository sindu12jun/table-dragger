import SortableTable from './index';

/* eslint-disable */
const table2 = window.document.querySelector('#table2');
new SortableTable(table2, {
  mode: 'column',
  excludeFooter: true,
  onChoose: function ({ table, from, to }) {
  }
});
