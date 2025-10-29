// Perfume data
const ladiesPerfumes = [
    'WHITE DIAMONDS', 'DUNE', 'DKNY GREEN', 'JP GAULTIER', 'DIOR POISON',
    'DKNY BLOSSOM', 'D & G ONE GOLD', 'SCANDAL', 'J\'ADORE', 'WHITE LINEN',
    'RUSH', 'ANGEL', 'ALIEN', 'Will', 'TOMMY GIRL', 'SPELLBOUND', 'DAISY',
    'RED DOOR', 'PLEASURES', 'BEAUTIFUL', 'INTUITION', 'AROMATICS', 'GLORIA VD BULT',
    'OPIUM', 'LADY MILLION', 'DEEP RED', 'HAVANNA', '5TH AVENUE', 'HYPRNOTIC POISON',
    'YSATIS', 'KNOWING', 'DAZLING GOLD', 'CHLOE - LOVE STORY', 'GOOD GIRL',
    'D & G LIGHT BLUE', 'CHANEL NO 5', 'RIHANNA RIRI', 'D & G ROSE THE ONE',
    'BACCARAT ROUGE 540', 'ELLIE SAAB', 'MAISON FRANCIS - GENTLE FLUIDITY'
];

const menPerfumes = [
    'INVICTUS', 'TSAR', 'HUGO BOSS', 'ARAMIS', 'JP GAULTIER',
    'ONE MILLION MAN', 'KOUROS', 'DIOR SAUVAGE', 'DIESEL'
];

// Add more perfumes to reach 50 total
const additionalPerfumes = [
    'COCO MADEMOISELLE', 'BLACK OPIUM', 'SHALIMAR', 'CHANCE', 'LA VIE EST BELLE',
    'JOY', 'MON GUERLAIN', 'MY WAY', 'LIBRE', 'NUIT NOIR'
];

additionalPerfumes.forEach(perfume => ladiesPerfumes.push(perfume));

// State
let cart = [];
let currentUser = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadPerfumes();
    updateCartUI();
    checkLoginStatus();
});

function loadPerfumes() {
    const ladiesContainer = document.getElementById('ladies-perfumes');
    const menContainer = document.getElementById('men-perfumes');

    ladiesPerfumes.forEach(perfume => {
        const card = createPerfumeCard(perfume, 'ladies');
        ladiesContainer.appendChild(card);
    });

    menPerfumes.forEach(perfume => {
        const card = createPerfumeCard(perfume, 'men');
        menContainer.appendChild(card);
    });
}

function createPerfumeCard(name, category) {
    const card = document.createElement('div');
    card.className = `perfume-card ${category === 'ladies' ? 'ladies-perfume' : 'men-perfume'} fade-in`;
    
    card.innerHTML = `
        <div class="perfume-image">
            ${category === 'ladies' ? '💜' : '❤️'}
        </div>
        <h3 class="perfume-name">${name}</h3>
        <p class="perfume-size">50ml</p>
        <p class="perfume-price">R200</p>
        <button class="add-to-cart" onclick="addToCart('${name}', ${category === 'ladies' ? 200 : 200}, '${category}')">
            Add to Cart
        </button>
    `;
    
    return card;
}

function login() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (email && validateEmail(email)) {
        currentUser = email;
        localStorage.setItem('userEmail', email);
        updateAuthUI();
        emailInput.value = '';
        showNotification('Successfully logged in!');
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
}

function modalLogin() {
    const emailInput = document.getElementById('modal-email-input');
    const email = emailInput.value.trim();
    
    if (email && validateEmail(email)) {
        currentUser = email;
        localStorage.setItem('userEmail', email);
        updateAuthUI();
        closeLoginModal();
        checkout();
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('userEmail');
    updateAuthUI();
    showNotification('You have been logged out');
}

function checkLoginStatus() {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        currentUser = savedEmail;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const userInfo = document.getElementById('user-info');
    const loginPrompt = document.getElementById('login-prompt');
    const userEmail = document.getElementById('user-email');
    
    if (currentUser) {
        userInfo.classList.remove('hidden');
        loginPrompt.classList.add('hidden');
        userEmail.textContent = currentUser;
    } else {
        userInfo.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
    }
}

function addToCart(name, price, category) {
    cart.push({ name, price, category });
    updateCartUI();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = 'R0';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name} (${item.category})</span>
                <div>
                    <span>R${item.price}</span>
                    <button onclick="removeFromCart(${index})" style="margin-left: 10px; color: red; background: none; border: none; cursor: pointer;">✖</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `R${total}`;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('hidden');
}

function checkout() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Create order details
    const orderDetails = cart.map(item => `${item.name} - R${item.price}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Create email content
    const subject = `New Order from ${currentUser}`;
    const body = `Customer Email: ${currentUser}\n\nOrder Details:\n${orderDetails}\n\nTotal: R${total}\n\nOrder Date: ${new Date().toLocaleString()}`;
    
    // Send email (using mailto as fallback)
    const mailtoLink = `mailto:Willeblixem.orders@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // Clear cart after checkout
    setTimeout(() => {
        cart = [];
        updateCartUI();
        toggleCart();
        showNotification('Order placed successfully! Check your email to send the order.');
    }, 1000);
}

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('hidden');
    toggleCart();
}

function handleContactForm(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const email = event.target[1].value;
    const message = event.target[2].value;
    
    const subject = `Contact Form Message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    window.location.href = `mailto:Willeblixem@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    event.target.reset();
    showNotification('Message sent successfully!');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'error' ? '#E74C3C' : 'var(--bg-gradient)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);