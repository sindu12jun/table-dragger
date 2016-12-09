/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
import { insertBeforeSibling } from './util';
// import { insertBeforeSibling, timeout } from './util';
// http://stackoverflow.com/questions/40755515/drag-element-dynamicly-doesnt-work-in-firefox
// 这个问题解决不了，所以只能采取table加载完就开始创建sortable的方法
export default class SortTableList {
  constructor ({ tables = [], originTable }) {
    const options = originTable.options;
    const mode = options.mode;

    this.el = tables.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    this.el.classList.add('sindu_sortable_table');
    this.el.classList.add(`sindu_${mode}`);
    this.el.style.position = 'fixed';
    insertBeforeSibling({ target: this.el, origin: originTable.el });
    // 装饰者模式
    // options.onStart = before(options.onStart,
    //   () => {
    //     this.el.parentNode.classList.add('sindu_dragging');
    //   }
    // );
    // options.onEnd = before(options.onEnd,
    //   (evt) => {
    //     console.log(evt);
    //     this._onDrop({ from: evt.oldIndex, to: evt.newIndex });
    //   }
    // );
    // Sortable.create(this.el, options);

    this.originTable = originTable;
    this._renderTables();
    dragula([this.el]);

    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
    const index = mode === 'column' ? originTable.activeCoord.x : originTable.activeCoord.y;
    this.el.children[index].dispatchEvent(event);
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

  // getTables () {
  //   return Array.from(this.el.children).map(li => li.querySelector('table'));
  // }

  // _onDrop ({ from, to }) {
  //   this.el.parentNode.classList.remove('sindu_dragging');
  // swap table
  // 注意table交换这里并不是单纯交换,而是通过判断from 和 to的大小插入前面或后面，和origin中同理
  // this.originTable._onDrop({ from, to });
  // }

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
  _renderTables () {
    this._renderPosition();
  }
}
