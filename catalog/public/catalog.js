document.addEventListener('DOMContentLoaded', () => {
    productList();
  
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productName = document.getElementById('name').value;
        const productPrice = document.getElementById('price').value;
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
            document.getElementById('product-message').innerText = resultado;
            productList();
        } catch (erro) {
            document.getElementById('product-message').innerText = 'Erro ao cadastrar o produto.';
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
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                <p>Nome: ${product.name}</p>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                `;
                catalogContainer.appendChild(productDiv);
            });
        } catch (erro) {
        console.error('Erro ao listar produtos.', erro);
        }
    }

});


  