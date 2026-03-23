const products = [
    {
        id: 1,
        name: "Vitamin C - 1000mg",
        price: 10,
        category: "Vitamina",
        image: "img/vitaminc-swanson.jpg", // VENDOS LINKUN E FOTOS TËNDE KËTU
        description: "Mbron sistemin imunitar dhe ju jep energji."
    },
    {
        id: 2,
        name: "Omega 3 - Fish Oil",
        price: 15,
        category: "Vitamina",
        image: "omega-3-swanson.jpg" ,
        description: "E shkëlqyeshme për shëndetin e zemrës."
    },
    {
        id: 3,
        name: "Krem për Foshnja",
        price: 8,
        category: "Nëna & Foshnja",
        image: "kremperfoshnje-mustela.jpg",
        description: "Hidratim i butë për lëkurën e foshnjës."
    }
];

const container = document.getElementById("products-container");

function displayProducts(items) {
    container.innerHTML = items.map(p => `
        <div class="product">
            <img src="${p.image}" alt="${p.name}">
            <h4>${p.name}</h4>
            <p><strong>${p.price}€</strong></p>
            <button class="btn-add" onclick="addToCart(${p.id})">Shto në shportë</button>
            <button class="btn-view" onclick="viewProduct(${p.id})">Detajet</button>
        </div>
    `).join('');
}

// Fillimi
displayProducts(products);

// Shporta
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("cart-count").innerText = cart.length;
}

function viewProduct(id) {
    const product = products.find(p => p.id === id);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
}

// Search
document.getElementById("search").addEventListener("input", (e) => {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    displayProducts(filtered);
});

// Modal Control
function openCart() {
    document.getElementById("cart-modal").style.display = "block";
    renderCart();
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            ${item.name} <span>${item.price}€ <button onclick="removeItem(${index})">❌</button></span>
        </div>`;
    }).join('');
    document.getElementById("total").innerText = `Totali: ${total}€`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
    renderCart();
}

function filterCategory(cat) {
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    displayProducts(filtered);
}



window.onclick = function(event) {
    const modal = document.getElementById("cart-modal");
    
    // Nëse përdoruesi klikon saktësisht mbi 'modal' (prapavija e hirtë)
    // dhe jo mbi 'modal-content' (kutia e bardhë), atëherë mbyllet.
    if (event.target == modal) {
        closeCart();
    }
}