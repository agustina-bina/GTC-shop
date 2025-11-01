// State
let currentPage = 1
const itemsPerPage = 12
let filteredProducts = []
let products = []
let cart = []

// DOM Elements
let searchInput, searchInputMobile, categoryFilter, sortOrder, productsGrid, resultsCount, noResults, pagination
let cartBtn,
  cartBtnMobile,
  cartSidebar,
  cartOverlay,
  cartClose,
  cartCount,
  cartCountMobile,
  cartEmpty,
  cartItems,
  cartFooter,
  cartTotal
let accountBtn,
  accountBtnMobile,
  authSidebar,
  authOverlay,
  authClose,
  authTitle,
  loginForm,
  registerForm,
  switchToRegister,
  switchToLogin,
  loginPasswordToggle,
  registerPasswordToggle,
  registerPasswordConfirmToggle
let productDetailsSidebar, productDetailsOverlay, productDetailsClose, productDetailsContent
let helpBtn, helpSidebar, helpOverlay, helpClose, helpForm

// Initialize
function init() {
  console.log("[v0] Starting initialization...")

  products = window.productsData || []
  console.log("[v0] Products loaded:", products.length)

  if (products.length === 0) {
    console.error("[v0] ERROR: No products loaded! Check products-data.js")
    document.getElementById("productsGrid").innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e879f9;">Error: No se pudieron cargar los productos. Verifica la consola.</div>'
    return
  }

  searchInput = document.getElementById("searchInput")
  searchInputMobile = document.getElementById("searchInputMobile")
  categoryFilter = document.getElementById("categoryFilter")
  sortOrder = document.getElementById("sortOrder")
  productsGrid = document.getElementById("productsGrid")
  resultsCount = document.getElementById("resultsCount")
  noResults = document.getElementById("noResults")
  pagination = document.getElementById("pagination")

  cartBtn = document.getElementById("cartBtn")
  cartBtnMobile = document.getElementById("cartBtnMobile")
  cartSidebar = document.getElementById("cartSidebar")
  cartOverlay = document.getElementById("cartOverlay")
  cartClose = document.getElementById("cartClose")
  cartCount = document.getElementById("cartCount")
  cartCountMobile = document.getElementById("cartCountMobile")
  cartEmpty = document.getElementById("cartEmpty")
  cartItems = document.getElementById("cartItems")
  cartFooter = document.getElementById("cartFooter")
  cartTotal = document.getElementById("cartTotal")

  accountBtn = document.getElementById("accountBtn")
  accountBtnMobile = document.getElementById("accountBtnMobile")
  authSidebar = document.getElementById("authSidebar")
  authOverlay = document.getElementById("authOverlay")
  authClose = document.getElementById("authClose")
  authTitle = document.getElementById("authTitle")
  loginForm = document.getElementById("loginForm")
  registerForm = document.getElementById("registerForm")
  switchToRegister = document.getElementById("switchToRegister")
  switchToLogin = document.getElementById("switchToLogin")
  loginPasswordToggle = document.getElementById("loginPasswordToggle")
  registerPasswordToggle = document.getElementById("registerPasswordToggle")
  registerPasswordConfirmToggle = document.getElementById("registerPasswordConfirmToggle")

  productDetailsSidebar = document.getElementById("productDetailsSidebar")
  productDetailsOverlay = document.getElementById("productDetailsOverlay")
  productDetailsClose = document.getElementById("productDetailsClose")
  productDetailsContent = document.getElementById("productDetailsContent")

  helpBtn = document.getElementById("helpBtn")
  helpSidebar = document.getElementById("helpSidebar")
  helpOverlay = document.getElementById("helpOverlay")
  helpClose = document.getElementById("helpClose")
  helpForm = document.getElementById("helpForm")

  console.log("[v0] DOM elements found:", {
    searchInput: !!searchInput,
    categoryFilter: !!categoryFilter,
    productsGrid: !!productsGrid,
    cartBtn: !!cartBtn,
    accountBtn: !!accountBtn,
    productDetailsSidebar: !!productDetailsSidebar,
    helpBtn: !!helpBtn,
  })

  filteredProducts = [...products]
  loadCart()
  renderProducts()
  setupEventListeners()

  console.log("[v0] Initialization complete!")
}

// Event Listeners
function setupEventListeners() {
  searchInput.addEventListener("input", handleSearch)
  searchInputMobile.addEventListener("input", handleSearch)
  categoryFilter.addEventListener("change", handleFilter)
  sortOrder.addEventListener("change", handleSort)

  cartBtn.addEventListener("click", openCart)
  cartBtnMobile.addEventListener("click", openCart)
  cartClose.addEventListener("click", closeCart)
  cartOverlay.addEventListener("click", closeCart)

  accountBtn.addEventListener("click", openAuth)
  accountBtnMobile.addEventListener("click", openAuth)
  authClose.addEventListener("click", closeAuth)
  authOverlay.addEventListener("click", closeAuth)
  switchToRegister.addEventListener("click", showRegisterForm)
  switchToLogin.addEventListener("click", showLoginForm)
  loginPasswordToggle.addEventListener("click", () => togglePassword("loginPassword"))
  registerPasswordToggle.addEventListener("click", () => togglePassword("registerPassword"))
  registerPasswordConfirmToggle.addEventListener("click", () => togglePassword("registerPasswordConfirm"))
  loginForm.addEventListener("submit", handleLogin)
  registerForm.addEventListener("submit", handleRegister)

  productDetailsClose.addEventListener("click", closeProductDetails)
  productDetailsOverlay.addEventListener("click", closeProductDetails)

  helpBtn.addEventListener("click", openHelp)
  helpClose.addEventListener("click", closeHelp)
  helpOverlay.addEventListener("click", closeHelp)
  helpForm.addEventListener("submit", handleHelpSubmit)
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase()

  // Sync both search inputs
  if (e.target.id === "searchInput") {
    searchInputMobile.value = searchTerm
  } else {
    searchInput.value = searchTerm
  }

  currentPage = 1
  filterProducts()
}

function handleFilter() {
  currentPage = 1
  filterProducts()
}

function handleSort() {
  filterProducts()
}

// Filter Products
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase()
  const category = categoryFilter.value
  const sort = sortOrder.value

  filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    const matchesCategory = category === "all" || product.category === category
    return matchesSearch && matchesCategory
  })

  // Sort
  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  renderProducts()
}

// Render Products
function renderProducts() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Update results count
  if (filteredProducts.length === 0) {
    resultsCount.textContent = ""
    noResults.style.display = "block"
    productsGrid.style.display = "none"
    pagination.style.display = "none"
  } else {
    resultsCount.textContent = `Mostrando ${paginatedProducts.length} de ${filteredProducts.length} productos`
    noResults.style.display = "none"
    productsGrid.style.display = "grid"
    pagination.style.display = "flex"

    productsGrid.innerHTML = paginatedProducts
      .map(
        (product) => `
            <div class="product-card" onclick="openProductDetails(${product.id})" style="cursor: pointer;">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400/1a1525/c026d3?text=Producto'">
                    ${product.stock < 15 ? '<div class="product-badge">¡Últimas unidades!</div>' : ""}
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                </div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <button class="product-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Agregar</button>
                </div>
            </div>
        `,
      )
      .join("")

    // Render pagination
    renderPagination(totalPages)
  }
}

// Render Pagination
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = ""
    return
  }

  let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
            Anterior
        </button>
        <div class="pagination-numbers">
    `

  // Calculate page numbers to show
  const maxPagesToShow = 5
  let startPage, endPage

  if (totalPages <= maxPagesToShow) {
    startPage = 1
    endPage = totalPages
  } else if (currentPage <= 3) {
    startPage = 1
    endPage = maxPagesToShow
  } else if (currentPage >= totalPages - 2) {
    startPage = totalPages - maxPagesToShow + 1
    endPage = totalPages
  } else {
    startPage = currentPage - 2
    endPage = currentPage + 2
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? "active" : ""}" onclick="changePage(${i})">
                ${i}
            </button>
        `
  }

  paginationHTML += `
        </div>
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>
            Siguiente
        </button>
    `

  pagination.innerHTML = paginationHTML
}

// Change Page
function changePage(page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  if (page < 1 || page > totalPages) return

  currentPage = page
  renderProducts()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function loadCart() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartUI()
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  saveCart()
  updateCartUI()
  openCart()
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartUI()
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    saveCart()
    updateCartUI()
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Update cart count badges
  if (totalItems > 0) {
    cartCount.textContent = totalItems
    cartCount.style.display = "block"
    cartCountMobile.textContent = totalItems
    cartCountMobile.style.display = "block"
  } else {
    cartCount.style.display = "none"
    cartCountMobile.style.display = "none"
  }

  // Update cart panel
  if (cart.length === 0) {
    cartEmpty.style.display = "flex"
    cartItems.innerHTML = ""
    cartFooter.style.display = "none"
  } else {
    cartEmpty.style.display = "none"
    cartFooter.style.display = "block"
    cartTotal.textContent = `$${totalPrice.toLocaleString()}`

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80/1a1525/c026d3?text=Producto'">
            <div class="cart-item-content">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price.toLocaleString()}</div>
              <div class="cart-item-quantity">
                <button class="cart-item-qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="cart-item-qty-value">${item.quantity}</span>
                <button class="cart-item-qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `,
      )
      .join("")
  }
}

function openCart() {
  cartSidebar.classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeCart() {
  cartSidebar.classList.remove("open")
  document.body.style.overflow = ""
}

function openAuth() {
  authSidebar.classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeAuth() {
  authSidebar.classList.remove("open")
  document.body.style.overflow = ""
}

function showRegisterForm() {
  loginForm.style.display = "none"
  registerForm.style.display = "flex"
  authTitle.textContent = "Crear Cuenta"
}

function showLoginForm() {
  registerForm.style.display = "none"
  loginForm.style.display = "flex"
  authTitle.textContent = "Iniciar Sesión"
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  if (input.type === "password") {
    input.type = "text"
  } else {
    input.type = "password"
  }
}

function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Aquí iría la lógica de autenticación real
  console.log("Login:", { email, password })
  alert("Inicio de sesión exitoso!")
  closeAuth()
  loginForm.reset()
}

function handleRegister(e) {
  e.preventDefault()
  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const passwordConfirm = document.getElementById("registerPasswordConfirm").value

  if (password !== passwordConfirm) {
    alert("Las contraseñas no coinciden")
    return
  }

  // Aquí iría la lógica de registro real
  console.log("Register:", { name, email, password })
  alert("Cuenta creada exitosamente!")
  closeAuth()
  registerForm.reset()
  showLoginForm()
}

function openProductDetails(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  productDetailsContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-details-image" onerror="this.src='https://via.placeholder.com/600x600/1a1525/c026d3?text=Producto'">
    <div class="product-details-info">
      <span class="product-details-category">${product.category}</span>
      <h2 class="product-details-title">${product.name}</h2>
      <p class="product-details-description">${product.description}</p>
      
      <div class="product-details-meta">
        <div class="product-details-meta-item">
          <span class="product-details-meta-label">SKU:</span>
          <span class="product-details-meta-value">${product.sku}</span>
        </div>
        <div class="product-details-meta-item">
          <span class="product-details-meta-label">Categoría:</span>
          <span class="product-details-meta-value">${product.category}</span>
        </div>
        <div class="product-details-meta-item">
          <span class="product-details-meta-label">Stock disponible:</span>
          <span class="product-details-meta-value">${product.stock} unidades</span>
        </div>
      </div>

      <div class="product-details-price">$${product.price.toLocaleString()}</div>
      
      <div class="product-details-stock ${product.stock < 15 ? "low" : ""}">
        <span class="product-details-stock-indicator"></span>
        <span>${product.stock < 15 ? "¡Últimas unidades disponibles!" : "En stock"}</span>
      </div>

      <button class="product-details-add-btn" onclick="addToCart(${product.id}); closeProductDetails();">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Agregar al carrito
      </button>
    </div>
  `

  productDetailsSidebar.classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeProductDetails() {
  productDetailsSidebar.classList.remove("open")
  document.body.style.overflow = ""
}

function openHelp() {
  helpSidebar.classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeHelp() {
  helpSidebar.classList.remove("open")
  document.body.style.overflow = ""
}

function handleHelpSubmit(e) {
  e.preventDefault()
  const firstName = document.getElementById("helpFirstName").value
  const lastName = document.getElementById("helpLastName").value
  const email = document.getElementById("helpEmail").value
  const message = document.getElementById("helpMessage").value

  // Aquí iría la lógica para enviar la consulta al servidor
  console.log("Help request:", { firstName, lastName, email, message })
  alert("¡Gracias por tu consulta! Te responderemos a la brevedad.")
  closeHelp()
  helpForm.reset()
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", init)
