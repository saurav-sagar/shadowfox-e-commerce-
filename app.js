const products = [
  {
    id: 1,
    name: "Nova Casual T-shirt",
    category: "Clothing",
    brand: "Nova",
    price: 799,
    rating: 4.3,
    inStock: true,
    createdAt: "2025-10-01",
    image: "./assests/tshirt.jpeg"
  },
  {
    id: 2,
    name: "ZenWear Running Shoes",
    category: "Clothing",
    brand: "ZenWear",
    price: 2499,
    rating: 4.7,
    inStock: true,
    createdAt: "2025-09-15",
    image: "./assests/shoes.jpeg"
  },
  {
    id: 3,
    name: "UrbanX Wireless Earbuds",
    category: "Electronics",
    brand: "UrbanX",
    price: 1999,
    rating: 4.2,
    inStock: false,
    createdAt: "2025-08-10",
    image: "./assests/earbuds.jpeg"
  },
  {
    id: 4,
    name: "Pulse Fitness Band",
    category: "Electronics",
    brand: "Pulse",
    price: 2999,
    rating: 3.9,
    inStock: true,
    createdAt: "2025-07-05",
    image: "./assests/band.jpeg"
  },
  {
    id: 5,
    name: "Nova Hoodie",
    category: "Clothing",
    brand: "Nova",
    price: 1599,
    rating: 4.0,
    inStock: true,
    createdAt: "2025-10-10",
    image: "./assests/hoodie.jpeg"
  },
  {
    id: 6,
    name: "ZenWear Cap",
    category: "Accessories",
    brand: "ZenWear",
    price: 499,
    rating: 3.5,
    inStock: true,
    createdAt: "2025-06-02",
    image: "./assests/cap.jpeg"
  },
  {
    id: 7,
    name: "UrbanX Smartwatch",
    category: "Electronics",
    brand: "UrbanX",
    price: 4499,
    rating: 4.8,
    inStock: true,
    createdAt: "2025-11-01",
    image: "./assests/watch.jpeg"
  },
  {
    id: 8,
    name: "Pulse Gym Gloves",
    category: "Accessories",
    brand: "Pulse",
    price: 699,
    rating: 4.1,
    inStock: false,
    createdAt: "2025-05-20",
    image: "./assests/gloves.jpeg"
  }
];
let filters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 5000,
  minRating: 0,
  inStockOnly: false
};

let sortBy = "default";
let cart = [];
let currentStep = 1;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function formatRating(r) {
  return "★".repeat(Math.round(r)) + " (" + r.toFixed(1) + ")";
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

function filterProducts(list, filters) {
  return list.filter(p => {
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.minRating && p.rating < filters.minRating) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    return true;
  });
}

function sortProducts(list, sortBy) {
  const sorted = [...list];
  if (sortBy === "priceLowToHigh") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighToLow") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === "ratingHighToLow") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return sorted;
}

function updateAppliedFiltersChips() {
  const container = document.getElementById("appliedFilters");
  container.innerHTML = "";
  const chips = [];

  filters.categories.forEach(cat => {
    chips.push({ type: "category", label: "Category: " + cat, value: cat });
  });

  filters.brands.forEach(br => {
    chips.push({ type: "brand", label: "Brand: " + br, value: br });
  });

  if (filters.minPrice !== 0 || filters.maxPrice !== 5000) {
    chips.push({
      type: "price",
      label: `Price: ₹${filters.minPrice} - ₹${filters.maxPrice}`,
      value: null
    });
  }

  if (filters.minRating) {
    chips.push({
      type: "rating",
      label: `${filters.minRating}★ & above`,
      value: null
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      type: "stock",
      label: "In stock only",
      value: null
    });
  }

  chips.forEach(chip => {
    const div = document.createElement("div");
    div.className = "chip";
    div.textContent = chip.label + " ";
    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.addEventListener("click", () => {
      removeFilterChip(chip);
    });
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function removeFilterChip(chip) {
  if (chip.type === "category") {
    filters.categories = filters.categories.filter(c => c !== chip.value);
    document
      .querySelectorAll('input[name="category"]')
      .forEach(cb => (cb.checked = filters.categories.includes(cb.value)));
  } else if (chip.type === "brand") {
    filters.brands = filters.brands.filter(b => b !== chip.value);
    document
      .querySelectorAll('input[name="brand"]')
      .forEach(cb => (cb.checked = filters.brands.includes(cb.value)));
  } else if (chip.type === "price") {
    filters.minPrice = 0;
    filters.maxPrice = 5000;
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 5000;
  } else if (chip.type === "rating") {
    filters.minRating = 0;
    document.querySelector('input[name="rating"][value="0"]').checked = true;
  } else if (chip.type === "stock") {
    filters.inStockOnly = false;
    document.getElementById("inStockOnly").checked = false;
  }
  renderProducts();
}

function renderProducts() {
  updateAppliedFiltersChips();
  let result = filterProducts(products, filters);
  result = sortProducts(result, sortBy);

  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  const countText = document.getElementById("productCountText");
  countText.textContent = `Showing ${result.length} of ${products.length} products`;

  result.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "product-image";
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    imgWrap.appendChild(img);

    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = p.name;

    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.textContent = `${p.brand} · ${p.category}`;

    const rating = document.createElement("div");
    rating.className = "rating";
    rating.textContent = formatRating(p.rating);

    const priceRow = document.createElement("div");
    priceRow.className = "price-row";
    const price = document.createElement("div");
    price.className = "price";
    price.textContent = "₹" + p.price;
    const stock = document.createElement("div");
    stock.className = "stock " + (p.inStock ? "in" : "out");
    stock.textContent = p.inStock ? "In stock" : "Out of stock";

    priceRow.appendChild(price);
    priceRow.appendChild(stock);

    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = p.inStock ? "Add to Cart" : "Out of Stock";
    btn.disabled = !p.inStock;
    btn.addEventListener("click", () => addToCart(p.id));

    card.appendChild(imgWrap);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(rating);
    card.appendChild(priceRow);
    card.appendChild(btn);

    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }
  showToast("Added to cart");
  renderCart();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.productId !== productId);
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let subtotal = 0;
  let totalItems = 0;

  cart.forEach(item => {
    const p = getProductById(item.productId);
    const line = p.price * item.qty;
    subtotal += line;
    totalItems += item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const left = document.createElement("div");
    const title = document.createElement("span");
    title.className = "cart-item-title";
    title.textContent = p.name;
    const price = document.createElement("span");
    price.textContent = `₹${p.price} × ${item.qty}`;
    left.appendChild(title);
    left.appendChild(price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    const btnMinus = document.createElement("button");
    btnMinus.textContent = "−";
    btnMinus.addEventListener("click", () => updateCartQty(p.id, -1));
    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.addEventListener("click", () => updateCartQty(p.id, 1));

    controls.appendChild(btnMinus);
    controls.appendChild(btnPlus);

    row.appendChild(left);
    row.appendChild(controls);
    container.appendChild(row);
  });

  const shipping = cart.length ? 99 : 0;
  const total = subtotal + shipping;

  document.getElementById("cartSubtotal").textContent = subtotal;
  document.getElementById("shipping").textContent = shipping;
  document.getElementById("cartTotal").textContent = total;
  document.getElementById("cartTotalHeader").textContent = total;
  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("cartBadge").textContent = cart.length ? "Active" : "Empty";
  document.getElementById("checkoutBtn").disabled = cart.length === 0;
}

function updateStepUI() {
  document.querySelectorAll(".checkout-step").forEach(stepEl => {
    stepEl.classList.remove("active");
  });
  document.getElementById("step" + currentStep).classList.add("active");

  document.querySelectorAll(".step").forEach(stepEl => {
    const stepNum = parseInt(stepEl.getAttribute("data-step"), 10);
    stepEl.classList.remove("active", "completed");
    if (stepNum < currentStep) {
      stepEl.classList.add("completed");
    } else if (stepNum === currentStep) {
      stepEl.classList.add("active");
    }
  });
}

function scrollToCheckout() {
  document.getElementById("checkoutSection").scrollIntoView({ behavior: "smooth" });
}

function validateStep1() {
  let ok = true;
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const address = document.getElementById("addressLine").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  function setError(id, msg) {
    document.getElementById(id).textContent = msg || "";
  }

  setError("errName");
  setError("errPhone");
  setError("errEmail");
  setError("errPincode");
  setError("errAddress");
  setError("errCity");
  setError("errState");

  if (!name) {
    setError("errName", "Name is required");
    ok = false;
  }

  if (!/^\d{10}$/.test(phone)) {
    setError("errPhone", "Enter a valid 10-digit phone");
    ok = false;
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    setError("errEmail", "Invalid email format");
    ok = false;
  }

  if (!/^\d{6}$/.test(pincode)) {
    setError("errPincode", "Pincode must be 6 digits");
    ok = false;
  }

  if (!address) {
    setError("errAddress", "Address is required");
    ok = false;
  }

  if (!city) {
    setError("errCity", "City is required");
    ok = false;
  }

  if (!state) {
    setError("errState", "State is required");
    ok = false;
  }

  return ok;
}

function buildDeliverySummary() {
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const address = document.getElementById("addressLine").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  let s = `${name}, ${phone}<br>${address}, ${city}, ${state} - ${pincode}`;
  if (email) {
    s += `<br>Email: ${email}`;
  }
  document.getElementById("deliverySummary").innerHTML = s;
}

function buildOrderSummaryTable() {
  const table = document.getElementById("orderSummaryTable");
  table.innerHTML = "";

  const headerRow = document.createElement("tr");
  ["Item", "Qty", "Price"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  let subtotal = 0;
  cart.forEach(item => {
    const p = getProductById(item.productId);
    const row = document.createElement("tr");
    const nameTd = document.createElement("td");
    const qtyTd = document.createElement("td");
    const priceTd = document.createElement("td");

    nameTd.textContent = p.name;
    qtyTd.textContent = item.qty;
    const line = p.price * item.qty;
    priceTd.textContent = "₹" + line;
    subtotal += line;

    row.appendChild(nameTd);
    row.appendChild(qtyTd);
    row.appendChild(priceTd);
    table.appendChild(row);
  });

  const shippingRow = document.createElement("tr");
  shippingRow.innerHTML = `<td>Shipping</td><td></td><td>₹99</td>`;
  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `<td><strong>Total</strong></td><td></td><td><strong>₹${subtotal + 99}</strong></td>`;

  table.appendChild(shippingRow);
  table.appendChild(totalRow);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="category"]').forEach(cb => {
    cb.addEventListener("change", () => {
      const selected = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
      ).map(i => i.value);
      filters.categories = selected;
      renderProducts();
    });
  });

  document.querySelectorAll('input[name="brand"]').forEach(cb => {
    cb.addEventListener("change", () => {
      const selected = Array.from(
        document.querySelectorAll('input[name="brand"]:checked')
      ).map(i => i.value);
      filters.brands = selected;
      renderProducts();
    });
  });

  document.getElementById("minPrice").addEventListener("input", e => {
    filters.minPrice = Number(e.target.value) || 0;
    renderProducts();
  });

  document.getElementById("maxPrice").addEventListener("input", e => {
    filters.maxPrice = Number(e.target.value) || 999999;
    renderProducts();
  });

  document.querySelectorAll('input[name="rating"]').forEach(radio => {
    radio.addEventListener("change", e => {
      filters.minRating = Number(e.target.value);
      renderProducts();
    });
  });

  document.getElementById("inStockOnly").addEventListener("change", e => {
    filters.inStockOnly = e.target.checked;
    renderProducts();
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    filters = {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      inStockOnly: false
    };

    document.querySelectorAll('input[name="category"]').forEach(cb => (cb.checked = false));
    document.querySelectorAll('input[name="brand"]').forEach(cb => (cb.checked = false));
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 5000;
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    document.getElementById("inStockOnly").checked = false;

    renderProducts();
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    sortBy = e.target.value;
    renderProducts();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Cart is empty");
      return;
    }
    currentStep = 1;
    updateStepUI();
    scrollToCheckout();
  });

  document.getElementById("toStep2").addEventListener("click", () => {
    if (validateStep1()) {
      currentStep = 2;
      updateStepUI();
    } else {
      showToast("Please fix address errors");
    }
  });

  document.getElementById("backToStep1").addEventListener("click", () => {
    currentStep = 1;
    updateStepUI();
  });

  document.getElementById("toStep3").addEventListener("click", () => {
    currentStep = 3;
    buildOrderSummaryTable();
    buildDeliverySummary();
    updateStepUI();
  });

  document.getElementById("backToStep2").addEventListener("click", () => {
    currentStep = 2;
    updateStepUI();
  });

  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    showToast("Order placed successfully!");
    cart = [];
    renderCart();
    currentStep = 1;
    updateStepUI();
  });

  document.getElementById("paymentMethod").addEventListener("change", e => {
    const method = e.target.value;
    document.getElementById("cardDetails").style.display =
      method === "card" ? "block" : "none";
    document.getElementById("upiDetails").style.display =
      method === "upi" ? "block" : "none";
  });

  renderProducts();
  renderCart();
  updateStepUI();
}); 