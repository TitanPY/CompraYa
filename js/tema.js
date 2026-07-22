(function aplicarTemaGuardado() {
    const CLAVE_TEMA = 'compraya_tema';
    try {
        if (localStorage.getItem(CLAVE_TEMA) === 'dark') {
            document.documentElement.classList.add('dark');
        }
    } catch (error) {
        console.warn('No se pudo leer el tema guardado:', error);
    }
})();

function aplicarIconoTema(esOscuro) {
    const sol = document.getElementById('iconoSol');
    const luna = document.getElementById('iconoLuna');
    if (!sol || !luna) return;

    sol.classList.toggle('opacity-0', esOscuro);
    sol.classList.toggle('rotate-90', esOscuro);
    sol.classList.toggle('scale-50', esOscuro);

    luna.classList.toggle('opacity-0', !esOscuro);
    luna.classList.toggle('rotate-90', !esOscuro);
    luna.classList.toggle('scale-50', !esOscuro);
}

function alternarTema() {
    const esOscuro = document.documentElement.classList.toggle('dark');

    try {
        localStorage.setItem('compraya_tema', esOscuro ? 'dark' : 'light');
    } catch (error) {
        console.warn('No se pudo guardar el tema:', error);
    }

    aplicarIconoTema(esOscuro);
}

document.addEventListener('DOMContentLoaded', function () {
    aplicarIconoTema(document.documentElement.classList.contains('dark'));
});
