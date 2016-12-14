/**
 * Created by lijun on 2016/12/7.
 */

// TODO 版本管理 version
// TODO 几个add和remove，用eventual
// TODO 起名dragger
// 加一个destroy方法
import DraggableList from './draggable-list';
import { on, remove, classes, emitter } from './util';
import '../node_modules/dragula/dist/dragula.min.css';

const doc = document;
const documentElement = doc.documentElement;

function checkIsTable (ele) {
  return typeof ele === 'object'
    &&
    'nodeType' in ele
    &&
    ele.nodeType === 1
    &&
    ele.cloneNode
    &&
    ele.nodeName === 'TABLE';
}

function isLeftButton (e) {
  if ('touches' in e) {
    return e.touches.length === 1;
  }
  if ('buttons' in e) {
    return e.buttons === 1;
  }
  if ('button' in e) {
    return e.button === 0;
  }
  return false;
}

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new Error(`TableSortable: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }

    this.onTap = this.onTap.bind(this);
    this.startBecauseMouseMoved = this.startBecauseMouseMoved.bind(this);

    const defaults = {
      mode: 'column',
      excludeFooter: false,
      dragHandle: '',
      onlyBody: '',
    };
    const options = this.options = Object.assign({}, defaults, userOptions);

    this.fakeTables = [];
    this.dragger = emitter({ dragging: false });

    const defaultHandlers = options.mode === 'column' ? table.rows[0].children : Array.from(table.rows).map(row => row.children[0]);

    this.handlers = Array.from(options.dragHandle ? table.querySelectorAll(options.dragHandle)
      : defaultHandlers);
    if (!this.handlers) {
      throw new Error('TableSortable: Please ensure dragHandler in table');
    }

    this.el = table;
    this.tappedCoord = { x: 0, y: 0 };
    this.activeCoord = { x: 0, y: 0 }; //
    this.el.classList.add(classes.originTable);
    this.bindEvents();
  }

  getCols () {
    return this.el.querySelectorAll('col');
  }

  bindEvents () {
    for (const h of this.handlers) {
      on(h, 'mousedown', this.onTap);
      on(h, 'touchstart', this.onTap);
      on(h, 'pointerdown', this.onTap);
    }
  }

  onTap (event) {
    // TODO 兼容性
    let t = event.target;
    while (t.nodeName !== 'TD' && t.nodeName !== 'TH') {
      t = t.parentElement;
    }

    const ignore = !isLeftButton(event) || event.metaKey || event.ctrlKey;
    if (ignore) {
      return;
    }

    this.activeCoord = { x: t.cellIndex, y: t.parentElement.rowIndex };
    this.tappedCoord = { x: event.clientX, y: event.clientY };
    on(documentElement, 'mousemove', this.startBecauseMouseMoved);
    on(documentElement, 'mouseup', () => {
      remove(documentElement, 'mousemove', this.startBecauseMouseMoved);
    });
  }

  startBecauseMouseMoved (event) {
    const x = event.clientX;
    const y = event.clientY;
    const oldX = this.tappedCoord.x;
    const oldY = this.tappedCoord.y;
    if (x === oldX && y === oldY) {
      return;
    }

    remove(documentElement, 'mousemove', this.startBecauseMouseMoved);

    this.fakeTables = this.buildTables();
    this.sizeFake();
    this.sortTable = new DraggableList({
      tables: this.fakeTables,
      originTable: this,
    });
    on(documentElement, 'mouseup', this.sortTable.destroy);
  }

  // get the longest row length
  getLongestRow () {
    let result = this.el.rows[0];
    Array.from(this.el.rows).forEach((row) => {
      const rowL = row.children.length;
      const resultL = result.children.length;
      result = rowL > resultL ? row : result;
    });
    return result;
  }

  static version = '1.0';
}
