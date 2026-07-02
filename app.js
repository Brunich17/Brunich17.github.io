const productosGrid = document.getElementById('productosGrid');
const inputBuscar = document.getElementById('buscarProducto');
const btnBuscar = document.getElementById('btnBuscar');
const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
const categoriasDiv = document.getElementById('categorias');
const contadorCarrito = document.getElementById('contadorCarrito');
const carritoPanel = document.getElementById('carritoPanel');
const fondoCarrito = document.getElementById('fondoCarrito');
const abrirCarrito = document.getElementById('abrirCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const vaciarCarrito = document.getElementById('vaciarCarrito');
const flechaIzquierda = document.getElementById('flechaIzquierda');
const flechaDerecha = document.getElementById('flechaDerecha');

let categoriaActual = 'Todos';
let carrito = JSON.parse(localStorage.getItem('carritoMarmedic')) || [];

function imagenConFallback(producto) {
  return producto.imagen;
}

function renderCategorias() {
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
  categoriasDiv.innerHTML = categorias.map(cat => `
    <button class="categoria-btn ${cat === categoriaActual ? 'activa' : ''}" onclick="filtrarCategoria('${cat}')">${cat}</button>
  `).join('');
}

function renderProductos() {
  const texto = inputBuscar.value.toLowerCase().trim();
  const filtrados = productos.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto) || producto.categoria.toLowerCase().includes(texto);
    const coincideCategoria = categoriaActual === 'Todos' || producto.categoria === categoriaActual;
    return coincideTexto && coincideCategoria;
  });

  mensajeNoEncontrado.style.display = filtrados.length === 0 ? 'block' : 'none';

  productosGrid.innerHTML = filtrados.map(producto => `
    <div class="card">
      <img src="${imagenConFallback(producto)}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/220x160?text=Producto'">
      <h3>${producto.nombre}</h3>
      <p class="categoria-texto">${producto.categoria}</p>
      <span class="precio">S/ ${producto.precio.toFixed(2)}</span>
      <p class="stock">✔ Stock Disponible</p>
      <button onclick="agregarAlCarrito(${producto.id})">🛒 Agregar al carrito</button>
    </div>
  `).join('');
}

function filtrarCategoria(categoria) {
  categoriaActual = categoria;
  renderCategorias();
  renderProductos();
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  abrirPanelCarrito();
}

function actualizarCarrito() {
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  contadorCarrito.textContent = cantidadTotal;
  totalCarrito.textContent = `Total: S/ ${total.toFixed(2)}`;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }

  listaCarrito.innerHTML = carrito.map(item => `
    <div class="item-carrito">
      <div>
        <strong>${item.nombre}</strong>
        <p>S/ ${item.precio.toFixed(2)} c/u</p>
        <div class="item-controles">
          <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
          <button class="eliminar" onclick="eliminarProducto(${item.id})">×</button>
        </div>
      </div>
      <strong>S/ ${(item.precio * item.cantidad).toFixed(2)}</strong>
    </div>
  `).join('');
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carritoMarmedic', JSON.stringify(carrito));
}

function abrirPanelCarrito() {
  carritoPanel.classList.add('activo');
  fondoCarrito.classList.add('activo');
}

function cerrarPanelCarrito() {
  carritoPanel.classList.remove('activo');
  fondoCarrito.classList.remove('activo');
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  let mensaje = 'Hola Marmedic E&G. Quisiera consultar/comprar:%0A%0A';

  carrito.forEach(item => {
    mensaje += `• ${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}%0A`;
  });

  mensaje += `%0ATotal aproximado: S/ ${total.toFixed(2)}`;
  window.open(`https://wa.me/51901109032?text=${mensaje}`, '_blank');
}

inputBuscar.addEventListener('keyup', renderProductos);
btnBuscar.addEventListener('click', renderProductos);
abrirCarrito.addEventListener('click', abrirPanelCarrito);
cerrarCarrito.addEventListener('click', cerrarPanelCarrito);
fondoCarrito.addEventListener('click', cerrarPanelCarrito);
btnWhatsApp.addEventListener('click', enviarWhatsApp);
vaciarCarrito.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
});
flechaDerecha.addEventListener('click', () => productosGrid.scrollLeft += 300);
flechaIzquierda.addEventListener('click', () => productosGrid.scrollLeft -= 300);

renderCategorias();
renderProductos();
actualizarCarrito();
