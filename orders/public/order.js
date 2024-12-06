document.addEventListener('DOMContentLoaded', () => {
    // Função para listar pedidos
    orderList(); 
    // Função para carregar os livros do catálogo
    loadBooks();

    // Sincronizar cabeçalho e rodapé
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });
    fetch('/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookId = document.getElementById('bookId').value;
        const quantity = document.getElementById('quantity').value;
        const order = {
            bookId: bookId,
            quantity: parseInt(quantity)
        };
        try {
          const response = await fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
          });  
          const result = await response.text();
          document.getElementById('order-message').innerText = result;
          orderForm.reset();
          orderList(); 
        } catch (erro) {
            document.getElementById('order-message').innerText = 'Erro ao fazer o pedido.';
        }
    });

    // Função para listar pedidos
    async function orderList() {
        try {
            const response = await fetch('/orders');
            const orders = await response.json();
            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = '';
            orders.forEach(order => {
                const divOrder = document.createElement('div');
                divOrder.classList.add('order-note');
                divOrder.innerHTML = `
                    <h3>Pedido</h3>
                    <p>Nome do Livro: ${order.bookName}</p>
                    <p>Quantidade: ${order.quantity}</p>
                    <p>Preço Total: R$ ${order.totalPrice.toFixed(2)}</p>
                `;
                ordersContainer.appendChild(divOrder);
            });
        } catch (erro) {
            console.error('Erro ao listar pedidos:\n', erro);
        }
    }

    // Função para carregar os livros do catálogo
    async function loadBooks() {
        try {
            const response = await fetch('http://localhost:3003/catalog');
            const books = await response.json();
            const bookSelect = document.getElementById('bookId');
            books.forEach(book => {
                const option = document.createElement('option');
                option.value = book._id;
                option.text = book.name;
                bookSelect.appendChild(option);
            });
        } catch (erro) {
            console.error('Erro ao carregar livros do catálogo:', erro);
        }
    }

    // Função para exibir itens do carrinho
    async function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items-container');
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerText = 'Nenhum item no carrinho.';
            return;
        }

        for (const itemId of cart) {
            try {
                const response = await fetch(`http://localhost:3003/catalog/${itemId}`);
                const item = await response.json();
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Preço: R$ ${item.price.toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(itemDiv);
            } catch (erro) {
                console.error('Erro ao carregar detalhes do item do carrinho:', erro);
            }
        }
    }

    // Exibir itens do carrinho ao carregar a página
    displayCartItems();

});