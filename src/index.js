/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import './main.css';
import DragRow from './drag-row';
import DragColumn from './drag-column';

export default (el, options) => {
  return (options.mode === 'row' ? DragRow : DragColumn).create(el, options);
};
