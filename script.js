function money(n){
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(n);
}

const grossEl = document.getElementById('gross');
const rateEl  = document.getElementById('rate');
const extraEl = document.getElementById('extra');

const btn = document.getElementById('btnCalc');
const results = document.getElementById('results');

const iessEmployeeEl = document.getElementById('iessEmployee');
const otherDiscountsEl = document.getElementById('otherDiscounts');
const netSalaryEl = document.getElementById('netSalary');

const rateUsedEl = document.getElementById('rateUsed');
const netAnnualEl = document.getElementById('netAnnual');

const btnCopy = document.getElementById('btnCopy');

// ------------------------------
// Sueldo Neto page logic
// Runs ONLY if sueldo-neto fields exist
// ------------------------------
if (
  grossEl &&
  rateEl &&
  extraEl &&
  btn &&
  results &&
  iessEmployeeEl &&
  otherDiscountsEl &&
  netSalaryEl &&
  rateUsedEl &&
  netAnnualEl
) {
  // default rate 9.45%
  rateEl.value = 9.45;

  btn.addEventListener('click', () => {
    const gross = Number(grossEl.value || 0);
    const ratePct  = Number(rateEl.value || 0);
    const rate  = ratePct / 100;
    const extra = Number(extraEl.value || 0);

    if (!gross || gross <= 0){
      alert('Por favor ingresa un sueldo bruto válido.');
      return;
    }

    const iessEmployee = gross * rate;
    const net = gross - iessEmployee - extra;
    const netAnnual = net * 12;

    iessEmployeeEl.textContent = money(iessEmployee);
    otherDiscountsEl.textContent = money(extra);
    netSalaryEl.textContent = money(net);

    rateUsedEl.textContent = `${ratePct.toFixed(2)}%`;
    netAnnualEl.textContent = money(netAnnual);

    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (btnCopy){
    btnCopy.addEventListener('click', async () => {
      const gross = Number(grossEl.value || 0);
      const ratePct = Number(rateEl.value || 0);
      const extra = Number(extraEl.value || 0);

      const text =
`Calculadora Sueldo Neto (Ecuador)
Bruto: ${money(gross)}
Tasa IESS usada: ${ratePct.toFixed(2)}%
Otros descuentos: ${money(extra)}
IESS empleado: ${iessEmployeeEl?.textContent || ''}
Neto mensual: ${netSalaryEl?.textContent || ''}
Neto anual: ${netAnnualEl?.textContent || ''}`;

      try{
        await navigator.clipboard.writeText(text);
        btnCopy.textContent = 'Copiado ✅';
        setTimeout(() => btnCopy.textContent = 'Copiar resultado', 1400);
      }catch(e){
        alert('No se pudo copiar automáticamente. Selecciona y copia manualmente.');
      }
    });
  }
}

// ------------------------------
// IESS (Aportes) page logic
// Runs ONLY if iess inputs exist
// ------------------------------
(function initIessAportes(){
  const gross = document.getElementById('gross');
  const rateEmployee = document.getElementById('rateEmployee');
  const rateEmployer = document.getElementById('rateEmployer');

  // If this page doesn't have these fields, do nothing (keeps sueldo-neto working)
  if (!gross || !rateEmployee || !rateEmployer) return;

  const btnCalc = document.getElementById('btnCalc');
  const results = document.getElementById('results');

  const iessEmployeeEl = document.getElementById('iessEmployee');
  const iessEmployerEl = document.getElementById('iessEmployer');
  const iessTotalEl = document.getElementById('iessTotal');
  const rateUsedEmployeeEl = document.getElementById('rateUsedEmployee');
  const rateUsedEmployerEl = document.getElementById('rateUsedEmployer');

  const btnCopy = document.getElementById('btnCopy');

  // Defaults
  if (!rateEmployee.value) rateEmployee.value = 9.45;
  if (!rateEmployer.value) rateEmployer.value = 11.15;

  function toPct(n){
    const x = Number(n || 0);
    return isFinite(x) ? x : 0;
  }

  function calc(){
    const sueldo = Number(gross.value || 0);
    const empPct = toPct(rateEmployee.value);
    const erPct  = toPct(rateEmployer.value);

    if (!sueldo || sueldo <= 0){
      alert('Por favor ingresa un sueldo válido.');
      return null;
    }

    const emp = sueldo * (empPct / 100);
    const er  = sueldo * (erPct / 100);
    const total = emp + er;

    if (iessEmployeeEl) iessEmployeeEl.textContent = money(emp);
    if (iessEmployerEl) iessEmployerEl.textContent = money(er);
    if (iessTotalEl) iessTotalEl.textContent = money(total);
    if (rateUsedEmployeeEl) rateUsedEmployeeEl.textContent = `${empPct.toFixed(2)}%`;
    if (rateUsedEmployerEl) rateUsedEmployerEl.textContent = `${erPct.toFixed(2)}%`;

    if (results) {
      results.classList.remove('hidden');
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return { sueldo, empPct, erPct, emp, er, total };
  }

  if (btnCalc){
    btnCalc.addEventListener('click', () => {
      calc();
    });
  }

  if (btnCopy){
    btnCopy.addEventListener('click', async () => {
      const r = calc();
      if (!r) return;

      const text =
`Calculadora IESS (Ecuador)
Sueldo: ${money(r.sueldo)}
Tasa empleado: ${r.empPct.toFixed(2)}%
Tasa empleador: ${r.erPct.toFixed(2)}%
Aporte empleado: ${money(r.emp)}
Aporte empleador: ${money(r.er)}
Total aportes: ${money(r.total)}`;

      try{
        await navigator.clipboard.writeText(text);
        btnCopy.textContent = 'Copiado ✅';
        setTimeout(() => btnCopy.textContent = 'Copiar resultado', 1400);
      }catch(e){
        alert('No se pudo copiar automáticamente. Selecciona y copia manualmente.');
      }
    });
  }
})();
