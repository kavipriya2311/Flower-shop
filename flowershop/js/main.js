/* ==========================================================================
   FIORE FLOWER SHOP - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Blur Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Tab Switcher Data (Flowers vs Plants)
  const productsData = {
    flowers: [
      {
        id: 1,
        name: 'In Bloom',
        price: 'From $63.00',
        numericPrice: 63.00,
        badge: 'Best Seller',
        image: 'images/flower_in_bloom.png'
      },
      {
        id: 2,
        name: 'Burnished Blossom',
        price: 'From $63.00',
        numericPrice: 63.00,
        badge: 'New',
        image: 'images/flower_burnished_blossom.png'
      },
      {
        id: 3,
        name: 'Vintage Fleur',
        price: 'From $46.00',
        numericPrice: 46.00,
        badge: '',
        image: 'images/flower_vintage_fleur.png'
      },
      {
        id: 4,
        name: 'Walk in the Sky',
        price: '$77.00',
        numericPrice: 77.00,
        badge: 'Limited',
        image: 'images/flower_walk_in_sky.png'
      },
      {
        id: 5,
        name: 'Velvet Rose Bouquet',
        price: '$55.00',
        numericPrice: 55.00,
        badge: 'Popular',
        image: 'images/rose.jpg'
      },
      {
        id: 6,
        name: 'Spring Tulip Symphony',
        price: '$48.00',
        numericPrice: 48.00,
        badge: '',
        image: 'images/tulip.jpg'
      }
    ],
    plants: [
      {
        id: 7,
        name: 'Fiddle Leaf Fig',
        price: '$58.00',
        numericPrice: 58.00,
        badge: 'Indoor Essential',
        image: 'images/plant_fiddle_leaf.png'
      },
      {
        id: 8,
        name: 'Royal Phalaenopsis Orchid',
        price: '$72.00',
        numericPrice: 72.00,
        badge: 'Luxury',
        image: 'images/orchid.jpg'
      },
      {
        id: 9,
        name: 'Provence Lavender Bunch',
        price: '$39.00',
        numericPrice: 39.00,
        badge: 'Aromatic',
        image: 'images/lavender.jpg'
      },
      {
        id: 10,
        name: 'Monstera Deliciosa',
        price: '$45.00',
        numericPrice: 45.00,
        badge: 'Easy Care',
        image: 'images/flower_in_bloom.png'
      }
    ]
  };

  const carouselTrack = document.getElementById('carouselTrack');
  const tabBtns = document.querySelectorAll('.tab-btn');

  function renderProducts(category) {
    if (!carouselTrack) return;
    const items = productsData[category] || productsData.flowers;
    
    carouselTrack.innerHTML = items.map(item => `
      <div class="product-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.numericPrice}" data-img="${item.image}">
        <div class="product-img-wrapper">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
          <button class="quick-add-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.numericPrice}, '${item.image}')">
            Add to Cart
          </button>
        </div>
        <h3 class="product-title">${item.name}</h3>
        <p class="product-price">${item.price}</p>
      </div>
    `).join('');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-tab');
      renderProducts(category);
    });
  });

  // Initial render
  renderProducts('flowers');

  // 3. Carousel Navigation Slider (Left / Right Controls)
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn && nextBtn && carouselTrack) {
    let scrollAmount = 0;
    const cardWidth = 300; // width + gap

    nextBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
    });
  }

  // 4. Shopping Cart Drawer Logic
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCountBadge = document.getElementById('cartCount');
  const cartTotalAmount = document.getElementById('cartTotal');

  let cart = [];

  function toggleCart() {
    if (cartDrawerOverlay) {
      cartDrawerOverlay.classList.toggle('active');
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) toggleCart();
    });
  }

  window.addToCart = function(id, name, price, img) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, img, quantity: 1 });
    }
    updateCartUI();
    toggleCart();
  };

  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  };

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCountBadge) cartCountBadge.textContent = totalCount;
    if (cartTotalAmount) cartTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); margin-top: 40px;">Your cart is currently empty.</p>';
      } else {
        cartItemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item">
            <img src="${item.img}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="color: var(--color-text-light); font-size: 1.1rem;">&times;</button>
          </div>
        `).join('');
      }
    }
  }

  // 5. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }
});
