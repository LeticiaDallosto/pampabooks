document.addEventListener('DOMContentLoaded', () => {
    // Sincronizar cabeçalho e rodapé
    loadHeaderAndFooter()

    // Função para listar pedidos
    orderList(); 
    // Função para carregar os livros do catálogo
    loadBooks();



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

    function restoreProductsToLocalStorage() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const cartParam = urlParams.get('cart');

        const products = cartParam.split(',').map(function(product) {
            return decodeURIComponent(product);
        });

        localStorage.setItem('cart', JSON.stringify(products));

        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl); // Atualiza a URL sem recarregar a página
    }

    async function loadHeaderAndFooter() {
        try {
            // Fetch and load the header
            const headerResponse = await fetch('/header.html');
            const headerData = await headerResponse.text();
            document.getElementById('header').innerHTML = headerData;
    
            // Call the function to update the cart count after the header is loaded
            updateCartCount();

            const cartListButton = document.getElementById('cart-button');
            cartListButton.addEventListener('click', function(e) {
                e.preventDefault();
        
                const products = JSON.parse(localStorage.getItem('cart')) || [];
                const cartParam = products.map(function(product) {
                    return encodeURIComponent(product);
                }).join(',');

                const newUrl = 'http://localhost:3004?cart=' + cartParam;
                window.location.href = newUrl;
            });
    
            // Fetch and load the footer
            const footerResponse = await fetch('/footer.html');
            const footerData = await footerResponse.text();
            document.getElementById('footer').innerHTML = footerData;
        } catch (error) {
            console.error('Error loading header or footer:', error);
        }
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;

            if (cart.length === 0) {
                cartCountElement.classList.add('hidden');
            } else {
                cartCountElement.classList.remove('hidden');
            }
        }
    }
    
    restoreProductsToLocalStorage()
    // Exibir itens do carrinho ao carregar a página
    displayCartItems();

});