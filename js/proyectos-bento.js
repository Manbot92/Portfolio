/* ============================================================
   PROYECTOS — BENTO GRID (ux-ui.html)

   Todo el JS de la galería de proyectos vive acá, separado de
   main.js a propósito: es un componente independiente (bento grid +
   modal), así que se puede editar o quitar sin tocar el resto del
   sitio.

   Usa PROJECTS (definido en js/projects.js) para las capturas de
   cada carpeta, así no se duplica esa lista.
   ============================================================ */

(function () {
  'use strict';

  var tieneMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     CICLO DE CAPTURAS AL PASAR EL MOUSE
     Cada tarjeta ya tiene UNA imagen (la portada). Al pasar el mouse,
     se van agregando el resto de las imágenes del proyecto (como
     <img> nuevas, superpuestas) y alternando cuál está "activa" cada
     tanto, con un crossfade suave (ver ".bento-img" en el CSS). Al
     salir, vuelve a la portada.
     ------------------------------------------------------------ */
  document.querySelectorAll('.bento-item').forEach(function (item) {
    var clave = item.dataset.proyecto;
    var datos = (typeof PROJECTS !== 'undefined') && PROJECTS[clave];
    var fondo = item.querySelector('.bento-item-fondo');
    var imgInicial = item.querySelector('.bento-img');
    if (!datos || !fondo || !imgInicial) return;

    var imagenes = null; // se arman recién la primera vez que hace falta
    var indice = 0;
    var intervalo = null;

    function armarImagenes() {
      if (imagenes) return;
      imagenes = [imgInicial];
      datos.images.slice(1).forEach(function (foto) {
        var img = document.createElement('img');
        img.className = 'bento-img';
        img.alt = '';
        img.loading = 'lazy';
        img.src = datos.folder + foto.file;
        fondo.appendChild(img);
        imagenes.push(img);
      });
    }

    function mostrar(i) {
      imagenes.forEach(function (img, n) {
        img.classList.toggle('bento-img-activa', n === i);
      });
    }

    if (!tieneMouse || reducido) return; // en celular no hay hover: se queda con la portada

    item.addEventListener('pointerenter', function () {
      armarImagenes();
      if (imagenes.length < 2) return;
      indice = 0;
      intervalo = setInterval(function () {
        indice = (indice + 1) % imagenes.length;
        mostrar(indice);
      }, 1100);
    });

    item.addEventListener('pointerleave', function () {
      clearInterval(intervalo);
      indice = 0;
      if (imagenes) mostrar(0);
    });
  });

  /* ------------------------------------------------------------
     MODAL — galería completa + texto del proyecto
     ------------------------------------------------------------ */
  var modal = document.getElementById('bento-modal');
  if (!modal) return;

  var elImagen = document.getElementById('bento-modal-imagen');
  var elContador = document.getElementById('bento-modal-contador');
  var elCaption = document.getElementById('bento-modal-caption');
  var elCategoria = document.getElementById('bento-modal-categoria');
  var elAnio = document.getElementById('bento-modal-anio');
  var elTitulo = document.getElementById('bento-modal-titulo');
  var elSubtitulo = document.getElementById('bento-modal-subtitulo');
  var elDescripcion = document.getElementById('bento-modal-descripcion');

  var galeriaActual = null;
  var carpetaActual = '';
  var indiceModal = 0;
  var disparador = null; // qué elemento abrió el modal, para devolverle el foco al cerrar

  function actualizarImagenModal() {
    var foto = galeriaActual[indiceModal];
    elImagen.src = carpetaActual + foto.file;
    elImagen.alt = foto.caption || '';
    elContador.textContent = (indiceModal + 1) + ' / ' + galeriaActual.length;
    if (elCaption) elCaption.textContent = foto.caption || '';
  }

  function abrirModal(item) {
    var clave = item.dataset.proyecto;
    var datos = (typeof PROJECTS !== 'undefined') && PROJECTS[clave];
    if (!datos) return;

    disparador = item;
    galeriaActual = datos.images;
    carpetaActual = datos.folder;
    indiceModal = 0;

    // Si el elemento tiene los dos idiomas como spans (lang="en"/"es"),
    // toma solo el del idioma actual; si no (como el título, que va
    // suelto), usa el texto tal cual. Sin esto, .textContent trae los
    // DOS idiomas pegados (el CSS los separa, pero el texto plano no).
    var idioma = document.documentElement.getAttribute('data-idioma') || 'en';
    function textoIdioma(el) {
      if (!el) return '';
      var span = el.querySelector('[lang="' + idioma + '"]');
      return (span || el).textContent.trim();
    }

    elCategoria.textContent = textoIdioma(item.querySelector('.bento-item-categoria'));
    elAnio.textContent = textoIdioma(item.querySelector('.bento-badge-anio'));
    elTitulo.textContent = textoIdioma(item.querySelector('.bento-item-titulo'));
    elSubtitulo.textContent = textoIdioma(item.querySelector('.bento-item-subtitulo'));
    elDescripcion.textContent = textoIdioma(item.querySelector('.bento-item-desc-completa'));

    actualizarImagenModal();

    modal.hidden = false;
    // El "hidden" y la clase van en dos pasos: si se agregan juntos,
    // el navegador no alcanza a animar la transición de opacity/scale.
    requestAnimationFrame(function () { modal.classList.add('is-abierto'); });
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('is-abierto');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, reducido ? 0 : 300);
    if (disparador) disparador.focus();
  }

  function siguiente() {
    indiceModal = (indiceModal + 1) % galeriaActual.length;
    actualizarImagenModal();
  }
  function anterior() {
    indiceModal = (indiceModal - 1 + galeriaActual.length) % galeriaActual.length;
    actualizarImagenModal();
  }

  // [data-proyecto] en vez de .bento-item: así también funciona en el
  // carrusel "Proyectos recientes" del home (index.html), que reutiliza
  // este mismo modal en vez de llevar a la página de la categoría.
  document.querySelectorAll('[data-proyecto]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault(); // por si el elemento es un <a> con href de respaldo
      abrirModal(item);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirModal(item);
      }
    });
  });

  modal.querySelectorAll('[data-cerrar-modal]').forEach(function (el) {
    el.addEventListener('click', cerrarModal);
  });
  modal.querySelector('[data-modal-next]').addEventListener('click', siguiente);
  modal.querySelector('[data-modal-prev]').addEventListener('click', anterior);

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'ArrowRight') siguiente();
    if (e.key === 'ArrowLeft') anterior();
  });
})();
