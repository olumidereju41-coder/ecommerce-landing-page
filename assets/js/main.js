const heroOffers = [
  { headline: "SMART WEARABLE.", intro: "Best Deal Online on smart watches", discount: "UP to 80% OFF", image: "Smartwatch image" },
  { headline: "SMARTPHONES.", intro: "Best Deal Online on smartphones", discount: "UP to 60% OFF", image: "Smartphone image" },
  { headline: "EVERYDAY DEALS.", intro: "Fresh picks for every day", discount: "UP to 50% OFF", image: "Featured product image" },
  { headline: "HOME ESSENTIALS.", intro: "Make more of your home", discount: "UP to 40% OFF", image: "Home product image" },
  { headline: "TOP ELECTRONICS.", intro: "Upgrade your everyday", discount: "UP to 70% OFF", image: "Electronics image" },
  { headline: "FRESH FINDS.", intro: "Your favourites, delivered", discount: "GREAT VALUE DAILY", image: "Grocery image" },
  { headline: "STYLE FOR LESS.", intro: "Find your next favourite", discount: "UP to 50% OFF", image: "Fashion image" },
];

const heroBanner = document.querySelector("#hero-banner");
const heroDots = [...document.querySelectorAll(".hero-dot")];
let activeOffer = 0;
const heroSlideInterval = 3000;

function showOffer(index) {
  activeOffer = (index + heroOffers.length) % heroOffers.length;
  const offer = heroOffers[activeOffer];
  heroBanner.querySelector(".hero-eyebrow").textContent = offer.intro;
  heroBanner.querySelector("h1").textContent = offer.headline;
  heroBanner.querySelector(".hero-offer").textContent = offer.discount;
  heroBanner.querySelector(".hero-art span").textContent = offer.image;
  heroBanner.querySelector(".hero-art").setAttribute("aria-label", `Placeholder for ${offer.image.toLowerCase()}`);
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
window.setInterval(() => showOffer(activeOffer + 1), heroSlideInterval);

const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
let itemCount = 0;

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    itemCount += 1;
    cartCount.textContent = String(itemCount);
    cartCount.classList.add("visible");
    cartButton.setAttribute("aria-label", `Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
    const originalLabel = button.textContent;
    button.textContent = "Added";
    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 900);
  });
});

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#site-search");
const productCards = [...document.querySelectorAll(".product-card")];
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

cartButton.addEventListener("click", () => {
  document.querySelector("#deals").scrollIntoView({ behavior: "smooth" });
});
