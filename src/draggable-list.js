/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
import classes from './classes';
import {
  insertBeforeSibling,
  getScrollBarWidth,
  css,
  remove,
  getLongestRow,
  empty,
  touchy,
  getTouchyEvent,
} from './util';

// const isTest = true;
const isTest = false;
const bodyPaddingRight = parseInt(document.body.style.paddingRight, 0) || 0;
const bodyOverflow = document.body.style.overflow;
export default class Dragger {
  constructor ({ originTable, mode }) {
    const { dragger, cellIndex, el: originEl, options } = originTable;
    const fakeTables = this.fakeTables = buildTables(originEl, mode);

    this.options = options;
    this.mode = mode;
    this.originTable = originTable;
    this.dragger = dragger;
    this.index = mode === 'column' ? cellIndex.x : cellIndex.y;
    ['destroy', 'onDrag', 'onDragend', 'onShadow', 'onOut'].forEach((m) => {
      this[m] = this[m].bind(this);
    });

    // pointfree?
    this.el = fakeTables.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    this.drake = dragula([this.el], {
      animation: 300,
      staticClass: classes.static,
      direction: mode === 'column' ? 'horizontal' : 'vertical',
    })
      .on('drag', this.onDrag)
      .on('dragend', this.onDragend)
      .on('shadow', this.onShadow)
      .on('out', this.onOut);

    this.renderEl();
    this.dispatchMousedown();
  }

  onDrag () {
    css(document.body, { overflow: 'hidden' });
    const barWidth = getScrollBarWidth();
    if (barWidth) {
      css(document.body, { 'padding-right': `${barWidth + bodyPaddingRight}px` });
    }
    touchy(document, 'remove', 'mouseup', this.destroy);
    this.dragger.emit('drag');
  }

  onDragend (droppedItem) {
    const { originTable: { el: originEl }, dragger, index, mode, el } = this;
    css(document.body, { overflow: bodyOverflow, 'padding-right': `${bodyPaddingRight}px` });
    const from = index;
    const to = Array.from(el.children).indexOf(droppedItem);
    this.destroy();
    dragger.emit('drop', from, to, originEl, mode);
  }

  onShadow (draggingItem) {
    const { originTable: { el: originEl }, dragger, index, el } = this;
    const from = index;
    const to = Array.from(el.children).indexOf(draggingItem);
    dragger.emit('shadowMove', from, to, originEl);
  }

  onOut () {
    this.dragger.emit('out', this.originTable.el);
  }

  destroy () {
    remove(document, 'mouseup', this.destroy);
    this.el.parentElement.classList.remove(classes.dragging);
    if (!isTest) {
      this.el.parentElement.removeChild(this.el);
    }
    setTimeout(() => {
      this.drake.destroy();
    }, 0);
  }

  dispatchMousedown () {
    const { el, index } = this;
    el.children[index].dispatchEvent(getTouchyEvent());
  }

  // TODO li设定宽度，ul overflow-hidden
  renderEl () {
    const { mode, el, originTable: { el: originEl } } = this;
    const rect = originEl.getBoundingClientRect();

    this.sizeFakes();
    insertBeforeSibling({ target: el, origin: originEl });

    // render every wrapper of table(element li)
    let s = originEl.getAttribute('cellspacing');
    s = s === null ? 2 : s;
    const attr = mode === 'column' ? 'margin-right' : 'margin-bottom';
    const l = el.children.length;
    Array.from(el.children).forEach((li, dex) => {
      /* eslint-disable no-param-reassign*/
      const table = li && li.querySelector('table');
      if (this.options.onlyBody && mode === 'row' && !Array.from(table.children).some(o => o.nodeName === 'TBODY')) {
        li.classList.add('sindu_static');
      }

      if (s && dex < (l - 1)) {
        li.style[attr] = `-${s}px`;
      }
    });

    el.parentElement.classList.add(classes.dragging);
    el.classList.add(classes.draggableTable);
    el.classList.add(`sindu_${mode}`);

    css(el, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
    });
  }

  sizeFakes () {
    return this.mode === 'column' ? this.sizeColumnFake() : this.sizeRowFake();
  }

  sizeColumnFake () {
    const { fakeTables, originTable: { el: originEl } } = this;
    // calculate width of every column
    Array.from(getLongestRow(originEl).children).forEach(
      (cell, index) => {
        const w = cell.getBoundingClientRect().width;
        const t = fakeTables[index];
        css(t, { width: `${w}px` });
        css(t.rows[0].children[0], { width: `${w}px` });
      }
    );
    // calculate height of every cell
    const rowHeights = Array.from(originEl.rows)
      .map(row => row.children[0].getBoundingClientRect().height);
    fakeTables.forEach((t) => {
      /* eslint-disable no-param-reassign*/
      Array.from(t.rows).forEach((row, index) => {
        css(row, { height: `${rowHeights[index]}px` });
      });
    });
  }

  sizeRowFake () {
    const { fakeTables, originTable: { el: originEl } } = this;

    const cells = getLongestRow(originEl).children;
    const w = originEl.getBoundingClientRect().width;
    // 行排列时计算每一行各个cell宽度
    /* eslint-disable no-param-reassign*/
    fakeTables.forEach((t) => {
      css(t, { width: `${w}px` });
      Array.from(t.rows[0].children).forEach((cell, i) => {
        css(cell, { width: `${cells[i].getBoundingClientRect().width}px` });
      });
    });
  }
}

// input:clone(originTable)
function origin2DragItem (liTable) {
  css(liTable, { 'table-layout': 'fixed', width: 'initial', height: 'initial' });
  ['width', 'height', 'id'].forEach((p) => {
    liTable.removeAttribute(p);
  });
  liTable.classList.remove(classes.originTable);
  Array.from(liTable.querySelectorAll('col')).forEach((col) => {
    col.removeAttribute('width');
    css(col, { width: 'initial' });
  });
}

function getColumnAsTableByIndex (table, index) {
  const cTable = table.cloneNode(true);
  origin2DragItem(cTable);

  const cols = cTable.querySelectorAll('col');
  if (cols.length) {
    Array.from(cols).forEach((col, dex) => {
      if (dex !== index) {
        col.parentElement.removeChild(col);
      }
    });
  }

  Array.from(cTable.rows).forEach((row) => {
    const target = row.children[index];
    empty(row);
    if (target) {
      row.appendChild(target);
    }
  });
  return cTable;
}

function buildRowTables (table) {
  return Array.from(table.rows).map((row) => {
    const cTable = table.cloneNode(true);

    origin2DragItem(cTable);

    Array.from(cTable.children).forEach((c) => {
      const { nodeName } = c;
      if (nodeName !== 'COL' && nodeName !== 'COLGROUP') {
        cTable.removeChild(c);
      }
    });

    const organ = row.parentNode.cloneNode();
    organ.innerHTML = '';
    organ.appendChild(row.cloneNode(true));
    cTable.appendChild(organ);
    return cTable;
  });
}

function buildColumnTables (table) {
  return Array.from(getLongestRow(table).children).map((cell, index) =>
    getColumnAsTableByIndex(table, index));
}

function buildTables (table, mode) {
  return mode === 'column' ? buildColumnTables(table) : buildRowTables(table);
}
