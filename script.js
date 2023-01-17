const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const qty = document.getElementById('qty');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.toString().trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: amount.value.replace('.', ''),
      quantity: +qty.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
    qty.value = 1;
  }
}

//Generate random id
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//Add transactions to DOM list
function addTransactionDOM(transaction) {
  //Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  //Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  ).toLocaleString('es-CL')} x${transaction.quantity}</span><span>${sign}${(
    Math.abs(transaction.amount) * transaction.quantity
  ).toLocaleString(
    'es-CL'
  )}</span><button class="delete-btn" onClick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

//Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction);
  const total = amounts
    .reduce((acc, item) => acc + item.amount * item.quantity, 0)
    .toLocaleString('es-CL');

  const income = amounts
    .filter((item) => item.amount > 0)
    .reduce((acc, item) => (acc += item.amount * item.quantity), 0)
    .toLocaleString('es-CL');

  const expense = (
    amounts
      .filter((item) => item.amount < 0)
      .reduce((acc, item) => (acc += item.amount * item.quantity), 0) * -1
  ).toLocaleString('es-CL');

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;

  if (total == 0 || total < 0) {
    alert('Your balance now is $0');
  }
}

//Remove transactions by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

//Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

//Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
