const products = [
    {
        id: 1,
        name: "Vitamin C - 1000mg",
        price: 10,
        category: "Vitamina",
        image:"img/vitaminc-swanson.jpg", // VENDOS LINKUN E FOTOS TËNDE KËTU
        description: "Mbron sistemin imunitar dhe ju jep energji."
    },
    {
        id: 2,
        name: "Omega 3 - Fish Oil",
        price: 15,
        category: "Vitamina",
        image:"img/omega-3-swanson.jpg",
        description: "E shkëlqyeshme për shëndetin e zemrës."
    },
    {
        id: 3,
        name: "Krem për Foshnja",
        price: 8,
        category: "Nëna & Foshnja",
        image:"img/kremperfoshnje-mustela.jpg" ,
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
    const totalElement = document.getElementById("total");
    let total = 0;
    
    // Nëse shporta është bosh
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center; padding: 50px 20px;">
                <p style="color: #888; font-size: 16px;">Shporta juaj është momentalisht bosh.</p>
            </div>`;
        totalElement.innerHTML = "Totali: 0€";
        return;
    }

    // Gjenerimi i produkteve me foto dhe dizajn të ri
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
                <button onclick="removeItem(${index})" class="cart-card-remove" title="Hiqe">
                    ✕
                </button>
            </div>
        `;
    }).join('');
    
    // Këtu shtojmë Totali + Butonin e WhatsApp
    totalElement.innerHTML = `
        <div style="padding: 20px; border-top: 2px solid #eee; margin-top: 10px;">
            <h3 style="margin-bottom: 15px; font-size: 20px;">Totali: ${total}€</h3>
            <button onclick="sendToWhatsApp()" class="btn-whatsapp-order" style="width:100%; background-color:#25d366; color:white; border:none; padding:15px; border-radius:10px; font-weight:bold; cursor:pointer; font-size: 16px; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);">
                Dërgo Porosinë në WhatsApp 💬
            </button>
        </div>
    `;
}

// Funksioni që dërgon mesazhin në WhatsApp
function sendToWhatsApp() {
    if (cart.length === 0) return;

    let nr_tel = "38344123456"; // NDRYSHO KËTË: Vendos numrin tënd këtu
    let mesazhi = "🌟 *POROSI E RE NGA WEBSITE* 🌟%0A%0A";
    
    cart.forEach((item, index) => {
        mesazhi += `${index + 1}. *${item.name}* - ${item.price}€%0A`;
    });

    let totali = cart.reduce((sum, item) => sum + item.price, 0);
    mesazhi += `%0A💰 *TOTALI: ${totali}€*%0A%0AJu lutem konfirmoni porosinë!`;

    window.open(`https://wa.me/${nr_tel}?text=${mesazhi}`, '_blank');
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

function sendToWhatsApp() {
    // 1. Kontrollojmë nëse shporta është bosh
    if (cart.length === 0) {
        alert("Shporta juaj është bosh!");
        return;
    }

    // 2. Krijojmë fillimin e mesazhit
    let mesazhi = "🌟 *POROSI E RE NGA WEBSITE* 🌟%0A%0A";
    mesazhi += "Përshëndetje, dua të porosis këto produkte:%0A";
    mesazhi += "--------------------------------------%0A";

    // 3. Shtojmë produktet një nga një
    let totali = 0;
    cart.forEach((item, index) => {
        mesazhi += `${index + 1}. *${item.name}* - ${item.price}€%0A`;
        totali += item.price;
    });

    // 4. Shtojmë totalin dhe një mbyllje
    mesazhi += "--------------------------------------%0A";
    mesazhi += `💰 *TOTALI PËR PAGESË: ${totali}€*%0A%0A`;
    mesazhi += "Ju lutem më konfirmoni porosinë! 🙏";

    // 5. NUMRI YT I TELEFONIT (Vendose numrin tënd këtu)
    // Format: 38344111222 (pa +, pa 00)
    const nr_tel = "+38349406361"; 

    // 6. Hapim WhatsApp-in
    const linku = `https://wa.me/${nr_tel}?text=${mesazhi}`;
    window.open(linku, '_blank');
}