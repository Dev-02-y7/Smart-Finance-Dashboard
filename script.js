const incomeForm =
  document.getElementById("incomeForm");

const expenseForm =
  document.getElementById("expenseForm");

const incomeList =
  document.getElementById("incomeList");

const expenseList =
  document.getElementById("expenseList");

const balance =
  document.getElementById("balance");

const totalIncome =
  document.getElementById("totalIncome");

const totalExpense =
  document.getElementById("totalExpense");

const savingsRate =
  document.getElementById("savingsRate");

const insights =
  document.getElementById("insights");

const themeToggle =
  document.getElementById("themeToggle");

const searchInput =
  document.getElementById("searchInput");

const currencySelector =
  document.getElementById("currencySelector");

let incomes =
  JSON.parse(localStorage.getItem("incomes")) || [];

let expenses =
  JSON.parse(localStorage.getItem("expenses")) || [];

let expenseChart;

let currency =
  localStorage.getItem("currency") || "$";

// DARK MODE

themeToggle.addEventListener("click",()=>{

  document.body.classList.toggle("dark");

});

currencySelector.value = currency;

currencySelector.addEventListener("change",()=>{

  currency =
    currencySelector.value;

  localStorage.setItem(
    "currency",
    currency
  );

  updateUI();

});

// ADD INCOME

incomeForm.addEventListener("submit",(e)=>{

  e.preventDefault();

  const source =
    document.getElementById("incomeSource").value;

  const amount =
    Number(document.getElementById("incomeAmount").value);

  const income = {

    id:Date.now(),

    source,

    amount

  };

  incomes.push(income);

  saveData();

  updateUI();

  incomeForm.reset();

});

// ADD EXPENSE

expenseForm.addEventListener("submit",(e)=>{

  e.preventDefault();

  const title =
    document.getElementById("expenseTitle").value;

  const amount =
    Number(document.getElementById("expenseAmount").value);

  const category =
    document.getElementById("expenseCategory").value;

  const date =
    document.getElementById("expenseDate").value;

  const expense = {

    id:Date.now(),

    title,

    amount,

    category,

    date

  };

  expenses.push(expense);

  saveData();

  updateUI();

  expenseForm.reset();

});

// SAVE DATA

function saveData(){

  localStorage.setItem(
    "incomes",
    JSON.stringify(incomes)
  );

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

}

// DELETE FUNCTIONS

function deleteIncome(id){

  incomes =
    incomes.filter(
      income => income.id !== id
    );

  saveData();

  updateUI();

}

function deleteExpense(id){

  expenses =
    expenses.filter(
      expense => expense.id !== id
    );

  saveData();

  updateUI();

}

// UPDATE UI

function updateUI(filteredExpenses = expenses){

  incomeList.innerHTML = "";

  expenseList.innerHTML = "";

  let incomeTotal = 0;

  let expenseTotal = 0;

  // RENDER INCOMES

  incomes.forEach(income=>{

    incomeTotal += income.amount;

    const li =
      document.createElement("li");

    li.classList.add("income-item");

    li.innerHTML = `

      <div>

        <strong>
          ${income.source}
        </strong>

      </div>

      <div>

        ${currency}${income.amount}

        <button
          class="delete-btn"
          onclick="deleteIncome(${income.id})"
        >
          X
        </button>

      </div>

    `;

    incomeList.appendChild(li);

  });

  // RENDER EXPENSES

  filteredExpenses.forEach(expense=>{

    expenseTotal += expense.amount;

    const li =
      document.createElement("li");

    li.classList.add("expense-item");

    li.innerHTML = `

      <div class="expense-details">

        <strong>
          ${expense.title}
        </strong>

        <span class="category">
          ${expense.category}
          •
          ${expense.date}
        </span>

      </div>

      <div>

        ${currency}${expense.amount}

        <button
          class="delete-btn"
          onclick="deleteExpense(${expense.id})"
        >
          X
        </button>

      </div>

    `;

    expenseList.appendChild(li);

  });

  const remaining =
    incomeTotal - expenseTotal;

  const savings =
    incomeTotal > 0
      ? ((remaining / incomeTotal) * 100).toFixed(1)
      : 0;

  balance.innerText =
    `${currency}${remaining.toFixed(2)}`;

  totalIncome.innerText =
    `${currency}${incomeTotal.toFixed(2)}`;

  totalExpense.innerText =
    `${currency}${expenseTotal.toFixed(2)}`;

  savingsRate.innerText =
    `${savings}%`;

  generateInsights(
    incomeTotal,
    expenseTotal,
    savings
  );

  updateChart();

}

// SEARCH FILTER

searchInput.addEventListener("input",()=>{

  const value =
    searchInput.value.toLowerCase();

  const filtered =
    expenses.filter(expense =>
      expense.title
        .toLowerCase()
        .includes(value)
    );

  updateUI(filtered);

});

// INSIGHTS ENGINE

function generateInsights(
  incomeTotal,
  expenseTotal,
  savings
){

  insights.innerHTML = "";

  const messages = [];

  if(savings >= 50){

    messages.push(
      "Excellent savings rate this month."
    );

  }

  if(expenseTotal > incomeTotal * 0.7){

    messages.push(
      "Your expenses are very high this month."
    );

  }

  if(expenseTotal < incomeTotal * 0.4){

    messages.push(
      "Great expense management."
    );

  }

  if(messages.length === 0){

    messages.push(
      "Financial activity looks balanced."
    );

  }

  messages.forEach(message=>{

    const div =
      document.createElement("div");

    div.classList.add("insight");

    div.innerText = message;

    insights.appendChild(div);

  });

}

// CHART.JS

function updateChart(){

  const categories = {};

  expenses.forEach(expense=>{

    if(categories[expense.category]){

      categories[expense.category] +=
        expense.amount;

    } else {

      categories[expense.category] =
        expense.amount;

    }

  });

  const data = {

    labels:Object.keys(categories),

    datasets:[{

      label:"Expenses",

      data:Object.values(categories),

      borderWidth:1

    }]

  };

  const config = {

    type:"doughnut",

    data,

    options:{

      responsive:true

    }

  };

  if(expenseChart){

    expenseChart.destroy();

  }

  expenseChart =
    new Chart(
      document.getElementById("expenseChart"),
      config
    );

}

// INITIAL LOAD

updateUI();