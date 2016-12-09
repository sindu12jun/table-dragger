/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, empty, sort } from './util';

export default class DragRow extends Drag {
  constructor (table = null, userOptions) {
    super(table, userOptions);

  }

  sortRow ({ from, to }) {
    // TODO 所有的行都dragula，但是在dragula中筛选出可排列和可被排列的行
    if (from === to) {
      return;
    }
    if (this.cols) {
      sort({ list: this.cols, from, to });
    }
  }

  _onDrop ({ from, to }) {
    this.sortRow({ from, to });
  }

  sizeFake () {
    const cells = this.getLongestRow().children;
    // 行排列时计算每一行各个cell宽度
    /* eslint-disable no-param-reassign*/
    this.fakeTables.forEach((table, index) => {
      Array.from(table.rows).forEach(row => {
        Array.from(row.children).forEach((cell, index) => {
          cell.style.width = `${cells[index]}px`;
        })
      })
      // table.style.height = `${rowHeights[index]}px`;
    });
    // 行排列时计算每一行高度
    this.fakeTables.forEach((table, index) => {
      /* eslint-disable no-param-reassign*/
      table.style.height = `${this.el.rows[index].getBoundingClientRect().height}px`;
    });
  }

  buildTables () {
    return Array.from(this.el.rows).map((row) => {
      const table = this.el.cloneNode(true);
      const cols = table.querySelectorAll('col');
      table.removeAttribute('id');
      table.classList.remove(classes.originTable);
      table.innerHTML = '';
      if (cols) {
        table.appendChild(cols);
      }
      const organ = row.parentNode.cloneNode();
      organ.innerHTML = '';
      organ.appendChild(row.cloneNode(true));
      table.appendChild(organ);
      return table;
    })
  }
}
