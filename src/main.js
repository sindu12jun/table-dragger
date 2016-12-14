import TableDragger from './index';

/* eslint-disable */
const table2 = window.document.querySelector('#table2');
// TableDragger(table2, { mode: 'column', excludeFooter: true, animation: 300 })
TableDragger(table2, { mode: 'row', excludeFooter: true, animation: 300, onlyBody: true })
  .on('onDrop', (from, to) => {
    console.log(from);
    console.log(to);
  });
// new SortableTable(table2, { mode: 'column', excludeFooter: true });
