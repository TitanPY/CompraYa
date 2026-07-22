if (!localStorage.getItem('compraya_sesion')) {
    window.location.href = 'index.html';
}

const CLASES_TARJETA =
    'card group relative flex flex-col pt-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-left ' +
    'opacity-0 animate-[fadeInUp_0.6s_ease_forwards] ' +
    'transition-[transform,box-shadow,background-color,border-color] duration-300 ease-in-out ' +
    'hover:-translate-y-1.5 hover:shadow-xl';

const CLASES_INFO_PRODUCTO = 'producto-info cursor-pointer px-3.5 pt-3.5';

const CLASES_IMG_PRODUCTO =
    'w-full h-[200px] object-contain rounded-xl bg-[var(--bg-soft)] p-2.5 transition-colors duration-300';

const CLASES_TITULO_PRODUCTO =
    'font-bold text-base mt-3 text-[var(--ink)] line-clamp-2 min-h-[42px] leading-[1.3] transition-colors duration-300';

const CLASES_PRECIO_PRODUCTO =
    'mt-3 mx-3.5 font-extrabold text-lg text-[var(--green-dark)] inline-flex items-center gap-1.5 transition-colors duration-300 ' +
    "before:content-[''] before:w-[7px] before:h-[7px] before:rounded-full before:bg-[var(--orange)] before:inline-block";

const CLASES_BOTON_COMPRAR =
    'm-3.5 mt-4 text-sm font-bold bg-[var(--green)] text-white border-none py-3 rounded-lg cursor-pointer ' +
    'transition-[background-color,transform] duration-150 ease-in-out hover:bg-[var(--green-dark)] active:scale-[0.97] ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--orange)] focus-visible:outline-offset-[3px]';

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#contenedorProductos .card").forEach((tarjeta, indice) => {
        tarjeta.dataset.ordenOriginal = indice;
        tarjeta.style.animationDelay = `${indice * 60}ms`;
    });
});

function filtrarPorPrecio() {

    const orden = document.getElementById("ordenPrecio").value;
    const contenedor = document.getElementById("contenedorProductos");
    const tarjetas = Array.from(contenedor.querySelectorAll(".card"));

    if (orden === "asc") {
        tarjetas.sort((a, b) => parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio));
    } else if (orden === "desc") {
        tarjetas.sort((a, b) => parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio));
    } else {
        tarjetas.sort((a, b) => a.dataset.ordenOriginal - b.dataset.ordenOriginal);
    }

    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

function filtrarPorTexto() {

    const texto = document.getElementById("buscarProducto").value.trim().toLowerCase();
    const contenedor = document.getElementById("contenedorProductos");
    const tarjetas = contenedor.querySelectorAll(".card");

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector("h2")?.textContent.toLowerCase() || "";
        const coincide = texto === "" || titulo.includes(texto);
        tarjeta.style.display = coincide ? "" : "none";
    });
}

function recargarPagina() {
    location.reload();
}

function cerrarSesion(event) {
    event.preventDefault();
    localStorage.removeItem('compraya_sesion');
    window.location.href = 'index.html';
}

let carrito = [];

function comprar(nombre, precio, imagen) {

    const cantidadTexto = prompt(`¿Cuántas unidades de "${nombre}" deseas agregar?`, "1");

    if (cantidadTexto === null) {
        return;
    }

    const cantidad = parseInt(cantidadTexto);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad });
    }

    actualizarContador();

    alert(`¡Agregaste ${cantidad} x "${nombre}" al carrito!`);
}

function actualizarContador() {
    const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    document.getElementById("contadorCarrito").textContent = totalUnidades;
}

function abrirModal(nombre, descripcion, precio, imagen) {

    document.getElementById("modalTitulo").textContent = nombre;

    document.getElementById("modalDescripcion").innerHTML = descripcion;

    document.getElementById("modalPrecio").textContent = precio;

    const modalImg = document.getElementById("modalImg");
    modalImg.src = imagen;
    modalImg.alt = nombre;

    document.getElementById("modalProducto").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalProducto").style.display = "none";
}

function abrirCarrito(event) {

    event.preventDefault();

    const lista = document.getElementById("listaCarrito");
    const totalEl = document.getElementById("totalCarrito");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = "<p class=\"text-[var(--muted)] transition-colors duration-300\">Tu carrito está vacío.</p>";
        totalEl.textContent = "";
    } else {

        let totalGeneral = 0;

        carrito.forEach(item => {

            const subtotal = item.precio * item.cantidad;
            totalGeneral += subtotal;

            const fila = document.createElement("div");
            fila.className =
                'fila-carrito flex gap-3 items-center border border-[var(--border)] rounded-xl p-2.5 ' +
                'transition-colors duration-300';

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = item.nombre;
            img.className = 'w-16 h-16 object-contain rounded-lg bg-[var(--bg-soft)] p-1.5 shrink-0 transition-colors duration-300';

            const info = document.createElement('div');
            info.className = 'info-fila-carrito';

            const pNombre = document.createElement('p');
            pNombre.className = 'nombre-fila-carrito font-bold text-[var(--ink)] text-sm transition-colors duration-300';
            pNombre.textContent = item.nombre;

            const pCantidad = document.createElement('p');
            pCantidad.className = 'text-[13px] text-[var(--muted)] leading-snug transition-colors duration-300';
            pCantidad.textContent = `Cantidad: ${item.cantidad}`;

            const pSubtotal = document.createElement('p');
            pSubtotal.className = 'text-[13px] text-[var(--muted)] leading-snug transition-colors duration-300';
            pSubtotal.textContent = `Subtotal: S/ ${subtotal.toFixed(2)}`;

            info.append(pNombre, pCantidad, pSubtotal);
            fila.append(img, info);
            lista.appendChild(fila);
        });

        totalEl.textContent = `Total: S/ ${totalGeneral.toFixed(2)}`;
    }

    document.getElementById("modalCarrito").style.display = "flex";
}

function cerrarCarrito() {
    document.getElementById("modalCarrito").style.display = "none";
}

function abrirAgregarProducto(event) {
    event.preventDefault();
    document.getElementById("modalAgregarProducto").style.display = "flex";
}

function cerrarAgregarProducto() {
    document.getElementById("modalAgregarProducto").style.display = "none";
}

function agregarProducto(event) {

    event.preventDefault();

    const nombre = document.getElementById("nuevoNombre").value.trim();
    const descripcion = document.getElementById("nuevaDescripcion").value.trim();
    const precio = parseFloat(document.getElementById("nuevoPrecio").value);
    const imagen = document.getElementById("nuevaImagen").value.trim();

    if (!nombre || !descripcion || isNaN(precio) || precio <= 0 || !imagen) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const contenedor = document.getElementById("contenedorProductos");
    const totalActual = contenedor.querySelectorAll(".card").length;
    const precioTexto = `S/ ${precio.toFixed(2)}`;

    const nuevaCard = document.createElement("div");
    nuevaCard.className = CLASES_TARJETA;
    nuevaCard.dataset.precio = precio.toFixed(2);
    nuevaCard.dataset.ordenOriginal = totalActual;
    nuevaCard.style.animationDelay = '0ms';

    const infoProducto = document.createElement('div');
    infoProducto.className = CLASES_INFO_PRODUCTO;
    infoProducto.tabIndex = 0;
    infoProducto.addEventListener('click', () => abrirModal(nombre, descripcion, precioTexto, imagen));

    const img = document.createElement('img');
    img.src = imagen;
    img.alt = nombre;
    img.className = CLASES_IMG_PRODUCTO;

    const titulo = document.createElement('h2');
    titulo.className = CLASES_TITULO_PRODUCTO;
    titulo.textContent = nombre;

    infoProducto.append(img, titulo);

    const precioEl = document.createElement('p');
    precioEl.className = CLASES_PRECIO_PRODUCTO;
    precioEl.textContent = precioTexto;

    const boton = document.createElement('button');
    boton.className = CLASES_BOTON_COMPRAR;
    boton.textContent = 'Comprar';
    boton.addEventListener('click', () => comprar(nombre, precio, imagen));

    nuevaCard.append(infoProducto, precioEl, boton);
    contenedor.appendChild(nuevaCard);
    filtrarPorTexto();

    document.getElementById("formAgregarProducto").reset();
    cerrarAgregarProducto();

    alert(`"${nombre}" se publicó correctamente.`);
}

window.onclick = function (event) {

    const modalProducto = document.getElementById("modalProducto");
    const modalCarrito = document.getElementById("modalCarrito");
    const modalAgregarProducto = document.getElementById("modalAgregarProducto");

    if (event.target === modalProducto) {
        cerrarModal();
    }

    if (event.target === modalCarrito) {
        cerrarCarrito();
    }

    if (event.target === modalAgregarProducto) {
        cerrarAgregarProducto();
    }
}
