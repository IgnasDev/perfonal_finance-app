
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
};
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataCtrl = function Data() {
  // object where will be collected all income/expense inputs
  var InputObj = function InputObj(category, dom) {
    _classCallCheck(this, InputObj);

    var title = dom.title,
        subcategory = dom.subcategory,
        amount = dom.amount;
    this.title = title.value;
    this.category = category;
    this.subcategory = subcategory.value;
    this.amount = amount.value;
  }; // item object


  var ItemObj = function ItemObj(id, inpObj) {
    _classCallCheck(this, ItemObj);

    var title = inpObj.title,
        subcategory = inpObj.subcategory,
        amount = inpObj.amount,
        category = inpObj.category;
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.subcategory = subcategory;
    this.category = category;
  }; // data structure


  var data = {
    items: {
      income: [],
      expense: []
    },
    currentSection: null,
    totalAmount: {
      totalIncome: 0,
      totalExpense: 0
    }
  };
  return {
    saveNewItem: function saveNewItem(category, dom) {
      var id;
      var newInputObj = new InputObj(category, dom);

      if (data.items[category].length === 0) {
        id = 0;
      }

      if (data.items[category].length > 0) {
        id = data.items[category][data.items[category].length - 1].id + 1;
      }

      var newItemObj = new ItemObj(id, newInputObj);
      data.items[category].push(newItemObj);
    },
    setCategory: function setCategory(category) {
      data.currentSection = category;
    },
    getCategory: function getCategory() {
      return data.currentSection;
    },
    calculateTotal: function calculateTotal() {
      var totalIncome = 0;
      var totalExpense = 0;

      if (data.items.income.length !== 0) {
        data.items.income.forEach(function (item) {
          totalIncome += parseFloat(item.amount);
        });
      }

      if (data.items.expense.length !== 0) {
        data.items.expense.forEach(function (item) {
          totalExpense += parseFloat(item.amount);
        });
      }

      data.totalAmount.totalIncome = parseFloat(totalIncome);
      data.totalAmount.totalExpense = parseFloat(totalExpense);
    },
    getTotal: function getTotal() {
      return data.totalAmount;
    },
    getIncomeAndExpenseItems: function getIncomeAndExpenseItems() {
      return data.items;
    },
    getCurrentItem: function getCurrentItem(event) {
      var splitId = event.target.parentElement.parentElement.id.split('-');
      var currentItem = null;

      if (splitId[0] === 'income') {
        data.items.income.forEach(function (item) {
          if (parseInt(item.id) === parseInt(splitId[1])) currentItem = item;
        });
      }

      if (splitId[0] === 'expense') {
        data.items.expense.forEach(function (item) {
          if (parseInt(item.id) === parseInt(splitId[1])) currentItem = item;
        });
      }

      return currentItem;
    },
    deleteCurrentItem: function deleteCurrentItem(currentItem) {
      var updatedArr;

      if (currentItem.category === 'income') {
        temporaryArr = data.items.income;
        updatedArr = temporaryArr.filter(function (item) {
          return parseInt(item.id) !== parseInt(currentItem.id);
        });
        data.items.income = updatedArr;
      }

      ;

      if (currentItem.category === 'expense') {
        temporaryArr = data.items.expense;
        updatedArr = temporaryArr.filter(function (item) {
          return parseInt(item.id) !== parseInt(currentItem.id);
        });
        data.items.expense = updatedArr;
      }
    },
    test: function test() {
      return data;
    }
  };
}();

var UICtrl = function UI() {
  var DOM = {
    buttons: {
      addNew: document.getElementById('addNew'),
      saveNew: document.getElementById('saveNew'),
      cancelNew: document.getElementById('cancelNew'),
      exitNew: document.getElementById('exitNew')
    },
    inputs: {
      title: document.getElementById('inputTitle'),
      subcategory: document.getElementById('inputSubcategory'),
      amount: document.getElementById('amount')
    },
    modalNew: document.getElementById('modal'),
    modalHeader: document.getElementById('modalHeader'),
    income_expense: {
      income: document.getElementById('income'),
      expense: document.getElementById('expense')
    },
    income_expense_list: {
      income_list: document.getElementById('income-list'),
      expense_list: document.getElementById('expense-list')
    },
    section_inc_exp: {
      section_income: document.getElementById('sectionIncome'),
      section_expense: document.getElementById('sectionExpense')
    }
  };
  return {
    getDOM: function getDOM() {
      return DOM;
    },
    clearInputs: function clearInputs(inpObj) {
      var title = inpObj.title,
          subcategory = inpObj.subcategory,
          amount = inpObj.amount;
      title.value = '';
      subcategory.value = '';
      amount.value = '';
    },
    showError: function showError(inp) {
      inp.classList.add('error');
      inp.placeholder = 'please fill this input';
    },
    clearError: function clearError(inp, placeholder) {
      setTimeout(function () {
        inp.classList.remove('error');
        inp.placeholder = placeholder;
      }, 2000);
    },
    showTotal: function showTotal(totalObj, overviewDOM) {
      var totalIncome = totalObj.totalIncome,
          totalExpense = totalObj.totalExpense;
      var income = overviewDOM.income,
          expense = overviewDOM.expense;
      income.innerHTML = totalIncome + ' $';
      expense.innerHTML = totalExpense + ' $';
    },
    showItems: function showItems(items, domList) {
      var incomeItems = items.income.map(function (item) {
        var htmlString = "  <li class=\"section__li\" id=\"income-".concat(item.id, "\">\n              <span class=\"section__span section__item-title\">\n                ").concat(item.title, "\n              </span>\n              <span class=\"section__span section__item-amount\">\n                ").concat(item.amount, " $\n              </span>\n              <span class=\"section__span section__item-tools\">\n                <i class=\"section-tool red fas fa-trash-alt\" id=\"delete-item\"></i>\n\n              </span>\n            </li>");
        return htmlString;
      });
      domList.income_list.innerHTML = incomeItems.join(' ');
      var expenseItems = items.expense.map(function (item) {
        var htmlString = "  <li class=\"section__li\" id=\"expense-".concat(item.id, "\">\n              <span class=\"section__span section__item-title\">\n                ").concat(item.title, "\n              </span>\n              <span class=\"section__span section__item-amount\">\n                ").concat(item.amount, " $\n              </span>\n              <span class=\"section__span section__item-tools\">\n                <i class=\"section-tool red fas fa-trash-alt\" id=\"delete-item\"></i>\n\n              </span>\n            </li>");
        return htmlString;
      });
      domList.expense_list.innerHTML = expenseItems.join(' ');
    }
  };
}();

var AppCtrl = function App(UI, DATA) {
  var DOM = UI.getDOM();

  var toggleDisplayHideOnModal = function toggleDisplayHideOnModal() {
    DOM.modalNew.classList.toggle('hide');
    UI.clearInputs(DOM.inputs);
  };

  var deleteItem = function deleteItem(event) {
    var currentItem = DATA.getCurrentItem(event);
    DATA.deleteCurrentItem(currentItem);
    DATA.calculateTotal();
    UI.showTotal(DATA.getTotal(), DOM.income_expense);
    UI.showItems(DATA.getIncomeAndExpenseItems(), DOM.income_expense_list);
    document.querySelectorAll('#delete-item').forEach(function (item) {
      item.addEventListener('click', deleteItem);
    });
    checkData();
  };

  var checkData = function checkData() {
    var getItems = DATA.getIncomeAndExpenseItems();

    if (getItems.income.length === 0 && getItems.expense.length === 0) {
      document.getElementById('section').style.display = 'none';
    }

    if (getItems.income.length === 0) {
      DOM.section_inc_exp.section_income.style.display = 'none';
    }

    if (getItems.expense.length === 0) {
      DOM.section_inc_exp.section_expense.style.display = 'none';
    }

    if (getItems.income.length > 0) {
      DOM.section_inc_exp.section_income.style.display = 'block';
      document.getElementById('section').style.display = 'block';
    }

    if (getItems.expense.length > 0) {
      DOM.section_inc_exp.section_expense.style.display = 'block';
      document.getElementById('section').style.display = 'block';
    }
  };

  var saveNewItem = function saveNewItem() {
    var category = DATA.getCategory();

    if (DOM.inputs.title.value === '') {
      UI.showError(DOM.inputs.title);
      UI.clearError(DOM.inputs.title, 'Title');
      return;
    }

    if (DOM.inputs.subcategory.value === '') {
      UI.showError(DOM.inputs.subcategory);
      UI.clearError(DOM.inputs.subcategory, 'Category');
      return;
    }

    if (DOM.inputs.amount.value === '') {
      UI.showError(DOM.inputs.amount);
      UI.clearError(DOM.inputs.amount, 'Amount');
      return;
    }

    DATA.saveNewItem(category, DOM.inputs);
    DATA.calculateTotal();
    UI.showTotal(DATA.getTotal(), DOM.income_expense);
    checkData();
    UI.showItems(DATA.getIncomeAndExpenseItems(), DOM.income_expense_list);
    document.querySelectorAll('#delete-item').forEach(function (item) {
      item.addEventListener('click', deleteItem);
    });
    UI.clearInputs(DOM.inputs);
    toggleDisplayHideOnModal();
  };

  var checkCategory = function checkCategory(event) {
    document.getElementById('modalIncome').classList.remove('current');
    document.getElementById('modalExpense').classList.remove('current');

    if (event.target.id === 'modalIncome' || event.target.id === 'modalExpense') {
      document.getElementById(event.target.id).classList.add('current');
    }

    DATA.setCategory(event.target.id.split('modal').join('').toLowerCase());
  }; // event handler


  var eventHandler = function eventHandler() {
    // show/hide add income / expense modal window
    DOM.buttons.addNew.addEventListener('click', toggleDisplayHideOnModal);
    DOM.buttons.exitNew.addEventListener('click', toggleDisplayHideOnModal);
    DOM.buttons.cancelNew.addEventListener('click', toggleDisplayHideOnModal); // save new income/expense

    DOM.buttons.saveNew.addEventListener('click', saveNewItem); // get selected section in new modal

    DOM.modalHeader.addEventListener('click', checkCategory);
  };

  return {
    init: function init() {
      console.log('Application starting...');
      eventHandler();
      checkData();
    }
  };
}(UICtrl, DataCtrl); // Application initialization


AppCtrl.init();
