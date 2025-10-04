// --------------------- HEADER DESAPARECIBLE ---------------------
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 50) {
    // Scroll hacia abajo → ocultar
    header.classList.add('hide');
  } else {
    // Scroll hacia arriba → mostrar
    header.classList.remove('hide');
  }

  lastScroll = currentScroll;
});

// Cargar carrito desde localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para actualizar contador en la navbar
function actualizarContador() {
  const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById("cart-count");
  if (contador) contador.textContent = count;
}

// Función para agregar productos
function agregarAlCarrito(nombre, precioBase, boton) {
  const cantidad = parseInt(boton.parentElement.querySelector(".cantidad").value);
  const unidad = boton.parentElement.querySelector(".unidad").value;

  if (!cantidad || cantidad <= 0) {
    alert("Por favor ingresa una cantidad válida.");
    return;
  }

  let precioFinal = precioBase;

  // Ajustar precio según unidad
  if (unidad === "Libra") precioFinal = precioBase / 2;
  if (unidad === "1/2 Litro") precioFinal = precioBase / 2;

  const producto = { 
    nombre, 
    precio: precioFinal, 
    cantidad, 
    unidad 
  };

  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  alert(`${cantidad} ${unidad}(s) de ${nombre} agregado(s) al carrito`);
}

// Función para mostrar carrito en carrito.html
function mostrarCarrito() {
  const tbody = document.getElementById("carrito-body");
  if (!tbody) return; // Evitar error si no estamos en carrito.html
  tbody.innerHTML = "";

  let total = 0;

  carrito.forEach((item, index) => {
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${item.unidad}</td>
      <td>$${(item.precio * item.cantidad).toLocaleString("es-CO")}</td>
      <td><button onclick="eliminarProducto(${index})">❌</button></td>
    `;

    tbody.appendChild(fila);
    total += item.precio * item.cantidad;
  });

  const totalElemento = document.getElementById("total");
  if (totalElemento) totalElemento.textContent = total.toLocaleString("es-CO");
}

// Eliminar un producto
function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContador();
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContador();
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  mostrarCarrito();
});
