document.addEventListener('DOMContentLoaded', async () => {

    // Sincronizar cabeçalho e rodapé
    loadHeaderAndFooter()

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
        document.getElementById('product-details').innerText = 'Produto não encontrado.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3003/catalog/${productId}`);
        const product = await response.json();
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
            <h2>${product.name}</h2>
            <p>Preço: R$ ${product.price.toFixed(2)}</p>
            <p>Descrição: ${product.description || 'Este livro é uma referência essencial para aprender e aplicar conhecimentos na área de tecnologia. Com abordagem prática e exemplos claros, é ideal para estudantes, profissionais e entusiastas. Uma ferramenta indispensável para quem busca se atualizar e se destacar no setor.'}</p>
            <p>Categoria: ${product.category || 'Educação e Tecnologia'}</p>
            <p>Data de Criação: ${new Date(product.criationDate).toLocaleDateString()}</p>
        `;

        // Preencher campos ocultos do formulário de avaliação
        document.getElementById('book-id').value = product._id;
        document.getElementById('book-name').value = product.name;

        // Carregar avaliações do produto
        loadReviews(productId);
    } catch (erro) {
        console.error('Erro ao carregar detalhes do produto:', erro);
        document.getElementById('product-details').innerText = 'Erro ao carregar detalhes do produto.';
    }

    // Configurar o modal de avaliação
    const modal = document.getElementById('review-modal');
    const addReviewBtn = document.getElementById('add-review-btn');
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    addReviewBtn.onclick = function() {
        // Verificar se o usuário está logado
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');

        if (!userId || !userName) {
            alert('Você precisa estar logado para enviar uma avaliação.');
            window.location.href = 'http://localhost:3002/index.html'; // Redirecionar para a página de login
            return;
        }

        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Enviar avaliação
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obter ID e nome do usuário logado
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');

        if (!userId || !userName) {
            alert('Você precisa estar logado para enviar uma avaliação.');
            window.location.href = 'http://localhost:3002/index.html'; // Redirecionar para a página de login
            return;
        }

        const review = {
            bookId: document.getElementById('book-id').value,
            bookName: document.getElementById('book-name').value,
            userId: userId,
            userName: userName,
            rating: document.getElementById('rating').value,
            reviewText: document.getElementById('review-comment').value
        };

        try {
            const response = await fetch('http://localhost:3005/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            });

            if (response.ok) {
                modal.style.display = 'none';
                loadReviews(productId); // Recarregar avaliações
            } else {
                console.error('Erro ao enviar avaliação:', response.statusText);
            }
        } catch (erro) {
            console.error('Erro ao enviar avaliação:', erro);
        }
    });

    // Adicionar ao carrinho
    const cartButton = document.querySelector('.shopping-btn');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
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

    // Inicializar contador do carrinho
    updateCartCount();
});

// Função para carregar as avaliações do produto
async function loadReviews(productId) {
    try {
        const response = await fetch(`http://localhost:3005/reviews/book/${productId}`);
        const reviews = await response.json();
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';

        if (reviews.length === 0) {
            const noReviewsMessage = document.createElement('div');
            noReviewsMessage.className = 'no-reviews-message';
            noReviewsMessage.innerText = 'Nenhuma avaliação encontrada.';
            reviewsContainer.appendChild(noReviewsMessage);
            return;
        }

        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';

            // Gerar estrelas
            let stars = '';
            for (let i = 0; i < review.rating; i++) {
                stars += '<i class="fas fa-star"></i>';
            }

            reviewDiv.innerHTML = `
                <h3>Livro: ${review.bookName} </h3>
                <p><strong>Avaliação:</strong> ${stars}</p>
                <p><strong>Usuário:</strong> ${review.userName} </p>
                <p>${review.reviewText}</p>
                <small><em>Enviada em: ${new Date(review.createdAt).toLocaleDateString()}</em></small>
            `;
            reviewsContainer.appendChild(reviewDiv);
        });
    } catch (erro) {
        console.error('Erro ao carregar avaliações:', erro);
        document.getElementById('reviews-container').innerText = 'Erro ao carregar avaliações.';
    }
}