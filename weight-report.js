// weight-report.js - Sidigi General Trading - Total Weight Report

window.genReport = async (all) => {
  let outEl = document.getElementById('reportOut');
  outEl.innerHTML = '<div style="padding:20px;text-align:center;">Loading report...</div>';
  let from = document.getElementById('r_from')?.value || '';
  let to = document.getElementById('r_to')?.value || '';
  if(all){ from=''; to=''; }

  function inR(dt){ if(!from && !to) return true; return dt >= from && dt <= to; }

  try {
    let cargos = [], tickets = [], offices = [], flights = [];
    let s1 = await getDocs(collection(db, 'cargos'));
    let s2 = await getDocs(collection(db, 'tickets'));
    s1.forEach(d=>cargos.push({id:d.id, ...d.data()}));
    s2.forEach(d=>tickets.push({id:d.id, ...d.data()}));

    cargos = cargos.filter(x=>inR(x.date));
    tickets = tickets.filter(x=>inR(x.date));

    let tC = cargos.reduce((s,x)=>s+(parseFloat(x.total)||0),0);
    let tW = cargos.reduce((s,x)=>s+(parseFloat(x.weight)||parseFloat(x.kg)||parseFloat(x.qty)||0),0);
    let tT = tickets.reduce((s,x)=>s+(parseFloat(x.total)||0),0);

    document.getElementById('sumIncome').innerText = '$' + tC.toFixed(2);

    let html = '';
    html += `<div class="card"><div style="background:#0f172a;color:#fff;padding:15px;border-radius:10px;text-align:center;"><div>TOTAL CARGO INCOME</div><div style="font-size:22px;color:#38bdf8;font-weight:bold;">$${tC.toFixed(2)}</div></div></div>`;
    html += `<div class="card"><div style="background:#1e293b;color:#fff;padding:15px;border-radius:10px;text-align:center;border:2px solid #38bdf8;"><div>TOTAL WEIGHT</div><div style="font-size:24px;color:#38bdf8;font-weight:bold;">${tW.toFixed(2)} KG</div></div></div>`;
    html += `<div class="card"><div style="background:#0f172a;color:#fff;padding:15px;border-radius:10px;text-align:center;"><div>TICKETS INCOME</div><div style="font-size:22px;color:#22c55e;font-weight:bold;">$${tT.toFixed(2)}</div></div></div>`;

    outEl.innerHTML = html;

    // Save for print
    window._reportData = { cargos, tickets, tC, tW, tT, from, to };

  } catch(err){
    outEl.innerHTML = `<div class="card" style="color:red;">Error: ${err.message}</div>`;
  }
};

window.printReport = () => {
  let data = window._reportData;
  if(!data){ alert('Generate report first'); return; }

  let cargoRows = data.cargos.map(c=>`
    <tr>
      <td>${c.date||''}</td>
      <td>${c.serial||''}</td>
      <td>${c.shipper||''}</td>
      <td>${c.route||''}</td>
      <td>${c.weight||c.kg||c.qty||0} KG</td>
      <td>$${c.total||0}</td>
      <td>$${c.paid||0}</td>
      <td>$${c.balance||0}</td>
      <td>${c.status||''}</td>
    </tr>
  `).join('');

  cargoRows += `
    <tr style="background:#000;color:#fff;font-weight:bold;">
      <td colspan="4" style="text-align:right">TOTAL WEIGHT</td>
      <td>${data.tW.toFixed(2)} KG</td>
      <td colspan="4" style="text-align:right">TOTAL: $${data.tC.toFixed(2)}</td>
    </tr>
  `;

  let h = `
  <div style="padding:20px;font-family:sans-serif;">
    <h2 style="text-align:center;">Sidigi General Trading - Cargo Report</h2>
    <p style="text-align:center;">From: ${data.from||'All'} To: ${data.to||'All'}</p>
    <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <thead style="background:#000;color:#fff;">
        <tr><th>Date</th><th>Serial</th><th>Shipper</th><th>Route</th><th>Weight (KG)</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr>
      </thead>
      <tbody>${cargoRows}</tbody>
    </table>
    <div style="margin-top:20px;display:flex;justify-content:space-between;">
      <div style="font-size:18px;font-weight:bold;">Total Weight: ${data.tW.toFixed(2)} KG</div>
      <div style="font-size:18px;font-weight:bold;">Total Amount: $${data.tC.toFixed(2)}</div>
    </div>
  </div>`;

  let w = window.open('', '_blank');
  w.document.write(h);
  w.document.close();
  w.print();
};
