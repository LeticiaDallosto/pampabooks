document.addEventListener('DOMContentLoaded', () => {
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
  
    // Função para listar produtos
    async function productList() {
        try {
            const response = await fetch('/catalog');
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
                    <h3>${product.name}</h3>
                    <p>Preço: R$ ${product.price.toFixed(2)}</p>
                `;
                catalogContainer.appendChild(productDiv);
            });
        } catch (erro) {
            console.error('Erro ao listar produtos.', erro);
        }
    }
});