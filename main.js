const Modal = {
    toggle() {
        const modal = document.querySelector('.modal-overlay')

        if (modal.classList.toggle('active')) {
            modal.classList.add('active')
        } else {
            modal.classList.remove('active')
        }
    }
}

const Storage = {
    getTransactions() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },
    setTransactions(transactions) {
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
    },
    getTheme() {
        return localStorage.getItem('dev.finances:theme') || 'dark'
    },
    setTheme(theme) {
        localStorage.setItem('dev.finances:theme', theme)
    }
}

const Theme = {
    dark() {
        const html = document.querySelector('html')
        const image = document.querySelector('.change-theme img')
        image.src = 'assets/sun.svg'
        html.setAttribute('data-theme', 'dark')
        Storage.setTheme('dark')
    },
    light() {
        const html = document.querySelector('html')
        const image = document.querySelector('.change-theme img')
        image.src = 'assets/moon.svg'
        html.setAttribute('data-theme', 'light')
        Storage.setTheme('light')
    },
    set(theme) {
        const html = document.querySelector('html')
        const image = document.querySelector('.change-theme img')

        image.src = theme === 'dark' ? 'assets/sun.svg' : 'assets/moon.svg'
        html.setAttribute('data-theme', theme)
        Storage.setTheme(theme)
    },
    change() {
        const theme = document.querySelector('html').getAttribute('data-theme');
        this.set(theme === 'dark' ? 'light' : 'dark')
    },
}

const Transaction = {
    all: Storage.getTransactions(),
    add(transaction) {
        this.all.push(transaction)
        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0

        this.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income
    },
    
    expenses() {
        let expense = 0

        this.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
        return this.incomes() + this.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML= this.innerHTMLTransaction(transaction, index)

        this.transactionContainer.appendChild(tr)
    },
    clearTransactions() {
        this.transactionContainer.innerHTML = ''
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount < 0 ? 'expense' : 'income'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="assets/minus.svg" onclick="Transaction.remove(${index})" alt="Remover transação">
        </td>
        `

        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')
        value = Number(value)/100

        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value
    },
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatDate(date) {
        const splittedDate = date.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.getElementById('description'),
    amount: document.getElementById('amount'),
    date: document.getElementById('date'),

    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value,
        }
    },

    validateFields() {
        const { description, amount, date } = this.getValues()

        if(description.trim() == '' || amount.trim() == '' || date.trim() == '') {
            throw new Error('Por favor, preencha todos os campos')
        }

        return {
            description, 
            amount,
            date
        }
    },
    formatValue() {
        let { description, amount, date } = this.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },
    clearDate() {
        this.description.value = ''
        this.amount.value = ''
        this.date.value = ''
    },
    submit(event) {
        event.preventDefault()

        try {
            this.validateFields()
            transaction = this.formatValue()
            Transaction.add(transaction)
            this.clearDate()
            Modal.toggle()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()
        Storage.setTransactions(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}
Theme.set(Storage.getTheme())
App.init()