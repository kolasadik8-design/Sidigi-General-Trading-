// Sidigi General Trading - Total Weight Fix
// Add this file at the end of reports.html before </body>

document.addEventListener('DOMContentLoaded', () => {
  // استنى لحد ما الجدول يتملي
  setTimeout(calculateTotalWeight, 2000);
});

function calculateTotalWeight() {
  let total = 0;
  // فتش كل صفوف الجدول - عمود الوزن غالباً هو العمود رقم 3 او 4
  // غير الرقم حسب جدولك
  const rows = document.querySelectorAll('table tbody tr');

  rows.forEach(row => {
    // لو عندك كلاس اسمو weight حاول يلقاه
    const weightCell = row.querySelector('.weight') || row.cells[3];
    if(weightCell){
      let val = parseFloat(weightCell.innerText.replace(/[^0-9.]/g, ''));
      if(!isNaN(val)) total += val;
    }
  });

  // اعرض النتيجة
  let display = document.getElementById('totalWeightKG');
  if(!display){
    // لو ما لقى مكان العرض، اعملو تلقائياً
    const card = document.createElement('div');
    card.innerHTML = `
      <div style="background:#0f172a;color:#fff;padding:16px 20px;border-radius:12px;margin:16px 0;display:flex;justify-content:space-between;font-family:sans-serif">
        <span>Total Gross Weight:</span>
        <strong id="totalWeightKG" style="font-size:20px;color:#38bdf8">${total.toFixed(2)} KG</strong>
      </div>
    `;
    const table = document.querySelector('table');
    if(table) table.parentNode.insertBefore(card, table);
  } else {
    display.innerText = total.toFixed(2) + " KG";
  }
}
