/**
 * Created by lijun on 2016/12/7.
 */
import Drag from './drag';
import { classes, sort } from './util';

export default class DragRow extends Drag {
  constructor (table = null, userOptions) {
    super(table, userOptions);
  }

  sortRow ({ from, to }) {
    if (from === to) {
      return;
    }
    const list = this.getRows();
    sort({ list, parent: list[to].parentElement, from, to });
  }

  onDrop ({ from, to }) {
    this.sortRow({ from, to });
  }

  getRows () {
    const { el } = this;
    // if (this.options.onlyBody) {
    //   return Array.from(el.tBodies).reduce((prev, next) => {
    //     Array.from(next.children).forEach((r) => {
    //       prev.push(r);
    //     });
    //     return prev;
    //   }, []);
    // }
    return Array.from(el.rows);
  }

  sizeFake () {
    const cells = this.getLongestRow().children;
    // 行排列时计算每一行各个cell宽度
    /* eslint-disable no-param-reassign*/
    this.fakeTables.forEach((table) => {
      Array.from(table.rows[0].children).forEach((cell, i) => {
        cell.style.width = `${cells[i].getBoundingClientRect().width}px`;
      });
    });
    // 行排列时计算每一行高度
    // 似乎用不着计算
    // this.fakeTables.forEach((table, index) => {
    //   /* eslint-disable no-param-reassign*/
    //   table.style.height = `${this.el.rows[index].getBoundingClientRect().height}px`;
    // });
  }

  buildTables () {
    return this.getRows().map((row) => {
      const table = this.el.cloneNode(true);
      const cols = table.querySelectorAll('col');
      table.removeAttribute('id');
      table.classList.remove(classes.originTable);
      table.innerHTML = '';
      if (cols) {
        const f = document.createDocumentFragment();
        Array.from(cols).forEach((col) => {
          f.appendChild(col);
        });
        table.appendChild(f);
      }
      const organ = row.parentNode.cloneNode();
      organ.innerHTML = '';
      organ.appendChild(row.cloneNode(true));
      table.appendChild(organ);
      return table;
    });
  }

  static create (el, options) {
    const d = new DragRow(el, options);
    return d && d.dragger;
  }
}
