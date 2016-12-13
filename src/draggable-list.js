/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
import { insertBeforeSibling, classes, getScrollBarWidth } from './util';

// TODO 注意Drop以后排列tables
// TODO 学习dragula，注意startBecauseDrag，左右键，ignoreTextSelection等
// TODO mode 改为 horizentol 等关键词
// TODO alt等，再看一遍drugula
// TODO render等好好组织一下
// TODO Node全换成Element
// 改drgula时注意，reference指明了被交换的坐标
export default class SortTableList {
  constructor ({ tables, originTable }) {
    this.destroy = this.destroy.bind(this);

    const options = originTable.options;
    const dragger = originTable.dragger;
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

    this.originTable = originTable;
    this._renderTables();
    this.el.parentElement.classList.add(classes.dragging);

    const bodyPaddingRight = parseInt(document.body.style.paddingRight, 0) || 0;
    const bodyOverflow = document.body.style.overflow;
    this.drake = dragula([this.el], {
      animation: 300,
      mirrorContainer: this.el,
      direction: options.mode === 'column' ? 'horizontal' : 'vertical',
    })
      .on('drag', () => {
        document.body.style.overflow = 'hidden';
        // const originRight = document.body.style.paddingRight || 0;
        const barWidth = getScrollBarWidth();
        if (barWidth) {
          document.body.style.paddingRight = `${barWidth + bodyPaddingRight}px`;
        }
        document.documentElement.removeEventListener('mouseup', this.destroy);
        dragger.emit('onDrag');
      })
      .on('dragend', (el) => {
        document.body.style.overflow = bodyOverflow;
        document.body.style.paddingRight = `${bodyPaddingRight}px`;
        const from = index;
        const to = Array.from(this.el.children).indexOf(el);
        originTable.onDrop({ from, to });
        this.destroy();
        dragger.emit('onDrop', from, to, originTable.el);
      })
      .on('shadow', (el) => {
        const from = index;
        const to = Array.from(this.el.children).indexOf(el);
        dragger.emit('onMove', from, to, originTable.el);
      })
      .on('out', () => {
        dragger.emit('onOut', originTable.el);
      })
    ;

    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
    this.el.children[index].dispatchEvent(event);
  }

  destroy () {
    document.documentElement.removeEventListener('mouseup', this.destroy);
    this.el.parentElement.classList.remove(classes.dragging);
    this.el.parentElement.removeChild(this.el);
    setTimeout(() => {
      this.drake.destroy();
    }, 0);
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
  _renderTables () {
    const rect = this.originTable.el.getBoundingClientRect();
    this.el.style.width = `${rect.width}px`;
    this.el.style.height = `${rect.height}px`;
    this._renderPosition();
  }
}
