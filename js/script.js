function mostrarFormulario(tipo) {
    const btnIniciar = document.getElementById('btnIniciar');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const formIniciar = document.getElementById('formIniciar');
    const formRegistrar = document.getElementById('formRegistrar');
    const indicador = document.getElementById('indicador');

    if (tipo === 'iniciar') {
        btnIniciar.classList.add('activo');
        btnRegistrar.classList.remove('activo');
        formIniciar.classList.add('activo');
        formRegistrar.classList.remove('activo');
        indicador.classList.remove('derecha');
    } else {
        btnRegistrar.classList.add('activo');
        btnIniciar.classList.remove('activo');
        formRegistrar.classList.add('activo');
        formIniciar.classList.remove('activo');
        indicador.classList.add('derecha');
    }
}

function obtenerUsuarios() {
    const datos = localStorage.getItem('compraya_usuarios');
    return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('compraya_usuarios', JSON.stringify(usuarios));
}

function registrarUsuario(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('regNombre').value.trim();
    const usuario = document.getElementById('regUsuario').value.trim();
    const correo = document.getElementById('regCorreo').value.trim();
    const password = document.getElementById('regPassword').value;

    const errorEl = document.getElementById('errorRegistrar');
    const exitoEl = document.getElementById('exitoRegistrar');
    errorEl.textContent = '';
    exitoEl.textContent = '';

    const usuarios = obtenerUsuarios();

    const yaExiste = usuarios.some(u =>
        u.usuario.toLowerCase() === usuario.toLowerCase() ||
        u.correo.toLowerCase() === correo.toLowerCase()
    );

    if (yaExiste) {
        errorEl.textContent = 'Ese usuario o correo ya está registrado.';
        return;
    }

    usuarios.push({ nombre, usuario, correo, password });
    guardarUsuarios(usuarios);

    exitoEl.textContent = 'Cuenta creada. Ahora puedes iniciar sesión.';
    document.getElementById('formRegistrar').reset();

    setTimeout(() => {
        mostrarFormulario('iniciar');
        document.getElementById('loginUsuario').value = usuario;
    }, 900);
}

function iniciarSesion(evento) {
    evento.preventDefault();

    const entrada = document.getElementById('loginUsuario').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('errorIniciar');
    errorEl.textContent = '';

    const usuarios = obtenerUsuarios();

    const encontrado = usuarios.find(u =>
        (u.usuario.toLowerCase() === entrada.toLowerCase() ||
            u.correo.toLowerCase() === entrada.toLowerCase()) &&
        u.password === password
    );

    if (!encontrado) {
        errorEl.textContent = 'Usuario o contraseña incorrectos.';
        return;
    }

    localStorage.setItem('compraya_sesion', JSON.stringify({
        usuario: encontrado.usuario,
        nombre: encontrado.nombre
    }));

    window.location.href = 'paginaPrincipal.html';
}