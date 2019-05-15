const DataCtrl = (function Data() {
// object where will be collected all income/expense inputs
class InputObj {
  constructor(category,dom) {
    const {title, subcategory, amount} = dom;
    this.title = title.value;
    this.category = category;
    this.subcategory = subcategory.value;
    this.amount = amount.value;
  }
}
// item object
class ItemObj {
  constructor(id,inpObj) {
    const {title, subcategory, amount,category} = inpObj;
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.subcategory = subcategory;
    this.category = category;
  }
}
// data structure
const data = {
  items: {
    income: [],
    expense: []
  },
  currentSection: null,
  totalAmount: {
    totalIncome: 0,
    totalExpense: 0
  }
}

  return {
   saveNewItem: (category,dom) => {
     let id;
     let newInputObj = new InputObj(category,dom);

     if(data.items[category].length === 0) {
       id = 0;
     }
     if(data.items[category].length > 0) {
       id = data.items[category][data.items[category].length - 1].id + 1;
     }

     let newItemObj = new ItemObj(id,newInputObj);
     data.items[category].push(newItemObj);
   },
   setCategory: (category) => {
     data.currentSection = category;
   },
   getCategory: () => data.currentSection,
   calculateTotal: () => {
     let totalIncome = 0;
     let totalExpense = 0;
     if(data.items.income.length !== 0) {
       data.items.income.forEach( item => {
         totalIncome += parseFloat(item.amount);
       })
     }
     if(data.items.expense.length !== 0) {
       data.items.expense.forEach( item => {
         totalExpense += parseFloat(item.amount);
       })
     }
     data.totalAmount.totalIncome = parseFloat(totalIncome);
     data.totalAmount.totalExpense = parseFloat(totalExpense);
   },
   getTotal: () =>  data.totalAmount,
   getIncomeAndExpenseItems: () => data.items,
   getCurrentItem: (event) => {
     let splitId = event.target.parentElement.parentElement.id.split('-');
     let currentItem = null;
     if(splitId[0] === 'income') {
       data.items.income.forEach(item => {
         if(parseInt(item.id) === parseInt(splitId[1]))
         currentItem = item;
       })
     }
     if(splitId[0] === 'expense') {
       data.items.expense.forEach(item => {
         if(parseInt(item.id) === parseInt(splitId[1]))
         currentItem = item;
       })
     }
     return currentItem;
   }
   ,
   deleteCurrentItem: (currentItem) => {
     let updatedArr;
    if(currentItem.category === 'income') {
      temporaryArr = data.items.income;
      updatedArr = temporaryArr.filter( item => {
        return parseInt(item.id) !== parseInt(currentItem.id);
      });
      data.items.income = updatedArr;
    };
      if(currentItem.category === 'expense') {
        temporaryArr = data.items.expense;
        updatedArr = temporaryArr.filter( item => {
          return parseInt(item.id) !== parseInt(currentItem.id);
        });
        data.items.expense = updatedArr;
      }

   },
   test: () => {
     return data;
   }
  }
})()


const UICtrl = (function UI() {
const DOM = {
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
}
  return {
     getDOM: () => {
       return DOM;
     },
     clearInputs: (inpObj) => {
       const {title, subcategory, amount} = inpObj;
       title.value = '';
       subcategory.value = '';
       amount.value = '';
     },
     showError: (inp) => {
       inp.classList.add('error');
       inp.placeholder = 'please fill this input';
     },
     clearError: (inp,placeholder) => {
       setTimeout(() => {
         inp.classList.remove('error');
         inp.placeholder = placeholder;
       }, 2000 )
     },
     showTotal: (totalObj, overviewDOM) => {
        const {totalIncome, totalExpense} = totalObj;
        const {income, expense} = overviewDOM;
        income.innerHTML = totalIncome + ' $';
        expense.innerHTML = totalExpense + ' $';
     },
     showItems: (items, domList) => {
        const incomeItems = items.income.map( item => {
          let htmlString = `  <li class="section__li" id="income-${item.id}">
              <span class="section__span section__item-title">
                ${item.title}
              </span>
              <span class="section__span section__item-amount">
                ${item.amount} $
              </span>
              <span class="section__span section__item-tools">
                <i class="section-tool red fas fa-trash-alt" id="delete-item"></i>

              </span>
            </li>`;
            return htmlString;
        });
        domList.income_list.innerHTML = incomeItems.join(' ');
        const expenseItems = items.expense.map( item => {
          let htmlString = `  <li class="section__li" id="expense-${item.id}">
              <span class="section__span section__item-title">
                ${item.title}
              </span>
              <span class="section__span section__item-amount">
                ${item.amount} $
              </span>
              <span class="section__span section__item-tools">
                <i class="section-tool red fas fa-trash-alt" id="delete-item"></i>

              </span>
            </li>`;
            return htmlString;
        });
        domList.expense_list.innerHTML = expenseItems.join(' ');
     }
  }
})()


const AppCtrl = (function App(UI, DATA) {
 const DOM = UI.getDOM();
 const toggleDisplayHideOnModal = () => {
   DOM.modalNew.classList.toggle('hide');
   UI.clearInputs(DOM.inputs);
 }
 const deleteItem = (event) => {
   let currentItem = DATA.getCurrentItem(event);
   DATA.deleteCurrentItem(currentItem);
   DATA.calculateTotal();
   UI.showTotal(DATA.getTotal(), DOM.income_expense);
UI.showItems(DATA.getIncomeAndExpenseItems(), DOM.income_expense_list);
document.querySelectorAll('#delete-item').forEach(item => {
     item.addEventListener('click', deleteItem);
   })
   checkData();
 }
 const checkData = () => {
   let getItems = DATA.getIncomeAndExpenseItems();
   if(getItems.income.length === 0 && getItems.expense.length === 0) {
     document.getElementById('section').style.display = 'none';
   }
   if(getItems.income.length === 0) {
     DOM.section_inc_exp.section_income.style.display = 'none';
   }
   if(getItems.expense.length === 0) {
     DOM.section_inc_exp.section_expense.style.display = 'none';
   }
   if(getItems.income.length > 0) {
      DOM.section_inc_exp.section_income.style.display = 'block';
      document.getElementById('section').style.display = 'block';
   }
   if(getItems.expense.length > 0) {
     DOM.section_inc_exp.section_expense.style.display = 'block';
     document.getElementById('section').style.display = 'block';
   }
 }
 const saveNewItem = () => {
   let category = DATA.getCategory();
   if(DOM.inputs.title.value === '') {
     UI.showError(DOM.inputs.title);
     UI.clearError(DOM.inputs.title, 'Title')
     return;
   }
   if(DOM.inputs.subcategory.value === '') {
     UI.showError(DOM.inputs.subcategory);
     UI.clearError(DOM.inputs.subcategory, 'Category')
     return;
   }
   if(DOM.inputs.amount.value === '') {
     UI.showError(DOM.inputs.amount);
     UI.clearError(DOM.inputs.amount, 'Amount')
     return;
   }
   DATA.saveNewItem(category, DOM.inputs);
   DATA.calculateTotal();
   UI.showTotal(DATA.getTotal(), DOM.income_expense);
   checkData();
   UI.showItems(DATA.getIncomeAndExpenseItems(), DOM.income_expense_list);
   document.querySelectorAll('#delete-item').forEach(item => {
     item.addEventListener('click', deleteItem);
   })





   UI.clearInputs(DOM.inputs);
   toggleDisplayHideOnModal();
 }


 const checkCategory = (event) => {
   document.getElementById('modalIncome').classList.remove('current');
   document.getElementById('modalExpense').classList.remove('current');
   if(event.target.id === 'modalIncome' || event.target.id === 'modalExpense') {
     document.getElementById(event.target.id).classList.add('current');
   }
   DATA.setCategory(event.target.id.split('modal').join('').toLowerCase())
 }




 // event handler
 const eventHandler = () => {
   // show/hide add income / expense modal window
   DOM.buttons.addNew.addEventListener('click', toggleDisplayHideOnModal);
   DOM.buttons.exitNew.addEventListener('click', toggleDisplayHideOnModal);
   DOM.buttons.cancelNew.addEventListener('click', toggleDisplayHideOnModal);
   // save new income/expense
   DOM.buttons.saveNew.addEventListener('click', saveNewItem);
   // get selected section in new modal
   DOM.modalHeader.addEventListener('click', checkCategory);
 }







  return {
    init: () => {
      console.log('Application starting...');
      eventHandler();
      checkData();
    }
  }
})(UICtrl, DataCtrl)


// Application initialization
AppCtrl.init();
