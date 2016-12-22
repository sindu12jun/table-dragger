/**
 * Created by lijun on 2016/12/14.
 */
import tableDragger from '../src/index';

/* eslint-disable no-console*/
tableDragger(document.querySelector('#default-table'));
tableDragger(document.querySelector('#row-table'), { mode: 'row' });
tableDragger(document.querySelector('#only-body-table'), { mode: 'row', onlyBody: true });
tableDragger(document.querySelector('#handle-table'), { dragHandler: '.handle' });
tableDragger(document.querySelector('#free-table'), { mode: 'free', dragHandler: '.handle', onlyBody: true });
tableDragger(document.querySelector('#event-table'), { mode: 'free', dragHandler: '.handle', onlyBody: true })
  .on('drag', () => {
    console.log('drag');
  })
  .on('drop', (from, to, el, mode) => {
    console.log(`drop ${el.nodeName} from ${from} ${mode} to ${to} ${mode}`);
  })
  .on('shadowMove', (from, to, el, mode) => {
    console.log(`move ${el.nodeName} from ${from} ${mode} to ${to} ${mode}`);
  })
  .on('out', (el, mode) => {
    console.log(`move out or drop ${el.nodeName} in mode ${mode}`);
  });
