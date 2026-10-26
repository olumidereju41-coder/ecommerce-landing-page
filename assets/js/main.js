const heroOffers = [
  { headline: "SMART WEARABLE.", intro: "Best Deal Online on smart watches", discount: "UP to 80% OFF", image: "images/smart-watch-hero.webp.png", alt: "Smartwatch" },
  { headline: "SMARTPHONES.", intro: "Best Deal Online on smartphones", discount: "UP to 60% OFF", image: "images/galaxy-s22-ultra.webp.png", alt: "Galaxy smartphone" },
  { headline: "EVERYDAY DEALS.", intro: "Fresh picks for every day", discount: "UP to 50% OFF", image: "images/daily%20essentials.png", alt: "Daily essentials" },
  { headline: "HOME ESSENTIALS.", intro: "Make more of your home", discount: "UP to 40% OFF", image: "images/furniture.png", alt: "Home furniture" },
  { headline: "TOP ELECTRONICS.", intro: "Upgrade your everyday", discount: "UP to 70% OFF", image: "images/electronics.png", alt: "Electronics" },
  { headline: "FRESH FINDS.", intro: "Your favourites, delivered", discount: "GREAT VALUE DAILY", image: "images/fruits.png", alt: "Fresh fruit" },
  { headline: "STYLE FOR LESS.", intro: "Find your next favourite", discount: "UP to 50% OFF", image: "images/accessories.png", alt: "Accessories" },
];

const heroBanner = document.querySelector("#hero-banner");
const heroDots = [...document.querySelectorAll(".hero-dot")];
let activeOffer = 0;

function showOffer(index) {
  activeOffer = (index + heroOffers.length) % heroOffers.length;
  const offer = heroOffers[activeOffer];
  heroBanner.querySelector(".hero-eyebrow").textContent = offer.intro;
  heroBanner.querySelector("h1").textContent = offer.headline;
  heroBanner.querySelector(".hero-offer").textContent = offer.discount;
  const image = heroBanner.querySelector(".hero-art img");
  image.src = offer.image;
  image.alt = offer.alt;
  heroDots.forEach((dot, dotIndex) => {
    const selected = dotIndex === activeOffer;
    dot.classList.toggle("selected", selected);
    if (selected) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

heroBanner.querySelector(".previous").addEventListener("click", () => showOffer(activeOffer - 1));
heroBanner.querySelector(".next").addEventListener("click", () => showOffer(activeOffer + 1));
heroDots.forEach((dot, index) => dot.addEventListener("click", () => showOffer(index)));
window.setInterval(() => showOffer(activeOffer + 1), 5000);

const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const cartPage = document.querySelector("#cart-page");
const cartItemsContainer = document.querySelector(".cart-items");
const drawerItemsContainer = document.querySelector(".drawer-items");
const cartPageCount = document.querySelector(".cart-page-count");
const cartEmpty = document.querySelector(".cart-empty");
const cartStorageKey = "megamart-cart";
const productCards = [...document.querySelectorAll(".product-card")];
const products = new Map(productCards.map((card) => [
  card.dataset.id,
  {
    id: card.dataset.id,
    name: card.dataset.product,
    price: Number(card.dataset.price),
    image: card.dataset.image,
  },
]));
const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
const cart = new Map();

if (Array.isArray(storedCart)) {
  storedCart.forEach((entry) => {
    const product = products.get(entry.id);
    if (product && Number.isInteger(entry.quantity) && entry.quantity > 0) {
      cart.set(product.id, { ...product, quantity: entry.quantity });
    }
  });
}

const money = (amount) => `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
const cartQuantity = () => [...cart.values()].reduce((total, item) => total + item.quantity, 0);
const cartSubtotal = () => [...cart.values()].reduce((total, item) => total + item.price * item.quantity, 0);

function persistCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify([...cart.values()].map(({ id, quantity }) => ({ id, quantity }))));
}

function makeCartRow(item, compact = false) {
  const row = document.createElement("article");
  row.className = compact ? "cart-item drawer-item" : "cart-item";

  const image = document.createElement("img");
  image.className = "cart-item-image";
  image.src = item.image;
  image.alt = item.name;

  const details = document.createElement("div");
  details.className = "cart-item-details";
  const name = document.createElement("h3");
  name.textContent = item.name;
  const price = document.createElement("p");
  price.className = "cart-item-price";
  price.textContent = money(item.price);
  details.append(name, price);

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";
  const quantityLabel = document.createElement("span");
  quantityLabel.className = "sr-only";
  quantityLabel.textContent = `Quantity for ${item.name}`;
  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.className = "quantity-button";
  decrease.textContent = "−";
  decrease.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
  decrease.addEventListener("click", () => changeQuantity(item.id, -1));
  const quantity = document.createElement("span");
  quantity.className = "quantity-value";
  quantity.textContent = String(item.quantity);
  const increase = document.createElement("button");
  increase.type = "button";
  increase.className = "quantity-button";
  increase.textContent = "+";
  increase.setAttribute("aria-label", `Increase quantity of ${item.name}`);
  increase.addEventListener("click", () => changeQuantity(item.id, 1));
  controls.append(quantityLabel, decrease, quantity, increase);

  const lineTotal = document.createElement("strong");
  lineTotal.className = "cart-item-total";
  lineTotal.textContent = money(item.price * item.quantity);
  row.append(image, details, controls, lineTotal);

  if (!compact) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
    remove.addEventListener("click", () => removeFromCart(item.id));
    row.append(remove);
  }
  return row;
}

function renderCart() {
  const items = [...cart.values()];
  const quantity = cartQuantity();
  const subtotal = cartSubtotal();

  cartCount.textContent = String(quantity);
  cartCount.classList.toggle("visible", quantity > 0);
  cartButton.setAttribute("aria-label", `Shopping cart, ${quantity} ${quantity === 1 ? "item" : "items"}`);
  cartPageCount.textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
  cartItemsContainer.replaceChildren(...items.map((item) => makeCartRow(item)));
  drawerItemsContainer.replaceChildren(...items.map((item) => makeCartRow(item, true)));
  cartEmpty.hidden = items.length > 0;
  cartItemsContainer.hidden = items.length === 0;
  document.querySelector(".subtotal-value").textContent = money(subtotal);
  document.querySelector(".total-value").textContent = money(subtotal);
  document.querySelector(".drawer-subtotal").textContent = money(subtotal);
  document.querySelector(".checkout-start").disabled = items.length === 0;
}

function changeQuantity(id, amount) {
  const item = cart.get(id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart.delete(id);
  if (!cart.size) document.querySelector("#checkout-panel").hidden = true;
  persistCart();
  renderCart();
}

function removeFromCart(id) {
  cart.delete(id);
  if (!cart.size) document.querySelector("#checkout-panel").hidden = true;
  persistCart();
  renderCart();
}

let returnFocusTarget = null;

function openBasket(trigger) {
  returnFocusTarget = trigger;
  cartOverlay.hidden = false;
  cartDrawer.querySelector(".drawer-close").focus();
}

function closeBasket() {
  cartOverlay.hidden = true;
  if (returnFocusTarget) returnFocusTarget.focus();
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const product = products.get(card.dataset.id);
    const item = cart.get(product.id);
    if (item) item.quantity += 1;
    else cart.set(product.id, { ...product, quantity: 1 });
    persistCart();
    renderCart();
    document.querySelector("#checkout-panel").hidden = true;
    document.querySelector(".checkout-message").hidden = true;
    document.querySelector(".drawer-feedback").textContent = `${product.name} is in your basket.`;
    openBasket(button);
  });
});

document.querySelector(".drawer-close").addEventListener("click", closeBasket);
document.querySelector(".drawer-continue").addEventListener("click", closeBasket);
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeBasket();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) closeBasket();
});

function showCartPage(show) {
  document.querySelector(".hero-section").hidden = show;
  document.querySelector(".storefront-content").hidden = show;
  document.querySelector(".site-footer").hidden = show;
  cartPage.hidden = !show;
  if (show) {
    closeBasket();
    cartPage.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

cartButton.addEventListener("click", () => showCartPage(true));
document.querySelector(".drawer-view-cart").addEventListener("click", () => showCartPage(true));
document.querySelectorAll(".continue-shopping").forEach((button) => {
  button.addEventListener("click", () => {
    showCartPage(false);
    document.querySelector("#deals").scrollIntoView({ behavior: "smooth" });
  });
});
document.querySelector(".checkout-start").addEventListener("click", () => {
  const checkoutPanel = document.querySelector("#checkout-panel");
  checkoutPanel.hidden = false;
  checkoutPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector(".checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.size) return;
  const customerName = new FormData(event.currentTarget).get("name");
  const message = document.querySelector(".checkout-message");
  message.textContent = `Thank you, ${customerName}. Your order has been placed!`;
  message.hidden = false;
  cart.clear();
  persistCart();
  renderCart();
});

renderCart();

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#site-search");
const emptySearchMessage = document.querySelector(".search-empty");

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  productCards.forEach((card) => {
    const matches = card.dataset.product.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  emptySearchMessage.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", filterProducts);
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
  document.querySelector("#deals").scrollIntoView({ behavior: "smooth" });
});

const menuToggle = document.querySelector(".menu-toggle");
const categoryNav = document.querySelector(".category-nav");
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  categoryNav.classList.toggle("nav-open", !isExpanded);
});
