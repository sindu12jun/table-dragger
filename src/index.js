/**
 * Created by lijun on 2016/12/4.
 */
import 'babel-polyfill';
import './main.css';
import Drag from './drag';

module.exports = (el, options) => Drag.create(el, options);
