document.addEventListener('DOMContentLoaded', () => {
    orderList(); 

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
                divOrder.classList.add('order');
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
});