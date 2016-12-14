/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, empty, sort, css } from './util';

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
      if (c) {
        css(c, { width: '' });
      } else {
        throw new Error('Please make sure the length of col element is equal with table\'s row length');
      }
      Array.from(cols).forEach((col) => {
        if (col !== c) {
          col.parentElement.removeChild(col);
        }
      });
    }

    table.removeAttribute('id');
    table.classList.remove(classes.originTable);
    Array.from(table.rows).forEach((row) => {
      const target = row.children[index];
      empty(row);
      if (target) {
        row.appendChild(target);
      }
    });
    return table;
  }

  sizeFake () {
    // 列排列时重新计算每一列的宽度
    Array.from(this.getLongestRow().children).forEach(
      (cell, index) => {
        const t = this.fakeTables[index];
        // table 的width比td稍微宽一点，所以不要直接给table直接赋宽度
        css((t.querySelector('td') || t.querySelector('th')), { width: `${cell.getBoundingClientRect().width}px` });
      }
    );
    // 列排列时重新计算每一行的高度
    const rowHeights = Array.from(this.el.rows)
      .map(row => row.children[0].getBoundingClientRect().height);
    this.fakeTables.forEach((table) => {
      /* eslint-disable no-param-reassign*/
      Array.from(table.rows).forEach((row, index) => {
        css(row, { height: `${rowHeights[index]}px` });
      });
    });
  }

  sortColumn ({ from, to }) {
    if (from === to) {
      return;
    }

    Array.from(this.el.rows).forEach((row) => {
      // if (row.parentElement.nodeName === 'TFOOT' && this.options.excludeFooter) {
      //   return;
      // }
      sort({ list: row.children, from, to });
    });

    const cols = this.getCols();
    if (cols) {
      sort({ list: cols, from, to });
    }
  }

  onDrop ({ from, to }) {
    this.sortColumn({ from, to });
  }

  static create (el, options) {
    const d = new DragColumn(el, options);
    return d && d.dragger;
  }
}
