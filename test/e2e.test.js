import {Selector, ClientFunction} from 'testcafe';
import classes from '../src/classes'

// localhost:8080 is for webpack-dev-server, which will be ignored when run from package.json script
fixture`table-dragger`
  .page`http://localhost:8080`;

const watchState = ClientFunction(() => {
  const mouseMoveHandler = () => {
    const classes = JSON.parse(classesStr)
    const fakeTable = document.querySelector(`.${classes.fakeTable}`)
    const table = document.querySelector(`#${tableName}`)
    if (fakeTable) {
      window.dragginInfo = {
        tableWidth: window.getComputedStyle(table).width,
        tableHide: window.getComputedStyle(table).visibility === 'hidden',
        tableBox: JSON.parse(JSON.stringify(table.getBoundingClientRect()))
      }

      window.removeEventListener('mousemove', mouseMoveHandler);
    }
  };

  await t.expect(draggingInfo).ok()
    .expect(draggingInfo.hasFakeTable).eql(true)
    .expect(draggingInfo.tableHide).eql(true)

  window.addEventListener('mousemove', mouseMoveHandler);
});
