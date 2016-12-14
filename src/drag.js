/**
 * Created by lijun on 2016/12/7.
 */

// TODO 版本管理 version
import Dragger from './draggable-list';
import { on, remove, classes } from './util';

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new Error(`TableSortable: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }

    this.onTap = this.onTap.bind(this);
    this.destroy = this.destroy.bind(this);
    this.startBecauseMouseMoved = this.startBecauseMouseMoved.bind(this);

    const defaults = {
      mode: 'column',
      // excludeFooter: false,
      dragHandle: '',
      onlyBody: false,
      animation: 300,
    };
    const options = this.options = Object.assign({}, defaults, userOptions);

    this.fakeTables = [];
    this.dragger = emitter({
      dragging: false,
      destroy: this.destroy,
    });

    const defaultHandlers = options.mode === 'column' ? table.rows[0].children : Array.from(table.rows).map(row => row.children[0]);

    this.handlers = Array.from(options.dragHandle ? table.querySelectorAll(options.dragHandle)
      : defaultHandlers);
    if (!this.handlers) {
      throw new Error('TableSortable: Please ensure dragHandler in table');
    }

    this.tappedCoord = { x: 0, y: 0 };
    this.activeCoord = { x: 0, y: 0 };
    table.classList.add(classes.originTable);
    this.el = table;
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

    on(document, 'mousemove', this.startBecauseMouseMoved);
    on(document, 'mouseup', () => {
      remove(document, 'mousemove', this.startBecauseMouseMoved);
    });
  }

  destroy () {
    for (const h of this.handlers) {
      remove(h, 'mousedown', this.removeTap);
      remove(h, 'touchstart', this.removeTap);
      remove(h, 'pointerdown', this.removeTap);
    }
  }

  startBecauseMouseMoved (event) {
    if (event.clientX === this.tappedCoord.x && event.clientY === this.tappedCoord.y) {
      return;
    }

    remove(document, 'mousemove', this.startBecauseMouseMoved);

    this.fakeTables = this.buildTables();
    this.sizeFake();
    this.sortTable = new Dragger({
      tables: this.fakeTables,
      originTable: this,
    });
    on(document, 'mouseup', this.sortTable.destroy);
  }

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

function emitter (thing = {}) {
  /* eslint-disable no-param-reassign */
  const evt = {};
  thing.on = (type, fn) => {
    evt[type] = evt[type] || [];
    evt[type].push(fn);
    return thing;
  };
  thing.emit = (type, ...args) => {
    if (!evt[type]) {
      return;
    }
    for (const fn of evt[type]) {
      fn(...args);
    }
  };
  return thing;
}
