/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
import { insertBeforeSibling, classes } from './util';

// TODO 注意Drop以后排列tables
// TODO 学习dragula，注意startBecauseDrag，左右键，ignoreTextSelection等
// TODO mode 改为 horizentol 等关键词
// TODO alt等，再看一遍drugula
// TODO render等好好组织一下
// TODO Node全换成Element
// 改drgula时注意，reference指明了被交换的坐标
export default class SortTableList {
  constructor ({ tables = [], originTable }) {
    this.destroy = this.destroy.bind(this);

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
    this.el.parentElement.classList.add(classes.dragging);

    /* eslint-disable */
    this.drake = dragula([this.el], {
      animation: 300,
      direction: options.mode === 'column' ? 'horizontal' : 'vertical'
    })
      .on('drag', () => {
        document.removeEventListener('mouseup', this.destroy);
      })
      .on('over', () => {
        // console.log('over');
        // source.parentElement.classList.add(classes.dragging);
      })
      .on('cloned', () => {
        // console.log('over');
        // source.parentElement.classList.add(classes.dragging);
      })
      .on('shadow', (el, container, source) => {
        // source.parentElement.classList.add(classes.dragging);
      })
      .on('dragend', (el) => {
        const from = index;
        const to = Array.from(this.el.children).indexOf(el);
        this.originTable.onDrop({ from, to });
        this.destroy();
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

  // _onDrop ({ from, to }) {
  // }

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
    this._renderPosition();
  }
}
