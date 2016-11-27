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

// TODO 抛出异常、检查变量，防止js报错
// TODO 单元测试
// TODO 浏览器兼容
// 注意class中所有的方法都是不可枚举的
export default class OriginTable extends Table {
  constructor(table = null, userOptions) {
    super(table);

    const defaults = {};
    this.options = Object.assign({}, defaults, userOptions);

    for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
    this.el.classList.add('sindu_origin_table');
    this.mouseDownIndex = -1;
    this.sortTable = null;
    this.buildSortable();
  }

  getLength() { // 获得横向长度
    return this.el.children[0].children[0].children.length;
  }

  getColumnAsTable(index) {
    const table = this.el.cloneNode(true);
    table.classList.remove('sindu_origin_table');
    handleTr(table, ({ tr, trIndex }) => {
      if (trIndex === 0) {
        tr.classList.add('sindu_draggable');
      }
      const target = tr.children[index];
      empty(tr);
      tr.appendChild(target);
    });
    return new Table(table);
  }

  sortColumn({ from, to }) {
    if (from === to) {
      return;
    }
    handleTr(this.el, ({ tr }) => {
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

  buildSortable() {
    const { movingRow } = this;
    const tables = Array.from(movingRow.children).map((td, index) =>
      this.getColumnAsTable(index));
    this.sortTable = new SortTableList({ tables, originTable: this });
  }

  onSortTableDrop({ from: oldIndex, to: newIndex }) {
    this.sortColumn({ from: oldIndex, to: newIndex });
  }
}
