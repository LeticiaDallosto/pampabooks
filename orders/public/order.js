document.addEventListener('DOMContentLoaded', () => {
    // Sincronizar cabeçalho e rodapé
    loadHeaderAndFooter();

    // Função para listar pedidos
    orderList();

    // Exibir itens do carrinho ao carregar a página
    displayCartItems();

    // Finalizar pedido
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const quantities = Array.from(document.querySelectorAll('.quantity-input')).map(input => ({
            id: input.dataset.id,
            quantity: parseInt(input.value)
        }));

        const orders = cart.map(itemId => {
            const quantity = quantities.find(q => q.id === itemId).quantity;
            return {
                bookId: itemId,
                quantity: quantity
            };
        });

        try {
            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orders })
            });
            const result = await response.json();
            const orderMessage = document.getElementById('order-message');
            orderMessage.textContent = 'Pedido realizado com sucesso!';
            orderMessage.classList.add('message');
            localStorage.removeItem('cart');
            displayCartItems();
            orderList();
        } catch (erro) {
            const orderMessage = document.getElementById('order-message');
            orderMessage.textContent = 'Erro ao fazer o pedido.';
            orderMessage.classList.add('message');
        }
    });

    // Atualizar local storage ao sair da página
    window.addEventListener('beforeunload', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem('cart', JSON.stringify(cart));
    });
});

// Função para exibir itens do carrinho
async function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="4">Nenhum item no carrinho.</td></tr>';
        return;
    }

    // Agrupar itens do carrinho por ID e calcular a quantidade total
    const groupedCart = cart.reduce((acc, itemId) => {
        if (!acc[itemId]) {
            acc[itemId] = { id: itemId, quantity: 0 };
        }
        acc[itemId].quantity += 1;
        return acc;
    }, {});

    for (const itemId in groupedCart) {
        try {
            const response = await fetch(`http://localhost:3003/catalog/${itemId}`);
            const item = await response.json();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>R$ ${item.price.toFixed(2)}</td>
                <td><input type="number" class="quantity-input" data-id="${itemId}" value="${groupedCart[itemId].quantity}" min="1"></td>
                <td><button class="remove-item" data-id="${itemId}">Remover</button></td>
            `;
            cartItemsContainer.appendChild(row);
        } catch (erro) {
            console.error('Erro ao carregar detalhes do item do carrinho:', erro);
        }
    }

    // Adicionar listeners para os botões de remoção
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(id => id !== itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        });
    });

    // Adicionar listeners para os inputs de quantidade
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const itemId = event.target.dataset.id;
            const newQuantity = parseInt(event.target.value);
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(id => id !== itemId); // Remover todas as ocorrências do item
            for (let i = 0; i < newQuantity; i++) {
                cart.push(itemId); // Adicionar o item de volta com a nova quantidade
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        });
    });
}

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

function restoreProductsToLocalStorage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cartParam = urlParams.get('cart');

    const products = cartParam.split(',').map(function(product) {
        return decodeURIComponent(product);
    });

    localStorage.setItem('cart', JSON.stringify(products));

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl); // Atualiza a URL sem recarregar a página
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

restoreProductsToLocalStorage();
displayCartItems();