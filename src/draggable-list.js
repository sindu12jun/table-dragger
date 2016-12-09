/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
import { insertBeforeSibling, classes } from './util';

// TODO 注意Drop以后排列tables
export default class SortTableList {
  constructor ({ tables = [], originTable }) {
    const options = originTable.options;
    const mode = options.mode;
    const index = mode === 'column' ? originTable.activeCoord.x : originTable.activeCoord.y;

    this.el = tables.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    this.el.classList.add(classes.draggableTable);
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
    //   }
    // );
    // Sortable.create(this.el, options);

    this.originTable = originTable;
    this._renderTables();
    const drake = dragula([this.el])
        .on('drag', (el, source) => {
          source.parentElement.classList.add(classes.dragging);
        })
        .on('drop', (el, container) => {
          const from = index;
          const to = Array.from(container.children).indexOf(el);
          container.parentElement.classList.remove(classes.dragging);
          container.parentNode.removeChild(container);
          this.originTable.onDrop({ from, to });
          setTimeout(() => {
            drake.destroy();
          }, 0);
        })
      ;

    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
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

  // _onDrop ({ from, to }) {
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
