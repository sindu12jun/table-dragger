import 'babel-polyfill';
import OriginTable from './OriginTable';

// const table2 = window.document.querySelector('#table2');

// TODO 给Origintable改名
/* eslint-disable no-new */
// new OriginTable(table2, { mode: 'row' });
// new OriginTable(table2, { mode: 'column' });
(function sortableModule (factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    define(factory);
  }
  else if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = factory();
  }
  else if (typeof Package !== "undefined") {
    //noinspection JSUnresolvedVariable
    OriginTable = factory();  // export for Meteor.js
  }
  else {
    /* jshint sub:true */
    window["OriginTable"] = factory();
  }
})(function factory () {
  return OriginTable;
})
