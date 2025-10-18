// State
let currentPage = 1
const itemsPerPage = 12
let filteredProducts = []
let products = []

// DOM Elements
let searchInput, searchInputMobile, categoryFilter, sortOrder, productsGrid, resultsCount, noResults, pagination

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

  console.log("[v0] DOM elements found:", {
    searchInput: !!searchInput,
    categoryFilter: !!categoryFilter,
    productsGrid: !!productsGrid,
  })

  filteredProducts = [...products]
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

  // Filter
  filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm)
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

    // Render product cards
    productsGrid.innerHTML = paginatedProducts
      .map(
        (product) => `
            <div class="product-card">
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
                    <button class="product-btn" onclick="addToCart(${product.id})">Agregar</button>
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

// Add to Cart (placeholder function)
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  alert(`Producto agregado al carrito: ${product.name}`)
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", init)
