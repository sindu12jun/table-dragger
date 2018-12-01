/**
 * Created by lijun on 2016/12/7.
 */
import Dragger from './draggable-list';
import classes from './classes';
import { touchy, sort } from './util';

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new TypeError(`table-dragger: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }
    if (!table.rows.length) {
      return;
    }
    const defaults = {
      mode: 'column',
      dragHandler: '',
      onlyBody: false,
      animation: 300,
    };
    const options = this.options = Object.assign({}, defaults, userOptions);
    const { mode } = options;
    if (mode === 'free' && !options.dragHandler) {
      throw new Error('table-dragger: please specify dragHandler in free mode');
    }

    ['onTap', 'destroy', 'startBecauseMouseMoved', 'sortColumn', 'sortRow'].forEach((m) => {
      this[m] = this[m].bind(this);
    });

    const dragger = this.dragger = emitter({
      dragging: false,
      destroy: this.destroy,
    });
    dragger.on('drop', (from, to, originEl, realMode) => {
      (realMode === 'column' ? this.sortColumn : this.sortRow)(from, to);
    });

    let handlers;
    if (options.dragHandler) {
      handlers = table.querySelectorAll(options.dragHandler);
      if (handlers && !handlers.length) {
        throw new Error('table-dragger: no element match dragHandler selector');
      }
    } else {
      handlers = mode === 'column' ? (table.rows[0] ? table.rows[0].children : []) : Array.from(table.rows).map(row => row.children[0]);
    }
    this.handlers = Array.from(handlers);
    this.handlers.forEach((h) => {
      h.classList.add(classes.handle);
    });

    table.classList.add(classes.originTable);

    this.tappedCoord = { x: 0, y: 0 }; // the coord of mouseEvent user clicked
    this.cellIndex = { x: 0, y: 0 }; // the cell's index of row and column
    this.el = table;
    this.sortTable = null;
    this.realMode = mode
    this.bindEvents();
  }

  bindEvents () {
    for (const e of this.handlers) {
      touchy(e, 'add', 'mousedown', this.onTap);
    }
  }

  onTap (event) {
    let { target } = event;

    while (target.nodeName !== 'TD' && target.nodeName !== 'TH') {
      target = target.parentElement;
    }

    const ignore = !isLeftButton(event) || event.metaKey || event.ctrlKey;
    if (ignore) {
      return;
    }

    this.cellIndex = { x: target.cellIndex, y: target.parentElement.rowIndex };
    this.tappedCoord = { x: event.clientX, y: event.clientY };

    this.eventualStart(false);
    touchy(document, 'add', 'mouseup', () => {
      this.eventualStart(true);
    });
  }

  startBecauseMouseMoved (event) {
    const { tappedCoord, options: { mode } } = this;
    const gapX = Math.abs(event.clientX - tappedCoord.x);
    const gapY = Math.abs(event.clientY - tappedCoord.y);
    // console.log('client');
    // console.log(event.clientX);
    // console.log(tappedCoord.x);
    const isFree = mode === 'free';
    let realMode = mode;

    if (!gapX && !gapY) {
      return;
    }
    this.dragger.dragging = true;

    if (isFree) {
      realMode = gapX < gapY ? 'row' : 'column';
    }
    this.realMode = realMode

    const sortTable = this.sortTable = new Dragger({
      mode: realMode,
      originTable: this,
    });
    this.eventualStart(true);
    // this listener will be removed after user start dragging
    touchy(document, 'add', 'mouseup', sortTable.destroy);
  }

  eventualStart (remove) {
    const op = remove ? 'remove' : 'add';
    touchy(document, op, 'mousemove', this.startBecauseMouseMoved);
  }

  destroy () {
    for (const h of this.handlers) {
      touchy(h, 'remove', 'mousedown', this.onTap);
    }
    this.el.classList.remove(classes.originTable);
  }

  sortColumn (from, to) {
    if (from === to) {
      return;
    }
    const table = this.el;
    Array.from(table.rows).forEach((row) => {
      sort({ list: row.children, from, to });
    });

    const cols = table.querySelectorAll('col');
    if (cols.length) {
      sort({ list: cols, from, to });
    }
  }

  sortRow (from, to) {
    if (from === to) {
      return;
    }
    const table = this.el;
    const list = Array.from(table.rows);
    sort({ list, parent: list[to].parentElement, from, to });
  }

  static create (el, options) {
    const d = new Drag(el, options);
    return d && d.dragger;
  }

  static version = '1.0';
}

function checkIsTable (ele) {
  return ele
    &&
    typeof ele === 'object'
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
