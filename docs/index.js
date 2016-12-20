/**
 * Created by lijun on 2016/12/14.
 */
import tableDragger from '../src/index';

tableDragger(document.querySelector('#default-table'));
tableDragger(document.querySelector('#row-table'), { mode: 'row', onlyBody: true });
tableDragger(document.querySelector('#handle-table'), { dragHandler: '.handle' });
tableDragger(document.querySelector('#free-table'), { mode: 'free', dragHandler: '.handle', onlyBody: true });
