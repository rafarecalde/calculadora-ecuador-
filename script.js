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

// default rate 9.45%
rateEl.value = 9.45;

btn.addEventListener('click', () => {
  const gross = Number(grossEl.value || 0);
  const rate  = Number(rateEl.value || 0) / 100;
  const extra = Number(extraEl.value || 0);

  if (!gross || gross <= 0){
    alert('Por favor ingresa un sueldo bruto válido.');
    return;
  }

  const iessEmployee = gross * rate;
  const net = gross - iessEmployee - extra;

  iessEmployeeEl.textContent = money(iessEmployee);
  otherDiscountsEl.textContent = money(extra);
  netSalaryEl.textContent = money(net);

  results.classList.remove('hidden');
});
