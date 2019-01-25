import tableDragger from '../src/index';
import classes from '../src/classes'

/* eslint-disable no-console*/
tableDragger(document.querySelector('#column-table'));
tableDragger(document.querySelector('#row-table'), {mode: 'row'});
tableDragger(document.querySelector('#only-body-table'), {mode: 'row', onlyBody: true});
tableDragger(document.querySelector('#handle-table'), {dragHandler: '.handle'});
tableDragger(document.querySelector('#free-table'), {mode: 'free', dragHandler: '.handle'});
tableDragger(document.querySelector('#event-table'), {mode: 'free', dragHandler: '.handle'})
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

[...document.querySelectorAll(`.${classes.handle}`)].forEach(cell => {
  const i = document.createElement('i')
  i.classList.add('far')
  i.classList.add('fa-hand-paper')
  i.style.marginLeft = '4px'
  cell.appendChild(i)
})
