import TableDragger from './index';

/* eslint-disable */
const table2 = window.document.querySelector('#table2');
TableDragger(table2, { mode: 'column', excludeFooter: true });
// new SortableTable(table2, { mode: 'column', excludeFooter: true });
