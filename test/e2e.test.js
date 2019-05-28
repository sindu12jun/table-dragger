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
    .expect(draggingInfo.tableHasOriginClass).eql(true)
    .expect(draggingInfo.hasDragginClass).eql(true)
    .expect(draggingInfo.fakeTableBox).eql(draggingInfo.tableBox)


  window.addEventListener('mousemove', mouseMoveHandler);
});
const watchState = ClientFunction(() => {
  const mouseMoveHandler = () => {
    const tableName = name
    const table = await Selector(`#${tableName}`)
    const start = table.find(`.${mode === 'column' ? 'c' : 'r'}${startNum}`)
    const end = table.find(`.${mode === 'column' ? 'c' : 'r'}${endNum}`)

    await watchState.with({
      dependencies: {
        classesStr: JSON.stringify(classes),
        tableName
      }
    })();
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
    .expect(draggingInfo.tableHasOriginClass).eql(true)
    .expect(draggingInfo.hasDragginClass).eql(true)
    .expect(draggingInfo.fakeTableBox).eql(draggingInfo.tableBox)


  window.addEventListener('mousemove', mouseMoveHandler);
});
