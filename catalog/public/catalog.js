document.addEventListener('DOMContentLoaded', () => {

    // Função para listar produtos
    async function productList() {
        try {
            const response = await fetch('http://localhost:3003/catalog');
            const catalog = await response.json();
    
            if (catalog.length === 0) {
                document.getElementById('catalog-container').innerText = 'Nenhum produto cadastrado.';
                return;
            }
    
            const catalogContainer = document.getElementById('catalog-container');
            catalogContainer.innerHTML = '';
            catalog.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('book-card');
                productDiv.innerHTML = `
                    <i class="fas fa-book book-icon"></i>
                    <h3><a href="product.html?id=${product._id}">${product.name}</a></h3>
                    <p>Preço: R$ ${product.price.toFixed(2)}</p>
                `;
                catalogContainer.appendChild(productDiv);
            });
        } catch (erro) {
            console.error('Erro ao listar produtos.', erro);
        }
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

    // Atualizar contador do carrinho
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

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        const userData = JSON.parse(atob(token.split('.')[1]));
        
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('isAdmin', userData.isAdmin); 

        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl); // Atualiza a URL sem recarregar a página
    }

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Ocultar formulário de cadastro de produto se o usuário não for administrador
    if (!isAdmin) {
        document.getElementById('product-form').style.display = 'none';
    }
    
    loadHeaderAndFooter()
    productList();

    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productName = document.getElementById('name').value.trim();
        const productPrice = document.getElementById('price').value.trim();
        const productMessage = document.getElementById('product-message');

        productMessage.innerText = '';

        if (!productName) {
            productMessage.innerText = 'O nome do produto não pode estar vazio.';
            return;
        }
        if (!productPrice || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
            productMessage.innerText = 'O preço do produto deve ser um número positivo.';
            return;
        }

        const product = { 
            name: productName,
            price: parseFloat(productPrice)
        };

        try {
            const response = await fetch('/catalog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            const resultado = await response.json();
            if (response.ok) {
                // Limpar o formulário
                productForm.reset();
    
                // Atualizar a lista de produtos
                productList();
                productMessage.innerText = 'Produto cadastrado com sucesso!';
            } else {
                console.error('Erro ao criar produto.');
                productMessage.innerText = 'Erro ao cadastrar o produto.';
            }
        } catch (erro) {
            console.error('Erro ao cadastrar o produto.', erro);
            productMessage.innerText = 'Erro ao cadastrar o produto.';
        }
    });
});