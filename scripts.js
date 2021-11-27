
const Modal = {
    toggle() {
        modal = document.querySelector(".modal-overlay")
        modal.classList.toggle('active')
    }
}

const Storage = {
    get() {
        console.log('pegou')
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []; 
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const transactions = [{
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021'
},
{
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021'
},
{
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021'
}]


const transactionsActions = {
    all: Storage.get(),
    add(transaction) {
        transactionsActions.all.push(transaction)
        App.reload()
    },
    remove(index) {
        transactionsActions.all.splice(index, 1)

        App.reload()

    },
    income() {
        let income = 0;
        transactionsActions.all.forEach(trans => {
            if(trans.amount > 0) {
                income += trans.amount
            }
        }) 
        return income
    },
    expenses() {
        let expense = 0; 
        transactionsActions.all.forEach(trans => {
            if(trans.amount < 0) {
                expense += trans.amount
            }
        }) 
        return expense
    }, 
    total() {
        return transactionsActions.income() + transactionsActions.expenses()

    }

}

const Utils = {
    formatCurrence(amount) {
        const signal = Number(amount) < 0 ? "-" : ""
        value = String(amount).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },
    formatAmount(amount) {
        amount = Number(amount) * 100
        return amount

    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrence(transaction.amount)

        const html = `
        <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date" class="description">${transaction.date}</td>
        <td><img src="assets/minus.svg" alt="Remover Transação" onclick="transactionsActions.remove(${index})"></td>
        </tr>
        `
        return html
    },

    updateBalance(trans) {
        
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrence(transactionsActions.income())
        
        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrence(transactionsActions.expenses())

        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrence(transactionsActions.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return ({
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        })

    },

    validateFields() {
        const { description, amount, date } = this.getValues();
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
            throw new Error("Campos com dados faltando, por favor preencha")
        }
    },

    formatValues() {
        let { description, amount, date } = this.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        
        //pela key ser o mesmo nome do valor que eu quero colocar posso simplesmente fazer o objeto assim:
        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction) {
        transactionsActions.add(transaction);
    },
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event){
        event.preventDefault();

        try {
        Form.validateFields();
        const transaction = Form.formatValues();
        Form.saveTransaction(transaction);
        Form.clearFields();
        Modal.toggle();
        
        }
        catch (error) {
            alert("Erro: " + error.message)

        }
    }
}

const App = {
    init() {
        transactionsActions.all.forEach(DOM.addTransaction);

        DOM.updateBalance();

        Storage.set(transactionsActions.all)

    
    },
    reload() {
        DOM.clearTransactions();
        App.init();

    }
}



App.init();

/*
transactionsActions.add({
    id: 39,
    description: 'Alo',
    amount: 200,
    date: '23/01/2021'
});
*/


