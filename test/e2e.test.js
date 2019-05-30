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
        hasFakeTable: !!fakeTable,
        tableHide: window.getComputedStyle(table).visibility === 'hidden',
        tableHasOriginClass: table.classList.contains(classes.originTable),
        hasDragginClass: fakeTable.parentElement.classList.contains(classes.dragging),
        fakeTableBox: JSON.parse(JSON.stringify(fakeTable.getBoundingClientRect())),
        tableBox: JSON.parse(JSON.stringify(table.getBoundingClientRect()))
      }

      window.removeEventListener('mousemove', mouseMoveHandler);
    }
  };

  window.addEventListener('mousemove', mouseMoveHandler);
});

function testTable({name, startNum, endNum, mode, desc}) {
  test(desc, async t => {
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
    await t.dragToElement(start, end, {
      destinationOffsetX: 50,
      destinationOffsetY: 50
    });
    const draggingInfo = await t.eval(() => window.dragginInfo)
    await t.expect(draggingInfo).ok()
      .expect(draggingInfo.hasFakeTable).eql(true)
      .expect(draggingInfo.tableHide).eql(true)
      .expect(draggingInfo.tableHasOriginClass).eql(true)
      .expect(draggingInfo.hasDragginClass).eql(true)
      .expect(draggingInfo.fakeTableBox).eql(draggingInfo.tableBox)

    if (mode === 'column') {
      if (startNum < endNum) {
        // 所以要获得props要await并执行，就像上面的table，await并执行了，find到的子元素就不用再来一遍了
        // 所以最后一定要带一个括号，不然就不是执行了
        // start.innerText这种打印是打不出来的，只会等到assert的时候再计算
        const next = await end.nextSibling(0)()
        // await t.expect(start.innerText).eql(next.innerText)
      } else {
        // -1才是最近的！1是最远的，这个api排序和文档说的不一样
        const previous = await end.prevSibling(-1)()
        await t.expect(start.innerText).eql(previous.innerText)
      }
    }
    if (mode === 'row') {
      const startRow = await start.parent(0)()
      if (startNum < endNum) {
        // 这样写是不行的，要下面那样
        // const next = await endRow.nextSibling(0)()
        const next = await end.parent(0).nextSibling(0)()
        await t.expect(startRow.innerText).eql(next.innerText)
      } else {
        const previous = await end.parent(0).prevSibling(0)()
        await t.expect(startRow.innerText).eql(previous.innerText)
      }
    }
  });
}
