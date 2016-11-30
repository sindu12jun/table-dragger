import OriginTable from '../../../src/OriginTable';

describe('origintable', () => {
  beforeEach(() => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <table id="table2" cellpadding="0" cellspacing="0">
      <colgroup>
        <col width="10" style="background: red">
        <col width="20">
        <col width="30">
        <col width="40">
        <col width="50">
      </colgroup>
      <thead class="tbl-header">
      <tr>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>AAC</td>
        <td>AUSTRALIAN COMPANY</td>
        <td>$1.38</td>
        <td>+2.01</td>
        <td>-0.36%</td>
      </tr>
      <tr>
        <td>AAD</td>
        <td>AUSENCO</td>
        <td>$2.38</td>
        <td>-0.01</td>
        <td>-1.36%</td>
      </tr>
      <tr>
        <td>AAX</td>
        <td>ADELAIDE</td>
        <td>$3.22</td>
        <td>+0.01</td>
        <td>+1.36%</td>
      </tr>
      </tbody>
    </table>
`;
    const el = wrap.querySelector('table');
    const table = new OriginTable(el);
    console.log(table);
  });
  it('should init', () => {
    expect(true).toBe(true);
  });
});
