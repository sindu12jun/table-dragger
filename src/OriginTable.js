/**
 * Created by lijun on 2016/11/16.
 */
import { empty, appendSibling, insertBeforeSibling, handleTr } from './util';
import SortTableList from './SortTableList';

class Table {
  constructor(table = null) {
    this.el = table;
    this.visibility = table.style.visibility;
    this.movingRow = this.el.children[0].children[0];
    this.movingRow.style.cursor = 'move';
  }
}

// 注意class中所有的方法都是不可枚举的
export default class OriginTable extends Table {
  constructor(table = null) {
    super(table);
    for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
    this.mouseDownIndex = -1;
    this.sortTable = null;
    this.bindEvents();
  }

  getLength() { // 获得横向长度
    return this.el.children[0].children[0].children.length;
  }

  getColumnAsTable(index) {
    const table = this.el.cloneNode(true);

    const oneTd = this.el.children[0].children[0].children[index];
    table.style.width = `${oneTd.getBoundingClientRect().width}px`;
    handleTr(table, (tr) => {
      const target = tr.children[index];
      empty(tr);
      tr.appendChild(target);
    });
    return new Table(table);
  }

  getRowAsTable(index) {
    const table = this.el.cloneNode();
    table.style.width = `${oneTd.getBoundingClientRect().width}px`;

    let now = 0;
    handleTr(table, (tr, organ) => {
      if (index === now) {
        const shadowOrgan = organ.cloneNode();
        shadowOrgan.appendChild(tr);
        table.appendChild(shadowOrgan);
      }
      now += 1;
    });
    return new Table(table);
  }

  sortColumn({ from, to }) {
    if (from === to) {
      return;
    }
    handleTr(this.el, (tr) => {
      const { children } = tr;
      const target = children[from]; // 移动的元素
      const origin = children[to]; // 被动交换的元素
      if (from < to) {
        appendSibling({ target, origin });
      } else {
        insertBeforeSibling({ target, origin });
      }
    });
  }

  _onDrag(event) {
    const { movingRow } = this;
    this.mouseDownIndex = Array.from(movingRow.children).indexOf(event.target);
    const tables = Array.from(movingRow.children).map((td, index) =>
      this.getColumnAsTable(index));
    this.sortTable = new SortTableList({ tables, originTable: this });
    this.el.style.visibility = 'hidden';
  }

  onSortTableDrop({ from: oldIndex, to: newIndex }) {
    this.sortColumn({ from: oldIndex, to: newIndex });
    this.el.style.visibility = this.visibility;
    this.sortTable = null;
  }

  bindEvents() {
    const { movingRow } = this;
    const startEvents = ['mousedown', 'touchstart', 'pointerdown'];
    for (const e of startEvents) {
      movingRow.addEventListener(e, this._onDrag, true);
    }
  }
}
