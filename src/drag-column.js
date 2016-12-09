/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, empty, sort } from './util';

export default class DragColumn extends Drag {
  constructor (table = null, userOptions) {
    super(table, userOptions);
  }

  buildTables () {
    return Array.from(this.getLongestRow().children).map((cell, index) =>
      this.getColumnAsTableByIndex(index));
  }

  getColumnAsTableByIndex (index) {
    const table = this.el.cloneNode(true);
    const cols = table.querySelectorAll('col');

    // table.style.borderCollapse = 'collapse';

    // TODO 处理excludeFooter
    // const footer = table.querySelector('tfoot');
    // if (this.options.excludeFooter && footer) {
    //   table.removeChild(footer);
    // }

    if (cols) {
      const c = cols[index];
      c.style.width = '';
      Array.from(cols).forEach((col) => {
        if (col !== c)
          col.parentNode.removeChild(col);
      })
    }

    table.removeAttribute('id');
    table.classList.remove(classes.originTable);
    Array.from(table.rows).forEach(row => {
      const target = row.children[index];
      empty(row);
      row.appendChild(target);
    })
    return table;
  }

  sizeFake () {
    // 列排列时重新计算每一列的宽度
    Array.from(this.getLongestRow().children).forEach(
      (cell, index) => {
        this.fakeTables[index].style.width = `${cell.getBoundingClientRect().width}px`;
      }
    );
    // 列排列时重新计算每一行的高度
    const rowHeights = Array.from(this.el.rows).map(row => row.children[0].getBoundingClientRect().height);
    this.fakeTables.forEach((table) => {
      /* eslint-disable no-param-reassign*/
      Array.from(table.rows).forEach((row, index) => {
        row.style.height = `${rowHeights[index]}px`;
      })
    });
  }

  sortColumn ({ from, to }) {
    if (from === to) {
      return;
    }

    Array.from(this.el.rows).forEach((row) => {
      if (row.parentElement.nodeName === 'TFOOT' && this.options.excludeFooter) {
        return;
      }
      sort({ list: row.children, from, to });
    });

    if (this.cols) {
      sort({ list: this.cols, from, to });
    }

  }

  _onDrop ({ from, to }) {
    this.sortColumn({ from, to });
  }

  static create (el, options) {
    return new SortableTable(el, options);
  }
}
