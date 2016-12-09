/**
 * Created by lijun on 2016/11/16.
 */
// import Sortable from 'sortablejs';
// import Sortable from './Sortable';
import dragula from 'dragula';
import { insertBeforeSibling, classes } from './util';
// import { insertBeforeSibling, timeout } from './util';
// http://stackoverflow.com/questions/40755515/drag-element-dynamicly-doesnt-work-in-firefox
// 这个问题解决不了，所以只能采取table加载完就开始创建sortable的方法
export default class SortTableList {
  constructor ({ tables = [], originTable }) {
    for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    const options = originTable.options;
    const mode = options.mode;

    this.el = tables.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current.el);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    this.el.classList.add(classes.draggableTable);
    this.el.classList.add(`sindu_${mode}`);
    this.el.style.position = 'fixed';
    insertBeforeSibling({ target: this.el, origin: originTable.el });

    // 装饰者模式
    // TODO 思考一下这里允许用户输入的是什么参数
    // const onDrag = before(options.onStart,
    //   (el, container) => {
    //     container.classList.add('sindu_dragging');
    //   }
    // );
    //
    // const onDrop = before(options.onEnd,
    //   (el, container) => {
    //     container.classList.remove('sindu_dragging');
    //     this.originTable.onSortTableDrop({ from, to });
    //   }
    // );

    this.originTable = originTable;
    this._renderPosition();

    dragula([this.el])
      .on('drag', (el, container) => {
        container.classList.add(classes.dragging);
      })
      .on('drop', (el, target) => {
        target.classList.remove(classes.dragging);
        this.originTable._onDrop({ from: originTable.activeIndex, to: Array.from(target.children).indexOf(el) });
      })

    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
    this.el.children[originTable.activeIndex].dispatchEvent(event);
    //
    // window.addEventListener('resize', () => {
    //   (async () => {
    //     await timeout(66);
    //     this._renderTables();
    //   })();
    // }, false);
    //
    // window.addEventListener('scroll', () => {
    //   (async () => {
    //     await timeout(66);
    //     this._renderPosition();
    //   })();
    // }, false);
  }

  _renderPosition () {
    // 计算ul相对于视窗的位置
    // 考虑到和父元素class联动等，必须放在目标元素sibling的位置
    // 考虑到table 相对移动或者transform时ul会错位，必须用绝对定位
    // 所以选择position 为fixed,相对视窗定位，所以不需要加window.pageYoffset了
    const originRect = this.originTable.el.getBoundingClientRect();
    // http://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
    this.el.style.top = `${originRect.top}px`;
    this.el.style.left = `${originRect.left}px`;
  }

  // TODO li设定宽度，ul overflow-hidden
}
