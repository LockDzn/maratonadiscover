const Modal = {
    open() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.add('active') 
    },
    close() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.remove('active')
    }
}


const Theme = {
    dark() {
        const html = document.querySelector('html')
        const image = document.querySelector('.change-theme img')
        image.src = 'assets/sun.svg'
        html.setAttribute('data-theme', 'dark')
    },
    light() {
        const html = document.querySelector('html')
        const image = document.querySelector('.change-theme img')
        image.src = 'assets/moon.svg'
        html.setAttribute('data-theme', 'light')
    },

    change() {
        const html = document.querySelector('html')

        const theme = html.getAttribute('data-theme');

        if(theme == 'dark') {
            Theme.light()
        }else {
            Theme.dark()
        }
    },
}