const products = [
    {
        id: 1,
        name: "Vitamin C - 1000mg",
        price: 10,
        category: "Vitamina",
        image: "vitaminc-swanson.jpg", // Lere vetem emrin ketu
        description: "Mbron sistemin imunitar dhe ju jep energji."
    },
    {
        id: 2,
        name: "Omega 3 - Fish Oil",
        price: 15,
        category: "Vitamina",
        image: "omega-3-swanson.jpg",
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
            <img src="img/${p.image}" alt="${p.name}">
            <h4>${p.name}</h4>
            <p><strong>${p.price}€</strong></p>
            <button class="btn-add" onclick="addToCart(${p.id})">Shto në shportë</button>
            <button class="btn-view" onclick="viewProduct(${p.id})">Detajet</button>
        </div>
    `).join('');
}

displayProducts(products);

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCart(); // Per te treguar numrin sapo hapet faqja

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    const cartCount = document.getElementById("cart-count");
    if(cartCount) cartCount.innerText = cart.length;
}

function viewProduct(id) {
    const product = products.find(p => p.id === id);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
}

// Search
const searchInput = document.getElementById("search");
if(searchInput) {
    searchInput.addEventListener("input", (e) => {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        displayProducts(filtered);
    });
}

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
    const totalElement = document.getElementById("total");
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<div style="text-align:center; padding: 50px 20px;"><p style="color: #888;">Shporta është bosh.</p></div>`;
        totalElement.innerHTML = "Totali: 0€";
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-card">
                <div class="cart-card-image">
                    <img src="img/${item.image}" alt="${item.name}">
                </div>
                <div class="cart-card-details">
                    <h4>${item.name}</h4>
                    <p class="cart-card-price">${item.price}€</p>
                </div>
                <button onclick="removeItem(${index})" class="cart-card-remove">✕</button>
            </div>
        `;
    }).join('');
    
    totalElement.innerHTML = `
        <div style="padding: 20px; border-top: 2px solid #eee; margin-top: 10px;">
            <h3 style="margin-bottom: 15px;">Totali: ${total}€</h3>
            <button onclick="sendToWhatsApp()" class="btn-whatsapp-order" style="width:100%; background-color:#25d366; color:white; border:none; padding:15px; border-radius:10px; font-weight:bold; cursor:pointer;">
                Dërgo Porosinë në WhatsApp 💬
            </button>
        </div>
    `;
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

function sendToWhatsApp() {
    if (cart.length === 0) return;

    let nr_tel = "38349406361"; // Kam hequr shenjen + (WhatsApp link nuk e don +)
    let mesazhi = "🌟 *POROSI E RE* 🌟%0A%0A";
    
    cart.forEach((item, index) => {
        mesazhi += `${index + 1}. *${item.name}* - ${item.price}€%0A`;
    });

    let totali = cart.reduce((sum, item) => sum + item.price, 0);
    mesazhi += `%0A💰 *TOTALI: ${totali}€*`;

    window.open(`https://wa.me/${nr_tel}?text=${mesazhi}`, '_blank');
}

window.onclick = function(event) {
    const modal = document.getElementById("cart-modal");
    if (event.target == modal) closeCart();
}