document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const reviewForm = document.getElementById('review-form');

    // Função para adicionar uma review à lista
    function addReview(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML = `
            <h3>Avaliação: ${review.rating} estrelas</h3>
            <p><strong>Livro:</strong> ${review.bookName} (ID: ${review.bookId})</p>
            <p><strong>Usuário:</strong> ${review.userName} (ID: ${review.userId})</p>
            <p>${review.reviewText}</p>
            <p><em>Enviada em: ${new Date(review.createdAt).toLocaleString()}</em></p>
        `;
        reviewsContainer.appendChild(reviewDiv);
    }

    // Função para exibir uma mensagem de feedback
    function showMessage(message, isSuccess) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = isSuccess ? 'success' : 'error';
        // Remover a mensagem após 5 segundos
        setTimeout(() => {
            feedbackMessage.textContent = '';
            feedbackMessage.className = '';
        }, 5000);
    }

    // Função para carregar as reviews do servidor
    function loadReviews() {
        fetch('/api/reviews')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    reviewsContainer.innerHTML = ''; // Limpar container antes de adicionar
                    data.forEach(review => {
                        addReview(review);
                    });
                } else {
                    showMessage('Erro ao carregar reviews: Resposta inválida', false);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                showMessage('Erro ao carregar reviews!', false);
            });
    }

    // Manipulador de eventos para o formulário de reviews
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Coletar os valores dos campos
        const comment = document.getElementById('review-comment').value.trim();
        const rating = parseInt(document.getElementById('rating').value);
        const bookId = document.getElementById('book-id').value.trim();
        const bookName = document.getElementById('book-name').value.trim();
        const userId = document.getElementById('user-id').value.trim();
        const userName = document.getElementById('user-name').value.trim();

        // Verificação básica para garantir que todos os campos estão preenchidos
        if (!comment || !rating || !bookId || !bookName || !userId || !userName) {
            showMessage('Erro: Preencha todos os campos!', false);
            return;
        }

        // Estruturar os dados a serem enviados
        const reviewData = {
            bookId,
            bookName,
            userId,
            userName,
            rating,
            reviewText: comment
        };

        // Enviar os dados para o servidor
        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => response.json())
        .then(data => {
            if (data._id) { // Verifica se a review foi criada com sucesso
                addReview(data); // Adiciona a nova review à lista
                showMessage('Review enviada com sucesso!', true);
                reviewForm.reset(); // Limpa o formulário
            } else {
                showMessage('Erro ao enviar review: ' + (data.mensagem || 'Erro desconhecido'), false);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            showMessage('Erro ao enviar review!', false);
        });
    });

    // Carregar as reviews quando a página for carregada
    loadReviews();
});