/* ============================================================
   MAIN.JS
   Marca como activo el item del menú según la sección visible.
   ============================================================ */


/* ------------------------------------------------------------
   VIDEO DE FONDO DEL HELLO — pausado si se pidió menos animación
   Quien activó "reducir movimiento" en su sistema no debería ver un
   video de fondo reproduciéndose solo. El video sigue ahí (portada
   fija, primer cuadro), solo no se mueve.
   ------------------------------------------------------------ */
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var video = document.querySelector('.hero-fondo video');
  if (video) video.pause();
})();


/* ------------------------------------------------------------
   SELECTOR DE IDIOMA

   El idioma se elige ANTES de pintar la página, en el script que está
   arriba de todo en el index.html, para que no se vea un parpadeo de
   inglés antes del español. Acá solo queda lo que pasa después:
   marcar el botón activo, cambiar de idioma al hacer clic, recordar
   la elección, traducir el título y la descripción de la página (esos
   dos no se pueden duplicar con spans), y apuntar el botón del CV al
   PDF que corresponda.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var CABECERA = {
    en: {
      titulo: 'Cristian Vélez — Product UX/UI Designer',
      descripcion: 'Portfolio of Cristian Vélez, Product UX/UI Designer. Digital interface design, design systems and user-centred experiences.'
    },
    es: {
      titulo: 'Cristian Vélez — Diseñador de producto UX/UI',
      descripcion: 'Portfolio de Cristian Vélez, diseñador de producto UX/UI. Diseño de interfaces digitales, sistemas de diseño y experiencias centradas en el usuario.'
    }
  };

  /* Un PDF por idioma. Mientras no exista el de español, el inglés hace
     de respaldo: mejor que el botón descargue "lo que hay" a que
     apunte a un archivo que no existe.

     ¿Ya subiste assets/cv/cv-cristian-velez-es.pdf? Cambiá la línea de
     "es" acá abajo para que apunte a ese archivo. */
  var CV = {
    en: { archivo: 'assets/cv/cv-cristian-velez-en.pdf', nombre: 'Cristian-Velez-CV-EN.pdf' },
    es: { archivo: 'assets/cv/cv-cristian-velez-es.pdf', nombre: 'Cristian-Velez-CV-ES.pdf' }
  };

  var raiz = document.documentElement;
  var botones = document.querySelectorAll('[data-idioma-set]');
  if (botones.length === 0) return;

  var descripcion = document.querySelector('meta[name="description"]');
  // Puede haber más de un botón de CV en la página (el del Hello y el
  // de "About me"): se actualizan todos por igual.
  var botonesCv = document.querySelectorAll('.cv-descarga');

  function aplicar(idioma) {
    if (!CABECERA[idioma]) idioma = 'en';

    raiz.setAttribute('data-idioma', idioma);
    raiz.setAttribute('lang', idioma);

    document.title = CABECERA[idioma].titulo;
    if (descripcion) descripcion.setAttribute('content', CABECERA[idioma].descripcion);

    botonesCv.forEach(function (boton) {
      boton.setAttribute('href', CV[idioma].archivo);
      // El nombre con que se guarda el archivo también cambia de idioma
      boton.setAttribute('download', CV[idioma].nombre);
    });

    botones.forEach(function (boton) {
      var suyo = boton.getAttribute('data-idioma-set') === idioma;
      boton.classList.toggle('is-active', suyo);
      // aria-pressed le dice al lector de pantalla cuál está elegido
      boton.setAttribute('aria-pressed', suyo ? 'true' : 'false');
    });

    try { localStorage.setItem('idioma', idioma); } catch (e) {}
  }

  botones.forEach(function (boton) {
    boton.addEventListener('click', function () {
      aplicar(boton.getAttribute('data-idioma-set'));
    });
  });

  // El idioma ya lo dejó puesto el script del <head>: acá se sincroniza
  // el resto (botón marcado, título, descripción).
  aplicar(raiz.getAttribute('data-idioma') || 'en');
})();


/* ------------------------------------------------------------
   FOTO DE "ABOUT ME"

   La foto va en su propia carpeta: assets/about/

   Mismo truco que la foto del hero: el navegador no puede leer una
   carpeta, así que se prueban nombres habituales hasta dar con uno.
   Como la carpeta es solo para esto, la lista es amplia: casi
   cualquier nombre razonable funciona.

   ¿Tu foto se llama distinto? Agregá el nombre a NOMBRES, sin la
   extensión. Si no aparece ninguna, queda el arco en gris que pone el
   CSS: nunca se ve una imagen rota.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var CARPETA = 'assets/about/';

  var NOMBRES = [
    'foto', 'about-me', 'about', 'sobre-mi', 'yo', 'me',
    'cristian', 'perfil', 'photo', 'portrait'
  ];
  var EXTENSIONES = ['avif', 'webp', 'jpg', 'jpeg', 'png'];

  var foto = document.querySelector('.about-imagen');
  if (!foto) return;

  /* Se arman todas las combinaciones, incluida la versión con
     mayúscula inicial: Windows no distingue mayúsculas pero el
     servidor de Netlify sí, y si no se contempla acá la foto se ve en
     tu computadora y desaparece al publicar. */
  var candidatas = [];
  NOMBRES.forEach(function (nombre) {
    var conMayuscula = nombre.charAt(0).toUpperCase() + nombre.slice(1);

    [nombre, conMayuscula].forEach(function (variante) {
      EXTENSIONES.forEach(function (ext) {
        candidatas.push(CARPETA + variante + '.' + ext);
        candidatas.push(CARPETA + variante + '.' + ext.toUpperCase());
      });
    });
  });

  var encontradas = new Array(candidatas.length);
  var pendientes = candidatas.length;

  // Se prueban todas a la vez y gana la de mayor prioridad
  candidatas.forEach(function (ruta, i) {
    var prueba = new Image();
    prueba.onload = function () { encontradas[i] = true; terminar(); };
    prueba.onerror = function () { encontradas[i] = false; terminar(); };
    prueba.src = ruta;
  });

  function terminar() {
    if (--pendientes > 0) return;

    for (var i = 0; i < candidatas.length; i++) {
      if (encontradas[i]) {
        foto.src = candidatas[i];
        foto.hidden = false;
        return;
      }
    }
    // Ninguna existe: queda el arco gris del CSS, que es lo correcto
  }
})();


/* ------------------------------------------------------------
   BARRA DE PROGRESO

   Ancha la barrita de arriba según cuánto llevás leído de la página:
   0% al tope, 100% al llegar al final. Nada más.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var barra = document.querySelector('.progreso-barra');
  if (!barra) return;

  var pendiente = false;

  function actualizar() {
    pendiente = false;

    var total = document.documentElement.scrollHeight - window.innerHeight;
    var avance = total > 0 ? (window.scrollY / total) * 100 : 0;

    barra.style.width = Math.min(100, Math.max(0, avance)).toFixed(1) + '%';
  }

  function pedir() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  // Las imágenes que cargan después cambian el alto total de la página
  window.addEventListener('load', pedir);

  actualizar();
})();


/* ------------------------------------------------------------
   SEÑAL DE SCROLL

   La rayita animada al pie del hero invita a bajar. Una vez que
   arrancaste a scrollear ya cumplió su función, así que se apaga y no
   vuelve a aparecer.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var senal = document.querySelector('.scroll-cue');
  if (!senal) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    senal.classList.add('se-oculta');
    return;
  }

  function apagar() {
    if (window.scrollY > 80) {
      senal.classList.add('se-oculta');
      window.removeEventListener('scroll', apagar);
    }
  }

  window.addEventListener('scroll', apagar, { passive: true });
})();


/* ------------------------------------------------------------
   APARICIÓN AL HACER SCROLL

   Cada elemento marcado con data-reveal aparece cuando entra en
   pantalla. Dentro de una misma sección entran escalonados, en orden
   de lectura, para que la secuencia se sienta encadenada y no como
   varias cosas moviéndose a la vez.

   Aparecen una sola vez: repetir la animación al subir y bajar es lo
   que vuelve mareante este recurso.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var elementos = document.querySelectorAll('[data-reveal]');
  if (elementos.length === 0) return;

  var ESCALON = 65;     // separación entre un elemento y el siguiente
  var TOPE = 12;        // máximo de escalones, para que el último no se haga esperar

  /* La duración NO se escribe acá: se lee de la transición que define el
     CSS. Si estuviera en los dos sitios y alguien cambiara solo uno, la
     limpieza ocurriría antes de terminar la animación y se vería un
     salto. Para cambiar la velocidad, se toca únicamente el CSS. */
  var DURACION = (function () {
    var d = parseFloat(getComputedStyle(elementos[0]).transitionDuration) * 1000;
    return d > 0 ? d : 900;
  })();

  // Si el sistema pide menos animación, se muestra todo sin más
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elementos.forEach(function (el) { el.removeAttribute('data-reveal'); });
    return;
  }

  /* El retraso se calcula dentro de cada data-reveal-group, en orden de
     documento. Un grupo es un bloque que se lee de una sola mirada: el
     hero, una card de proyecto, una columna de etiquetas.

     Antes se calculaba por sección entera, y eso fallaba en Projects: los
     elementos de la segunda card heredaban el índice de la primera y
     arrancaban con casi medio segundo de retraso, aunque entraran en
     pantalla mucho después. Cada card tiene ahora su propia cuenta. */
  document.querySelectorAll('[data-reveal-group]').forEach(function (grupo) {
    grupo.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', Math.min(i, TOPE) * ESCALON + 'ms');
    });
  });

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;

      var el = entrada.target;
      el.classList.add('is-visible');
      observador.unobserve(el);

      /* Al terminar se le quita el atributo: mientras lo tiene, su
         transición pisa la propia del elemento (por ejemplo, el hover
         de la foto se volvería lento). */
      var retraso = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
      setTimeout(function () {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
      }, DURACION + retraso + 100);
    });
  }, {
    threshold: 0,
    // Se dispara un poco antes de llegar al borde inferior, para que el
    // elemento ya esté entrando cuando el ojo lo alcanza.
    rootMargin: '0px 0px -10% 0px'
  });

  elementos.forEach(function (el) { observador.observe(el); });
})();


/* ------------------------------------------------------------
   CARRUSEL DE PROYECTOS RECIENTES (home)

   Misma técnica que el carrusel de Skills (ver más abajo), que ya
   sabemos que funciona bien: nada de scroll nativo (scrollLeft
   resultó poco confiable para animarlo a mano, cuadro a cuadro —
   distintos navegadores lo tratan distinto). Acá se mueve
   ".recientes-pista" con "transform: translateX()" directamente.

   Se mueve sola, muy despacio, en loop infinito (duplicando las
   tarjetas una vez: al llegar a la copia, salta de vuelta al
   principio sin que se note). También se puede arrastrar con el
   mouse o el dedo, con inercia al soltar.

   Como cada tarjeta es un <a> (lleva a ux-ui.html), hay que
   distinguir "click" de "arrastre": si se movió más de unos pocos
   px, el click de después se cancela, para no navegar sin querer
   apenas se termina de arrastrar.
   ------------------------------------------------------------ */
(function () {
  'use strict';

  var carrusel = document.querySelector('[data-carrusel]');
  var pista = carrusel && carrusel.querySelector('.recientes-pista');
  if (!carrusel || !pista) return;

  var PX_POR_SEGUNDO = 30;
  var UMBRAL_CLICK = 6;    // px: menos que esto todavía cuenta como "click", no arrastre
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // El observador de "APARICIÓN AL HACER SCROLL" ya está mirando los
  // <a> originales: si se duplican tal cual, los clones quedan con
  // data-reveal puesto y nadie los revela nunca (mismo bug que ya se
  // resolvió en el carrusel de Skills). Se limpia en cada clon.
  var original = Array.prototype.slice.call(pista.children);
  original.forEach(function (item) {
    item.removeAttribute('data-reveal');
    item.style.removeProperty('--reveal-delay');
  });
  original.forEach(function (item) {
    pista.appendChild(item.cloneNode(true));
  });

  // Ancho de UNA vuelta completa (la mitad del ancho total, ya que el
  // contenido está duplicado): al llegar ahí, el offset vuelve a 0
  // sin que se note, porque la copia es idéntica.
  var mitad = pista.scrollWidth / 2;
  var offset = 0; // 0 a -mitad

  var arrastrando = false;
  var seMovio = false;
  var origenX = 0;
  var offsetAlEmpezar = 0;
  var idPuntero = 0;

  // --- Inercia al soltar (mismo criterio que el carrusel de Skills:
  // velocidad del ÚLTIMO tramo, no de todo el gesto) ---
  var FRICCION = 0.94;
  var VELOCIDAD_MINIMA = 0.02;
  var velocidad = 0;
  var ultimoX = 0;
  var ultimoT = 0;
  var desacelerando = false;
  var cuadroAnterior = null;

  function envolver(x) {
    x = x % mitad;
    if (x > 0) x -= mitad;
    return x;
  }

  function cuadro(t) {
    requestAnimationFrame(cuadro);
    if (cuadroAnterior === null) cuadroAnterior = t;
    var delta = t - cuadroAnterior;
    cuadroAnterior = t;

    if (arrastrando) {
      // nada: lo mueve "pointermove"
    } else if (desacelerando) {
      offset = envolver(offset + velocidad * delta);
      velocidad *= Math.pow(FRICCION, delta / 16.67);
      if (Math.abs(velocidad) < VELOCIDAD_MINIMA) desacelerando = false;
    } else if (!reducido) {
      offset = envolver(offset - (PX_POR_SEGUNDO * delta) / 1000);
    }

    pista.style.transform = 'translateX(' + offset + 'px)';
  }
  requestAnimationFrame(cuadro);

  // Sin esto, el navegador arranca SU propio arrastre nativo al
  // hacer mousedown sobre una <img> o un <a href> (para arrastrarlo
  // a otra pestaña, al escritorio, etc.), y esa secuencia nativa le
  // gana a los eventos "pointermove" de acá abajo: el drag a mano
  // nunca llega a moverse. draggable="false" en cada <img> (ver el
  // HTML) cubre la mayoría de los casos; esto es el resguardo final.
  carrusel.addEventListener('dragstart', function (e) { e.preventDefault(); });

  carrusel.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') e.preventDefault(); // no seleccionar texto al arrastrar
    arrastrando = true;
    seMovio = false;
    desacelerando = false;
    velocidad = 0;
    origenX = e.clientX;
    offsetAlEmpezar = offset;
    ultimoX = e.clientX;
    ultimoT = e.timeStamp;
    idPuntero = e.pointerId;
    carrusel.classList.add('arrastrando');
    // OJO: la captura del puntero NO se pide acá. Si se pide apenas
    // empieza el toque, el click que sigue queda "retargeteado" al
    // carrusel entero (así nunca sea arrastre), y las tarjetas dejan
    // de recibir el clic para abrir su modal. Por eso se pide recién
    // en pointermove, una vez que de verdad hay arrastre.
  });

  carrusel.addEventListener('pointermove', function (e) {
    if (!arrastrando) return;
    var dx = e.clientX - origenX;
    if (Math.abs(dx) > UMBRAL_CLICK) {
      if (!seMovio && carrusel.setPointerCapture) {
        try { carrusel.setPointerCapture(idPuntero); } catch (err) {}
      }
      seMovio = true;
    }
    offset = envolver(offsetAlEmpezar + dx);

    var dt = e.timeStamp - ultimoT;
    if (dt > 0) {
      velocidad = (e.clientX - ultimoX) / dt;
      ultimoX = e.clientX;
      ultimoT = e.timeStamp;
    }
  });

  function soltar(e) {
    if (!arrastrando) return;
    arrastrando = false;
    carrusel.classList.remove('arrastrando');
    if (Math.abs(velocidad) > VELOCIDAD_MINIMA) desacelerando = true;
    if (e && carrusel.releasePointerCapture) {
      try { carrusel.releasePointerCapture(e.pointerId); } catch (err) {}
    }
  }
  carrusel.addEventListener('pointerup', soltar);
  carrusel.addEventListener('pointercancel', soltar);

  // Si hubo arrastre de verdad, el click que sigue no debe navegar.
  carrusel.addEventListener('click', function (e) {
    if (seMovio) {
      e.preventDefault();
      seMovio = false;
    }
  }, true);
})();


/* ------------------------------------------------------------
   CARRUSEL DE ETIQUETAS (Skills)

   La fila de habilidades tiene que ir siempre en una sola línea. Si
   las etiquetas no entran en el ancho disponible, en vez de cortarse
   se duplican una vez (para que el loop no se note) y se desplazan
   solas, muy despacio, en bucle infinito. Si SÍ entran (pantalla muy
   ancha, o pocas etiquetas), se quedan quietas, como una fila normal.

   También se puede arrastrar con el mouse (o el dedo) para moverla a
   mano: al soltar, sigue de largo sola desde donde quedó.

   Todo el movimiento (solo o a mano) lo escribe este mismo código
   cuadro a cuadro en .tag-list.style.transform — no hay @keyframes de
   CSS de por medio, así los dos modos comparten un único número
   ("offset") y nunca se pisan entre sí.

   La velocidad automática es constante (40px por segundo) sin
   importar cuántas etiquetas haya.
   ------------------------------------------------------------ */
(function () {
  'use strict';

  var PX_POR_SEGUNDO = 40;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-marquee]').forEach(function (contenedor) {
    var lista = contenedor.querySelector('.tag-list');
    if (!lista) return;

    // Por si el resize dispara esto más de una vez: no duplicar de nuevo
    // lo que ya se duplicó.
    var original = Array.prototype.slice.call(lista.children);

    // El observador de "APARICIÓN AL HACER SCROLL" (más arriba en este
    // mismo archivo) ya está mirando estos <li> originales. Si acá los
    // reemplazamos por clones sin más, el observador se queda mirando
    // nodos que ya no están en pantalla y los clones nuevos quedan con
    // data-reveal puesto, o sea invisibles PARA SIEMPRE (opacity:0 y
    // nadie que lo saque). Por eso cada clon se limpia de eso: en un
    // carrusel que se mueve solo no hace falta el efecto de aparición.
    function limpiarReveal(li) {
      li.removeAttribute('data-reveal');
      li.style.removeProperty('--reveal-delay');
      return li;
    }

    var activo = false;    // hace falta el carrusel (no entran todas)
    var mitad = 0;         // ancho de UNA copia (la lista tiene dos)
    var offset = 0;        // posición actual, en px (0 a -mitad)
    var arrastrando = false;
    var origenX = 0;
    var offsetAlArrastrar = 0;

    // --- Inercia al soltar ---
    // "velocidad" es px por milisegundo, medida sobre el último tramo
    // de arrastre (no todo el gesto: si arrastrás rápido y frenás en
    // seco antes de soltar, tiene que frenar con vos, no salir
    // disparado con la velocidad de más atrás). Al soltar, se sigue
    // moviendo solo con esa velocidad, perdiendo un poco en cada
    // cuadro (FRICCION) hasta casi pararse, y ahí retoma el auto-scroll
    // normal, sin salto.
    var FRICCION = 0.94;           // qué tan rápido frena; 1 = no frena nunca
    var VELOCIDAD_MINIMA = 0.02;   // px/ms por debajo de esto, se da por parada
    var velocidad = 0;
    var ultimoX = 0;
    var ultimoT = 0;
    var desacelerando = false;

    // El offset da vueltas entre 0 y -mitad: cuando se pasa de largo
    // para cualquier lado, reaparece del otro, como un loop real.
    function envolver(x) {
      x = x % mitad;
      if (x > 0) x -= mitad;
      return x;
    }

    function medir() {
      lista.style.transform = '';
      lista.innerHTML = '';
      original.forEach(function (li) { lista.appendChild(limpiarReveal(li.cloneNode(true))); });

      var entraCompleta = lista.scrollWidth <= contenedor.clientWidth;
      if (entraCompleta) {
        activo = false;
        contenedor.classList.remove('tag-marquee-activo');
        return;
      }

      // No entra: duplica la fila una vez (el loop se ve continuo
      // porque a mitad del recorrido hay una copia idéntica detrás).
      original.forEach(function (li) { lista.appendChild(limpiarReveal(li.cloneNode(true))); });
      mitad = lista.scrollWidth / 2;
      offset = 0;
      desacelerando = false;
      velocidad = 0;
      activo = true;
      contenedor.classList.add('tag-marquee-activo');
    }

    var cuadroAnterior = null;
    function cuadro(t) {
      requestAnimationFrame(cuadro);
      if (!activo) { cuadroAnterior = null; return; }

      if (cuadroAnterior === null) cuadroAnterior = t;
      var delta = t - cuadroAnterior;
      cuadroAnterior = t;

      // Mientras se arrastra, el offset ya lo puso "pointermove" de
      // más abajo. Al soltar, primero se frena solo (inercia) y recién
      // cuando casi para retoma el auto-scroll normal.
      if (arrastrando) {
        // nada: lo mueve "pointermove"
      } else if (desacelerando) {
        offset = envolver(offset + velocidad * delta);
        velocidad *= Math.pow(FRICCION, delta / 16.67);
        if (Math.abs(velocidad) < VELOCIDAD_MINIMA) desacelerando = false;
      } else if (!reducido) {
        offset = envolver(offset - (PX_POR_SEGUNDO * delta) / 1000);
      }

      lista.style.transform = 'translateX(' + offset + 'px)';
    }

    contenedor.addEventListener('pointerdown', function (e) {
      if (!activo) return;
      arrastrando = true;
      desacelerando = false;
      velocidad = 0;
      origenX = e.clientX;
      offsetAlArrastrar = offset;
      ultimoX = e.clientX;
      ultimoT = e.timeStamp;
      contenedor.classList.add('arrastrando');
      if (contenedor.setPointerCapture) {
        try { contenedor.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    contenedor.addEventListener('pointermove', function (e) {
      if (!arrastrando) return;
      offset = envolver(offsetAlArrastrar + (e.clientX - origenX));

      // Velocidad del último tramo nada más (no de todo el arrastre):
      // si venías rápido y frenaste la mano antes de soltar, tiene que
      // frenar con vos.
      var dt = e.timeStamp - ultimoT;
      if (dt > 0) {
        velocidad = (e.clientX - ultimoX) / dt;
        ultimoX = e.clientX;
        ultimoT = e.timeStamp;
      }
    });

    function soltar() {
      if (arrastrando && Math.abs(velocidad) > VELOCIDAD_MINIMA) desacelerando = true;
      arrastrando = false;
      contenedor.classList.remove('arrastrando');
    }
    contenedor.addEventListener('pointerup', soltar);
    contenedor.addEventListener('pointercancel', soltar);

    medir();
    requestAnimationFrame(cuadro);

    var pendiente = false;
    window.addEventListener('resize', function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () { pendiente = false; medir(); });
    });
  });
})();


/* ------------------------------------------------------------
   LOGOS DE HERRAMIENTAS

   Cada etiqueta de "Tools" busca su logo en assets/tools/ usando el
   nombre que lleva en data-tool (miro, figma, claude, adobe-suite,
   zeplin) con extensión svg, png, webp o jpg.

   Si lo encuentra, reemplaza el texto por el logo (el nombre pasa al
   "alt" de la imagen: sigue ahí para quien usa lector de pantalla,
   pero ya no se ve escrito al lado). Si no lo encuentra, la etiqueta
   se queda con el nombre escrito, que es un respaldo perfectamente
   digno: nunca se ve un hueco ni una imagen rota.

   ¿Agregas una herramienta nueva? Ponle un data-tool en el HTML y deja
   el archivo con ese mismo nombre en la carpeta.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var etiquetas = document.querySelectorAll('[data-tool]');
  if (etiquetas.length === 0) return;

  var EXTENSIONES = ['svg', 'png', 'webp', 'jpg'];

  etiquetas.forEach(function (etiqueta) {
    var nombre = etiqueta.textContent.trim();
    var i = 0;

    function intentar() {
      if (i >= EXTENSIONES.length) return;  // sin logo: se queda el texto

      var ruta = 'assets/tools/' + etiqueta.dataset.tool + '.' + EXTENSIONES[i];
      var prueba = new Image();

      prueba.onload = function () {
        var img = document.createElement('img');
        img.src = ruta;
        img.className = 'tool-logo';
        img.loading = 'lazy';
        // El nombre vive acá ahora: no se muestra texto al lado del logo.
        img.alt = nombre;

        etiqueta.textContent = '';
        etiqueta.appendChild(img);
        etiqueta.classList.add('has-logo');
      };

      prueba.onerror = function () { i++; intentar(); };
      prueba.src = ruta;
    }

    intentar();
  });
})();


/* ------------------------------------------------------------
   TÍTULO ROTATIVO DEL HERO

   La palabra dentro de "Diseñador ___" / "___ Designer" cambia sola
   cada 3 segundos: UX/UI → Visual → 3D → UX/UI...

   Es la MISMA palabra en los dos idiomas (no se traduce), así que
   actualiza TODAS las .hero-palabra-rotativa que encuentre (la de
   inglés y la de español) al mismo tiempo, sin importar cuál esté
   visible en este momento.

   El cambio de texto ocurre a la mitad de la transición (mientras
   está invisible, con la clase ".se-va" puesta), para que lo que se
   vea sea "una palabra se pixela y desaparece, la siguiente aparece
   pixelándose", nunca el cambio de letras a la vista.

   ¿QUÉ TOCAR SI QUERÉS AJUSTARLO? Los dos números de acá abajo.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var PALABRAS = ['UX/UI', 'Visual', '3D'];
  var INTERVALO = 3000;   // 3 segundos entre palabra y palabra
  var TRANSICION = 350;   // tiene que ser igual al "0.35s" del CSS

  var elementos = document.querySelectorAll('.hero-palabra-rotativa');
  if (elementos.length === 0) return;

  // Quien pide menos animación ve la primera palabra, fija
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var indice = 0;

  setInterval(function () {
    elementos.forEach(function (el) { el.classList.add('se-va'); });

    setTimeout(function () {
      indice = (indice + 1) % PALABRAS.length;
      elementos.forEach(function (el) {
        el.textContent = PALABRAS[indice];
        el.classList.remove('se-va');
      });
    }, TRANSICION);
  }, INTERVALO);
})();


/* ------------------------------------------------------------
   LA FLECHA DEL SITIO

   La usan el carrusel y la ventana ampliada, por eso vive acá afuera:
   así hay un solo dibujo y no dos copias que se puedan desincronizar.

   Va INCRUSTADA en el botón, no como máscara de CSS sobre un archivo
   .svg: un SVG externo usado de máscara no carga al abrir el index con
   doble clic (file://) y deja los botones invisibles.

   Es el mismo trazo que exporta el Figma. Apunta hacia ARRIBA; cada
   botón la gira con CSS. "currentColor" deja que el CSS la pinte.
   ------------------------------------------------------------ */

function flechaSVG(clase) {
  return '<svg class="' + clase + '" viewBox="0 0 17.0833 16.5" width="20" height="20" ' +
    'fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M8.54167 15.25V1.25M15.8333 8.25L8.54167 1.25L1.25 8.25" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" ' +
      'stroke-linejoin="round"/>' +
    '</svg>';
}


/* ------------------------------------------------------------
   VENTANA AMPLIADA (modal)

   Al hacer clic en una captura, se abre sobre el resto de la página.

   Adentro se puede seguir recorriendo TODAS las capturas del proyecto
   sin cerrarla: con las flechas, con las teclas ← →, o deslizando el
   dedo. Al cerrar, el carrusel de abajo queda en la imagen en la que
   te quedaste, no en la que habías abierto.

   Se cierra con Escape, con el botón, o pinchando fuera de la imagen.
   ------------------------------------------------------------ */

var Modal = (function () {
  'use strict';

  var fondo, caja, imagen, botonCerrar, botonPrev, botonNext, contador, focoPrevio;

  var lista = [];      // todas las capturas del proyecto abierto
  var indice = 0;      // cuál se está viendo
  var alCerrar = null; // aviso al carrusel de en cuál quedamos

  function construir() {
    fondo = document.createElement('div');
    fondo.className = 'modal-fondo';
    fondo.setAttribute('role', 'dialog');
    fondo.setAttribute('aria-modal', 'true');
    fondo.hidden = true;

    fondo.innerHTML =
      '<button type="button" class="modal-cerrar" aria-label="Cerrar">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">' +
          '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
        '</svg>' +
      '</button>' +
      '<div class="modal-caja">' +
        '<img class="modal-imagen" alt="">' +
        '<div class="modal-controles">' +
          '<button type="button" class="modal-btn modal-prev" aria-label="Captura anterior">' +
            flechaSVG('modal-arrow') +
          '</button>' +
          '<p class="modal-contador" aria-live="polite"></p>' +
          '<button type="button" class="modal-btn modal-next" aria-label="Captura siguiente">' +
            flechaSVG('modal-arrow') +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(fondo);

    caja = fondo.querySelector('.modal-caja');
    imagen = fondo.querySelector('.modal-imagen');
    botonCerrar = fondo.querySelector('.modal-cerrar');
    botonPrev = fondo.querySelector('.modal-prev');
    botonNext = fondo.querySelector('.modal-next');
    contador = fondo.querySelector('.modal-contador');

    botonCerrar.addEventListener('click', cerrar);
    botonPrev.addEventListener('click', function () { mostrar(indice - 1); });
    botonNext.addEventListener('click', function () { mostrar(indice + 1); });

    /* --- Deslizar con el dedo para cambiar de captura ---
       Se mide cuánto se movió el puntero entre que se apoya y se
       levanta. El mismo dato sirve para saber si fue un deslizamiento
       o un clic: sin esto, deslizar sobre el fondo cerraría la
       ventana al levantar el dedo. */
    var xInicio = null;
    var huboDeslizamiento = false;
    var MINIMO = 50;   // menos que esto es un temblor de mano, no un gesto

    fondo.addEventListener('pointerdown', function (e) {
      xInicio = e.clientX;
      huboDeslizamiento = false;
    });

    fondo.addEventListener('pointerup', function (e) {
      if (xInicio === null) return;
      var dx = e.clientX - xInicio;
      xInicio = null;
      if (Math.abs(dx) < MINIMO) return;

      huboDeslizamiento = true;
      mostrar(indice + (dx < 0 ? 1 : -1));
    });

    // Pinchar el fondo cierra; pinchar la imagen o deslizar, no
    fondo.addEventListener('click', function (e) {
      if (huboDeslizamiento) { huboDeslizamiento = false; return; }
      if (e.target === fondo || e.target === caja) cerrar();
    });

    document.addEventListener('keydown', function (e) {
      if (fondo.hidden) return;

      if (e.key === 'Escape') { cerrar(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(indice - 1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(indice + 1); return; }

      /* Mientras está abierta, el foco no se escapa a la página de
         atrás: va rotando entre los botones de la propia ventana. */
      if (e.key === 'Tab') {
        e.preventDefault();

        var utiles = [botonPrev, botonNext, botonCerrar].filter(function (b) {
          return !b.disabled;
        });
        var actual = utiles.indexOf(document.activeElement);
        var salto = e.shiftKey ? -1 : 1;

        utiles[(actual + salto + utiles.length) % utiles.length].focus();
      }
    });
  }

  /* Cambia la captura que se ve. No hace nada si el número queda fuera
     de la lista, así llegar al final no "rebota" al principio. */
  function mostrar(i) {
    if (i < 0 || i > lista.length - 1) return;

    indice = i;
    imagen.src = lista[indice].src;
    imagen.alt = lista[indice].alt || '';

    contador.textContent = (indice + 1) + '/' + lista.length;
    botonPrev.disabled = indice === 0;
    botonNext.disabled = indice === lista.length - 1;

    // Se adelanta la vecina para que el cambio se sienta instantáneo
    [indice - 1, indice + 1].forEach(function (j) {
      if (lista[j]) { var previa = new Image(); previa.src = lista[j].src; }
    });
  }

  function abrir(imagenes, desde, avisoAlCerrar) {
    if (!fondo) construir();

    lista = imagenes;
    alCerrar = avisoAlCerrar || null;

    focoPrevio = document.activeElement;
    mostrar(Math.max(0, Math.min(desde || 0, lista.length - 1)));
    fondo.hidden = false;

    /* Se bloquea el scroll de la página de atrás y se compensa el ancho
       de la barra de scroll, para que el contenido no dé un salto
       lateral al desaparecer. */
    var barra = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (barra > 0) document.documentElement.style.paddingRight = barra + 'px';

    requestAnimationFrame(function () { fondo.classList.add('is-open'); });
    botonCerrar.focus();
  }

  function cerrar() {
    if (!fondo || fondo.hidden) return;

    fondo.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    document.documentElement.style.paddingRight = '';

    // Se espera a que termine el desvanecido antes de ocultarla del todo
    setTimeout(function () {
      fondo.hidden = true;
      imagen.removeAttribute('src');
    }, 250);

    // El foco vuelve a la captura desde donde se abrió
    if (focoPrevio && focoPrevio.focus) focoPrevio.focus();

    /* El carrusel de abajo se pone en la captura en la que quedaste.
       Si no, cerrás en la 7 y el carrusel sigue mostrando la 1, que se
       siente como si se hubiera perdido lo que estabas viendo. */
    if (alCerrar) { alCerrar(indice); alCerrar = null; }
  }

  return { abrir: abrir };
})();


/* ------------------------------------------------------------
   CARRUSELES DE PROYECTO
   Arma cada galería con las imágenes listadas en js/projects.js
   ------------------------------------------------------------ */

(function () {
  'use strict';

  if (typeof PROJECTS === 'undefined') return;

  // La misma flecha que usa la ventana ampliada (ver "LA FLECHA DEL SITIO")
  var FLECHA = flechaSVG('gallery-arrow');

  document.querySelectorAll('.project-card').forEach(function (card) {
    var key = card.dataset.project;
    var data = PROJECTS[key];
    var gallery = card.querySelector('.project-gallery');

    if (!gallery) return;

    // Todavía sin imágenes: se avisa dónde ponerlas en vez de mostrar un hueco
    if (!data || !data.images || data.images.length === 0) {
      var folder = data ? data.folder : 'assets/projects/' + key + '/';
      gallery.innerHTML =
        '<p class="gallery-empty">Todavía no hay imágenes para este proyecto.<br>' +
        'Ponlas en <code>' + folder + '</code> y lístalas en <code>js/projects.js</code>.</p>';
      return;
    }

    var total = data.images.length;

    // --- Se arma el HTML del carrusel ---
    var slides = data.images.map(function (img, i) {
      var texto = (img.caption || 'Captura ' + (i + 1)).replace(/"/g, '&quot;');

      /* La imagen va dentro de un <button> para que ampliarla también
         funcione con el teclado. Con un div y un onclick, quien no usa
         ratón se quedaría sin la función. */
      return '<figure class="gallery-slide">' +
               '<button type="button" class="gallery-zoom" aria-label="Ampliar: ' + texto + '">' +
                 '<img src="' + data.folder + img.file + '"' +
                 ' alt="' + texto + '"' +
                 ' loading="' + (i === 0 ? 'eager' : 'lazy') + '"' +
                 ' draggable="false">' + // si no, el navegador arrastra la imagen suelta
               '</button>' +
             '</figure>';
    }).join('');

    gallery.innerHTML =
      '<div class="gallery-track" tabindex="0" role="group" aria-label="Capturas del proyecto">' +
        slides +
      '</div>' +
      '<div class="gallery-controls">' +
        '<button type="button" class="gallery-btn gallery-prev" aria-label="Captura anterior">' + FLECHA + '</button>' +
        '<p class="gallery-counter" aria-live="polite"></p>' +
        '<button type="button" class="gallery-btn gallery-next" aria-label="Captura siguiente">' + FLECHA + '</button>' +
      '</div>';

    var track = gallery.querySelector('.gallery-track');
    var counter = gallery.querySelector('.gallery-counter');
    var prev = gallery.querySelector('.gallery-prev');
    var next = gallery.querySelector('.gallery-next');
    var slideEls = gallery.querySelectorAll('.gallery-slide');
    var index = 0;

    // El marco toma la proporción real de las capturas de ESTE proyecto,
    // así no quedan franjas vacías cuando no son 16:9.
    var primera = gallery.querySelector('.gallery-slide img');
    function fijarProporcion() {
      if (!primera.naturalWidth) return;
      gallery.style.setProperty(
        '--ratio-captura',
        primera.naturalWidth + ' / ' + primera.naturalHeight
      );
    }
    if (primera.complete) fijarProporcion();
    else primera.addEventListener('load', fijarProporcion);

    // Actualiza el contador y el estado de las flechas
    function refresh() {
      counter.textContent = (index + 1) + '/' + total;
      prev.disabled = index === 0;
      next.disabled = index === total - 1;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, total - 1));
      track.scrollTo({ left: slideEls[index].offsetLeft - slideEls[0].offsetLeft });
      refresh();
    }

    prev.addEventListener('click', function () { goTo(index - 1); });
    next.addEventListener('click', function () { goTo(index + 1); });

    // Flechas del teclado cuando el carrusel tiene el foco
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    /* --- Arrastrar con el mouse (clic sostenido) ---
       En celular no hace falta: el deslizamiento con el dedo ya funciona
       solo, y el nativo tiene inercia. Por eso solo se atiende al mouse. */
    var arrastrando = false;
    var xInicial = 0;
    var scrollInicial = 0;

    /* Para distinguir un clic de un arrastre.

       Se mide cuánto se movió EL PUNTERO, no el scroll de la pista: al
       soltar, el carrusel se engancha a la captura más cercana y eso
       cambia el scroll por su cuenta, antes de que llegue el clic. Si se
       mirara el scroll, cada clic parecería un arrastre y no abriría
       nunca la imagen.

       Se registra con cualquier puntero, también el dedo: sin esto,
       deslizar en el celular abriría una imagen al levantar el dedo. */
    var UMBRAL = 8;          // holgura: la mano tiembla un poco al hacer clic
    var xAlPresionar = 0;
    var huboArrastre = false;
    var preparado = false;   // botón pulsado, pero todavía sin mover

    track.addEventListener('pointerdown', function (e) {
      xAlPresionar = e.clientX;
      scrollInicial = track.scrollLeft;
      huboArrastre = false;
      arrastrando = false;
      preparado = (e.pointerType !== 'mouse') || e.button === 0;
    });

    track.addEventListener('pointermove', function (e) {
      if (!preparado) return;
      if (e.pointerType === 'mouse' && e.buttons === 0) return;

      var dx = e.clientX - xAlPresionar;
      if (Math.abs(dx) <= UMBRAL) return;

      huboArrastre = true;

      /* El arrastre con el ratón NO empieza al presionar, sino recién
         cuando el puntero se movió de verdad.

         Antes se capturaba el puntero desde el primer píxel, y con el
         puntero capturado el navegador dispara el clic sobre la pista y
         no sobre la imagen: la modal no abría nunca. Así, un clic normal
         jamás entra en modo arrastre. */
      if (!arrastrando && e.pointerType === 'mouse') {
        arrastrando = true;
        // El snap y el scroll suave pelean con el arrastre: se apagan
        // mientras dura, y se vuelven a encender al soltar.
        track.style.scrollSnapType = 'none';
        track.style.scrollBehavior = 'auto';
        track.classList.add('is-dragging');
        track.setPointerCapture(e.pointerId);
      }

      if (arrastrando) {
        e.preventDefault();
        track.scrollLeft = scrollInicial - dx;
      }
    });

    // El navegador cancela el puntero cuando toma el control del scroll táctil
    track.addEventListener('pointercancel', function () { huboArrastre = true; });

    track.addEventListener('click', function (e) {
      if (huboArrastre) return;

      /* Si el puntero estuviera capturado, el clic llegaría con la pista
         como destino. Por si acaso, se resuelve también por posición. */
      var destino = e.target.closest ? e.target.closest('.gallery-zoom') : null;
      if (!destino) {
        var bajoElCursor = document.elementFromPoint(e.clientX, e.clientY);
        destino = bajoElCursor && bajoElCursor.closest ?
                  bajoElCursor.closest('.gallery-zoom') : null;
      }
      if (!destino) return;

      /* Se le pasa la lista COMPLETA del proyecto, no solo la captura
         pinchada: así adentro se puede seguir recorriendo el resto sin
         cerrar y volver a abrir.

         El tercer argumento es lo que la ventana avisa al cerrarse:
         goTo deja el carrusel en la captura donde quedaste. */
      var slideDelClic = destino.closest('.gallery-slide');

      Modal.abrir(
        [].map.call(slideEls, function (slide) {
          var im = slide.querySelector('img');
          return { src: im.currentSrc || im.src, alt: im.alt };
        }),
        [].indexOf.call(slideEls, slideDelClic),
        goTo
      );
    });

    function soltar() {
      preparado = false;
      if (!arrastrando) return;   // fue un clic, no un arrastre
      arrastrando = false;

      track.classList.remove('is-dragging');
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';

      // Queda enganchado en la captura más cercana a donde se soltó
      var base = slideEls[0].offsetLeft;
      var cercana = 0;
      var minDist = Infinity;

      slideEls.forEach(function (el, i) {
        var dist = Math.abs((el.offsetLeft - base) - track.scrollLeft);
        if (dist < minDist) { minDist = dist; cercana = i; }
      });

      goTo(cercana);
    }

    track.addEventListener('pointerup', soltar);
    track.addEventListener('pointercancel', soltar);

    // Si se desliza con el dedo o el trackpad, el contador sigue el movimiento
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var base = slideEls[0].offsetLeft;
        var nearest = 0;
        var minDist = Infinity;

        slideEls.forEach(function (el, i) {
          var dist = Math.abs((el.offsetLeft - base) - track.scrollLeft);
          if (dist < minDist) { minDist = dist; nearest = i; }
        });

        if (nearest !== index) { index = nearest; refresh(); }
      }, 120);
    });

    refresh();
  });
})();


/* ------------------------------------------------------------
   FOCO EN EL PROYECTO QUE SE ESTÁ MIRANDO

   Dos efectos que comparten la misma idea: manda lo que está en el
   MEDIO de la pantalla.

   1. OPACIDAD. El proyecto centrado se ve al 100%; a medida que se
      aleja del medio se apaga hasta el 20%.

   2. MARCO BLANCO. No hay una tarjeta blanca por proyecto: hay UNA
      sola, que viaja. Cuando pasás de un proyecto al siguiente, el
      marco se ESTIRA hasta abarcar los dos y después se recoge sobre
      el nuevo. Se siente como un mismo contenedor que se muda, en vez
      de dos cajas separadas.

   Los dos se calculan juntos, en un solo cuadro de animación.

   ¿QUÉ TOCAR SI QUERÉS AJUSTARLO? Solo los números de acá abajo.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  // Qué tan apagado queda el proyecto más lejano (0.2 = 20%)
  var MINIMA = 0.2;

  /* A qué distancia del centro llega a esa opacidad mínima, medido en
     alturas de pantalla. 0.45 = a media pantalla de distancia ya está
     al mínimo. Más chico = el desvanecido es más brusco. */
  var ALCANCE = 0.45;

  /* Cuánto se estira el marco al cambiar de proyecto. 0 = no se
     estira (pasa de una tarjeta a otra deslizándose parejo).
     1 = en la mitad del camino abarca los dos proyectos enteros. */
  var ESTIRAMIENTO = 1;

  var seccion = document.querySelector('.projects');
  if (!seccion) return;

  var cards = seccion.querySelectorAll('.project-card');
  if (cards.length === 0) return;

  /* Quien pide menos animación en su sistema ve todos los proyectos al
     100% y cada uno con su tarjeta blanca fija (el respaldo del CSS).
     Además de que el movimiento puede marear, el texto al 20% no llega
     al contraste mínimo, así que quieto se lee mejor. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* El marco se crea desde acá y no en el HTML a propósito: si el JS
     no corre, el elemento no existe y el CSS deja el fondo blanco en
     cada tarjeta. Nunca se ve la sección sin contenedor. */
  var marco = document.createElement('div');
  marco.className = 'projects-frame';
  marco.setAttribute('aria-hidden', 'true');  // es decoración, no contenido
  seccion.insertBefore(marco, seccion.firstChild);
  seccion.classList.add('tiene-marco');

  var pendiente = false;

  /* Curva suave: arranca y termina despacio, en vez de una rampa recta.
     Con una recta se nota el momento exacto en que algo empieza a
     moverse; así el arranque y la llegada quedan disimulados. */
  function suavizar(x) {
    return x * x * (3 - 2 * x);
  }

  function actualizar() {
    pendiente = false;

    var centroPantalla = window.innerHeight / 2;
    var rango = window.innerHeight * ALCANCE;
    if (rango <= 0) return;

    /* Se miden todas las cajas de una sola vez, ANTES de escribir nada.
       Si se mezclara medir y escribir, el navegador tendría que
       recalcular la página en cada vuelta y el scroll se trabaría. */
    var cajas = [];
    cards.forEach(function (card) { cajas.push(card.getBoundingClientRect()); });

    // --- 1. Opacidad ---
    cards.forEach(function (card, i) {
      var caja = cajas[i];

      /* Distancia entre el centro de la pantalla y el borde MÁS CERCANO
         del proyecto. Si el centro cae dentro del bloque, la distancia
         es 0 y el proyecto se ve entero.

         Se mide contra el borde y no contra el centro del bloque a
         propósito: en celular un proyecto es más alto que la pantalla,
         y midiendo de centro a centro nunca llegaría a estar al 100%. */
      var distancia = Math.max(0, caja.top - centroPantalla, centroPantalla - caja.bottom);
      var t = Math.min(1, distancia / rango);

      card.style.opacity = (1 - (1 - MINIMA) * suavizar(t)).toFixed(3);
    });

    // --- 2. Marco blanco ---

    /* Se busca entre qué dos proyectos está el centro de la pantalla,
       comparando contra el centro de cada uno. */
    var i = 0;
    while (
      i < cards.length - 2 &&
      centroPantalla > (cajas[i + 1].top + cajas[i + 1].bottom) / 2
    ) { i++; }

    var desde = cajas[i];
    var hasta = cajas[Math.min(i + 1, cards.length - 1)];

    var centroDesde = (desde.top + desde.bottom) / 2;
    var centroHasta = (hasta.top + hasta.bottom) / 2;

    // Cuánto del camino de un proyecto al otro llevamos recorrido (0 a 1)
    var avance = centroHasta === centroDesde
      ? 0
      : (centroPantalla - centroDesde) / (centroHasta - centroDesde);
    avance = Math.max(0, Math.min(1, avance));

    /* El truco del estiramiento: el borde de abajo y el de arriba NO
       viajan al mismo ritmo.

       - El de abajo hace todo su recorrido en la PRIMERA mitad.
       - El de arriba espera y lo hace en la SEGUNDA.

       Resultado: justo a mitad de camino el marco va desde el borde
       de arriba del proyecto viejo hasta el borde de abajo del nuevo,
       o sea que los abarca a los dos enteros. Después el borde de
       arriba alcanza al otro y el marco se recoge sobre el nuevo.

       Los extremos siguen siendo exactos: en 0 el marco calza justo
       con el proyecto viejo, y en 1 con el nuevo.

       Con ESTIRAMIENTO en 0 las dos curvas se vuelven la misma y el
       marco simplemente se desliza de una tarjeta a la otra. */
    var adelanta = suavizar(Math.min(1, avance * 2));       // termina a mitad
    var rezaga = suavizar(Math.max(0, avance * 2 - 1));     // arranca a mitad

    var curvaArriba = rezaga * ESTIRAMIENTO + avance * (1 - ESTIRAMIENTO);
    var curvaAbajo = adelanta * ESTIRAMIENTO + avance * (1 - ESTIRAMIENTO);

    // Las posiciones se pasan a coordenadas de la sección
    var origen = seccion.getBoundingClientRect().top;
    var arriba = desde.top + (hasta.top - desde.top) * curvaArriba - origen;
    var abajo = desde.bottom + (hasta.bottom - desde.bottom) * curvaAbajo - origen;

    marco.style.top = arriba.toFixed(1) + 'px';
    marco.style.height = Math.max(0, abajo - arriba).toFixed(1) + 'px';
  }

  /* El cálculo se hace UNA vez por cuadro de animación, no en cada
     aviso de scroll: el navegador dispara decenas por segundo y
     recalcular en todos trabaría el desplazamiento. */
  function pedir() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  // Al terminar de cargar las capturas los bloques cambian de alto
  window.addEventListener('load', pedir);

  actualizar();
})();



/* ------------------------------------------------------------
   DEGRADADO QUE SIGUE AL MOUSE (Hello y heros con foto)

   El resplandor de .hero-fondo::after está centrado en
   "--mouse-x/--mouse-y" (ver el CSS). Acá se actualizan esas
   variables con la posición del mouse DENTRO de la tarjeta, en
   porcentaje (0% = borde izquierdo/de arriba, 100% = el opuesto).

   Solo corre en pantallas con mouse de verdad (celular no tiene
   "hover", así que ni se engancha el evento) y si no se pidió menos
   animación.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  // ".hero" es el del home; ".pagina-intro-foto" es la misma idea en
  // páginas de categoría que ya tienen su propia foto (por ahora,
  // ux-ui.html). Cada una seteando SU PROPIO --mouse-x/--mouse-y, así
  // conviven varias en la misma página sin pisarse.
  var contenedores = document.querySelectorAll('.hero, .pagina-intro-foto');
  if (contenedores.length === 0) return;

  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  contenedores.forEach(function (contenedor) {
    var pendiente = false;
    var x = 70, y = 20; // arrancan donde también arranca el CSS

    function actualizar() {
      pendiente = false;
      contenedor.style.setProperty('--mouse-x', x + '%');
      contenedor.style.setProperty('--mouse-y', y + '%');
    }

    contenedor.addEventListener('pointermove', function (e) {
      var caja = contenedor.getBoundingClientRect();
      x = ((e.clientX - caja.left) / caja.width) * 100;
      y = ((e.clientY - caja.top) / caja.height) * 100;

      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    });
  });
})();


/* ------------------------------------------------------------
   HEADER SÓLIDO AL SCROLLEAR

   El header es "fixed": flota encima del contenido en vez de
   empujarlo. Mientras estás arriba de todo (viendo el Hello, en el
   home) no lleva fondo, para leerse directo sobre la foto. Apenas
   bajás un poco, se le pone un fondo (ver ".header-solido" en el
   CSS) para no quedar flotando transparente sobre el resto de la
   página.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  if (!header) return;

  var UMBRAL = 40; // píxeles de scroll antes de ponerle fondo

  var pendiente = false;

  function actualizar() {
    pendiente = false;
    header.classList.toggle('header-solido', window.scrollY > UMBRAL);
  }

  function pedir() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener('scroll', pedir, { passive: true });
  actualizar();
})();


/* ------------------------------------------------------------
   MENÚ HAMBURGUESA (celular)

   Abre y cierra el panel de links. Se cierra solo al elegir una
   sección, con Escape, al tocar fuera, y al pasar a una pantalla
   grande (donde los links vuelven a estar siempre a la vista).
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var boton = document.querySelector('.nav-toggle');
  var menu = document.querySelector('#menu-principal');
  if (!header || !boton || !menu) return;

  var grande = window.matchMedia('(min-width: 600px)');

  function abrir(si) {
    header.classList.toggle('menu-abierto', si);
    boton.setAttribute('aria-expanded', si ? 'true' : 'false');
    boton.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
  }

  function estaAbierto() { return header.classList.contains('menu-abierto'); }

  boton.addEventListener('click', function () { abrir(!estaAbierto()); });

  // Elegir una sección cierra el menú
  menu.addEventListener('click', function (e) {
    if (e.target.closest('.nav-item')) abrir(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estaAbierto()) {
      abrir(false);
      boton.focus();   // el foco vuelve al botón, no se pierde
    }
  });

  // Tocar fuera del header cierra
  document.addEventListener('click', function (e) {
    if (estaAbierto() && !header.contains(e.target)) abrir(false);
  });

  /* Si se agranda la pantalla con el menú abierto, los links vuelven a
     verse solos: hay que soltar el estado o quedaría la X del botón. */
  grande.addEventListener('change', function (e) {
    if (e.matches) abrir(false);
  });
})();


/* ------------------------------------------------------------
   MENÚ: marca el item activo según la sección visible
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var navItems = document.querySelectorAll('.nav-item');
  var sections = [];

  // Junta cada sección con su link correspondiente. Los links que
  // apuntan a OTRA página (ux-ui.html, branding.html, etc.) no tienen
  // sección acá: se ignoran, su estado "activo" queda fijo en el HTML
  // de cada página (ver el comentario en el <nav> de cada archivo).
  navItems.forEach(function (item) {
    var href = item.getAttribute('href');
    if (href.charAt(0) !== '#') return;
    var section = document.querySelector(href);
    if (section) {
      sections.push({ link: item, el: section });
    }
  });

  if (sections.length === 0) return;

  function setActive(link) {
    navItems.forEach(function (item) {
      var active = item === link;
      item.classList.toggle('is-active', active);
      if (active) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  // Observa qué sección está en pantalla y actualiza el menú
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var match = sections.find(function (s) { return s.el === entry.target; });
      if (match) setActive(match.link);
    });
  }, {
    // Considera "activa" la sección que cruza la franja media de la pantalla
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  });

  sections.forEach(function (s) { observer.observe(s.el); });
})();


/* ------------------------------------------------------------
   FONDO ANIMADO — CIELO ESTRELLADO

   Estrellas en tres "capas" de profundidad (lejos / media / cerca).
   Las de lejos son chicas y tenues; las de cerca, más grandes y
   brillantes. Cada tanto, un cometa muy sutil cruza la pantalla.

   Tres movimientos combinados:
   - Al hacer SCROLL, cada capa se desplaza verticalmente a su propia
     velocidad (la de cerca más rápido que la de lejos): da la
     sensación de profundidad.
   - Todo el tiempo, cada estrella "titila" muy despacio (varía de
     brillo) y flota un poquito, con fase y velocidad propias, para
     que el fondo se sienta vivo aunque no se toque el mouse.
   - De vez en cuando (al azar, cada 8 a 18 segundos) aparece un
     cometa: un puntito brillante con una cola que se desvanece,
     cruzando en diagonal, y desaparece solo.

   Pensado para no pesar: nada de ctx.filter (el blur de canvas es
   carísimo de recalcular en cada cuadro), y el titileo dibuja a ~30
   cuadros por segundo en vez de 60 porque el movimiento es tan lento
   que no se nota la diferencia.

   Usa el color del sitio (--color-ink) para las estrellas, así se
   adapta solo si algún día cambia la paleta. Es puramente decorativo:
   no se lee con lector de pantalla y no bloquea clics (ver .fondo-red
   en css/styles.css).
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var canvas = document.getElementById('fondo-red');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pantallaChica = window.matchMedia('(max-width: 699px)').matches;

  // --- Capas de estrellas: de atrás hacia adelante ---
  // densidad = cuántas estrellas por cada 40.000px² de pantalla
  // velocidad = qué tan rápido se desplaza esta capa al hacer scroll
  // deriva = cuántos px como máximo se aleja cada estrella de su
  //          posición de reposo en el flote continuo
  // paralaxMouse = cuántos px como máximo desplaza esta capa al mover
  // el mouse de un extremo al otro de la pantalla. Las capas de atrás
  // casi no se mueven; las de adelante, un poco más: da sensación de
  // profundidad real, como si el cielo tuviera distancia.
  var DEFINICION_CAPAS = [
    { densidad: 1.3, radio: [0.5, 1.1], alpha: [0.18, 0.38], velocidad: 0.02, deriva: 4, paralaxMouse: 4 },
    { densidad: 0.8, radio: [0.8, 1.6], alpha: [0.35, 0.55], velocidad: 0.05, deriva: 6, paralaxMouse: 9 },
    { densidad: 0.3, radio: [1.2, 2.2], alpha: [0.55, 0.85], velocidad: 0.09, deriva: 9, paralaxMouse: 16 },
    // Capa extra, solo para "modo espacio" (soloEspacio: true, más
    // abajo se salta al dibujar si no está activo): muchas estrellas
    // chiquitas y tenues, para que esa vista se sienta más densa sin
    // tocar el fondo normal de navegación, que tiene que seguir sutil.
    { densidad: 2.6, radio: [0.3, 0.8], alpha: [0.12, 0.3], velocidad: 0.015, deriva: 3, paralaxMouse: 2, soloEspacio: true }
  ];

  var ALTO_MUNDO = 1.6;           // la capa es más alta que la pantalla, para poder desplazarla sin que se note el borde
  var CUADROS_POR_SEGUNDO = 30;   // el titileo es tan lento que 30fps se ve igual de fluido que 60 y cuesta la mitad

  // --- Cometas: cada cuánto puede aparecer uno, y cuánto dura ---
  // En "modo espacio" (ver "BOTÓN VER LAS ESTRELLAS" más abajo) hay
  // varios a la vez y aparecen mucho más seguido: es la vista pensada
  // justamente para mirar el cielo.
  var COMETA_ESPERA_MIN = 8000;   // ms
  var COMETA_ESPERA_MAX = 18000;
  var COMETA_ESPERA_MIN_ESPACIO = 1200;
  var COMETA_ESPERA_MAX_ESPACIO = 3500;
  var COMETA_DURACION_MIN = 900;
  var COMETA_DURACION_MAX = 1400;
  var COMETA_LARGO = 110;         // px de la cola
  var COMETAS_MAX_ESPACIO = 3;

  // --- Destellos: chispazos quietos, solo en "modo espacio" ---
  var DESTELLO_ESPERA_MIN = 250;
  var DESTELLO_ESPERA_MAX = 900;
  var DESTELLO_DURACION_MIN = 400;
  var DESTELLO_DURACION_MAX = 800;

  // --- Cometas extra al scrollear (navegación normal, no "modo
  // espacio": ahí ya hay de sobra) ---
  // No van por tiempo sino por cuánto se scrolleó: cada tanto (a una
  // distancia al azar, para que no se sienta mecánico) aparece uno
  // más, igual a los de siempre.
  var EVENTO_SCROLL_MIN = 700;    // px scrolleados entre un evento y otro
  var EVENTO_SCROLL_MAX = 1600;

  // --- Arrastrar para navegar, en "modo espacio" ---
  // El rango no es un tope duro: cuanto más te acercás, menos avanza
  // (Math.tanh), así se siente como un elástico y no como chocar
  // contra una pared. Por eso el campo de estrellas se genera un poco
  // más ancho que la pantalla (RANGO_PAN de más para cada lado): así
  // nunca se ve un borde vacío al llegar al límite del arrastre.
  var RANGO_PAN = 220;             // px
  var VOLVIENDO_DURACION = 500;    // ms que tarda en volver al centro al salir

  var capas = [];
  var cometas = [];
  var destellos = [];
  var proximoCometaEn = 0;
  var proximoDestelloEn = 0;

  // Cuánto se scrolleó desde el último evento especial, y a partir de
  // cuánto toca el próximo (se recalcula cada vez, al azar).
  var scrollEventoAcumulado = 0;
  var scrollAnterior = null;
  var proximoEventoScrollEn = EVENTO_SCROLL_MIN + Math.random() * (EVENTO_SCROLL_MAX - EVENTO_SCROLL_MIN);
  var colorLinea = '#f2efe9';
  var ancho = 0, alto = 0, altoMundo = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var pausado = false;
  var idAnimacion = null;
  var espacioAnterior = false;

  // Arrastre: "Crudo" es cuánto se movió el puntero en total, SIN
  // límite. panX/panY son el offset ya con el elástico aplicado, y
  // son lo único que usa dibujar().
  var arrastrando = false;
  var crudoX = 0, crudoY = 0;
  var origenX = 0, origenY = 0;
  var panX = 0, panY = 0;
  var volviendo = false;
  var volviendoDesdeX = 0, volviendoDesdeY = 0;
  var volviendoInicio = 0;

  // --- Paralax con el mouse: las estrellas se corren un poco en
  // dirección opuesta al cursor, como si tuvieran profundidad. Solo
  // en dispositivos con mouse de verdad (no touch) y fuera de "modo
  // espacio", donde el arrastre ya mueve el fondo por su cuenta.
  // mouseObjetivoX/Y van de -1 a 1 según dónde está el cursor
  // respecto al centro de la pantalla; mouseX/Y las sigue suavizado
  // cuadro a cuadro para que el movimiento no sea brusco.
  var tieneMouse = window.matchMedia('(pointer: fine)').matches;
  var mouseObjetivoX = 0, mouseObjetivoY = 0;
  var mouseX = 0, mouseY = 0;

  function elastico(crudo, rango) {
    return rango * Math.tanh(crudo / rango);
  }

  function leerColores() {
    var estilos = getComputedStyle(document.documentElement);
    colorLinea = estilos.getPropertyValue('--color-ink').trim() || colorLinea;
  }

  function hexARgb(hex) {
    var limpio = hex.replace('#', '');
    if (limpio.length === 3) {
      limpio = limpio.split('').map(function (c) { return c + c; }).join('');
    }
    var num = parseInt(limpio, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  // Vaivén suave sin repetirse de forma obvia: mezcla dos senos de
  // distinta frecuencia. Devuelve un valor entre -1 y 1.
  function vaiven(t, fase) {
    return (Math.sin(t + fase) + Math.sin(t * 0.6 + fase * 1.7) * 0.5) / 1.5;
  }

  function envolver(y, mod) {
    var r = y % mod;
    return r < 0 ? r + mod : r;
  }

  function construirCapas() {
    // Más ancho que la pantalla, de los dos lados: es lo que se
    // revela al arrastrar en modo espacio. Sin este margen, llegar al
    // límite del arrastre mostraría un borde vacío.
    var anchoMundo = ancho + RANGO_PAN * 2;
    var area = anchoMundo * alto;
    var factorDensidad = pantallaChica ? 0.6 : 1;

    capas = DEFINICION_CAPAS.map(function (def) {
      var cantidad = Math.round((area / 40000) * def.densidad * factorDensidad);
      var puntos = [];
      for (var i = 0; i < cantidad; i++) {
        puntos.push({
          x: Math.random() * anchoMundo - RANGO_PAN,
          y: Math.random() * altoMundo,
          r: def.radio[0] + Math.random() * (def.radio[1] - def.radio[0]),
          a: def.alpha[0] + Math.random() * (def.alpha[1] - def.alpha[0]),
          // Cada estrella titila/flota distinto: fase y velocidad propias
          fase: Math.random() * Math.PI * 2,
          velDeriva: 0.00025 + Math.random() * 0.00025,
          // Posición del cuadro actual: se reescribe en cada frame,
          // nunca se crea un objeto nuevo mientras la animación corre.
          dx: 0, dy: 0
        });
      }
      return { def: def, puntos: puntos };
    });
  }

  // Elige un punto de partida y una dirección diagonal al azar, sobre
  // uno de los bordes de la pantalla, para que el cometa "entre" y
  // "salga" del cuadro en vez de aparecer en el medio de la nada.
  function crearCometa(t) {
    var deIzquierda = Math.random() < 0.5;
    var x0 = deIzquierda ? -20 : ancho * (0.5 + Math.random() * 0.5);
    var y0 = Math.random() * alto * 0.5;
    var velocidad = 0.55 + Math.random() * 0.35;         // px/ms
    var angulo = (Math.PI / 5) + Math.random() * (Math.PI / 10); // baja en diagonal
    var direccion = deIzquierda ? 1 : -1;

    cometas.push({
      x0: x0, y0: y0,
      vx: Math.cos(angulo) * velocidad * direccion,
      vy: Math.sin(angulo) * velocidad,
      inicio: t,
      duracion: COMETA_DURACION_MIN + Math.random() * (COMETA_DURACION_MAX - COMETA_DURACION_MIN)
    });
  }

  // Chispazo quieto: aparece, brilla un instante y se apaga. Solo se
  // usa en "modo espacio", como textura extra mientras se mira el cielo.
  function crearDestello(t) {
    destellos.push({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: 1 + Math.random() * 1.5,
      inicio: t,
      duracion: DESTELLO_DURACION_MIN + Math.random() * (DESTELLO_DURACION_MAX - DESTELLO_DURACION_MIN)
    });
  }

  function medir() {
    ancho = window.innerWidth;
    alto = window.innerHeight;
    altoMundo = alto * ALTO_MUNDO;

    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    construirCapas();
  }

  function dibujar(t) {
    t = t || 0;
    ctx.clearRect(0, 0, ancho, alto);

    var espacio = !!window.__modoEspacio;

    // Se acaba de SALIR del modo espacio: si había quedado arrastrado
    // hacia un lado, que vuelva solo al centro en vez de saltar de
    // golpe la próxima vez que se abra.
    if (espacioAnterior && !espacio) {
      arrastrando = false;
      volviendo = true;
      volviendoDesdeX = panX;
      volviendoDesdeY = panY;
      volviendoInicio = t;
    }
    espacioAnterior = espacio;

    if (volviendo) {
      var avanceVuelta = Math.min(1, (t - volviendoInicio) / VOLVIENDO_DURACION);
      var suavizado = 1 - Math.pow(1 - avanceVuelta, 3); // ease-out: rápido y frena suave
      panX = volviendoDesdeX * (1 - suavizado);
      panY = volviendoDesdeY * (1 - suavizado);
      if (avanceVuelta >= 1) {
        volviendo = false;
        crudoX = 0; crudoY = 0;
        panX = 0; panY = 0;
      }
    }
    // Si no está "volviendo", panX/panY ya los dejó puestos el propio
    // "pointermove" (ver "ARRASTRAR PARA NAVEGAR" más abajo).

    // Paralax con el mouse: sigue al objetivo despacio (10% de la
    // distancia por cuadro). Se suma al arrastre de "modo espacio"
    // sin pelearse: el arrastre mueve el lienzo entero (ctx.translate)
    // y esto corre cada estrella un poco más, por separado.
    mouseX += (mouseObjetivoX - mouseX) * 0.1;
    mouseY += (mouseObjetivoY - mouseY) * 0.1;

    var rgbLinea = hexARgb(colorLinea);
    var scrollY = window.scrollY || window.pageYOffset || 0;

    // A partir de acá todo se dibuja desplazado por el arrastre. Se
    // deshace con ctx.restore() antes de terminar la función.
    ctx.save();
    ctx.translate(panX, panY);

    capas.forEach(function (capa) {
      if (capa.def.soloEspacio && !espacio) return;

      var desplazo = (scrollY * capa.def.velocidad) % altoMundo;
      var puntos = capa.puntos;

      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        p.dx = p.x + vaiven(t * p.velDeriva, p.fase) * capa.def.deriva - mouseX * capa.def.paralaxMouse;
        p.dy = envolver(p.y - desplazo, altoMundo) + vaiven(t * p.velDeriva, p.fase + 2.1) * capa.def.deriva - mouseY * capa.def.paralaxMouse;
        // El margen de más (RANGO_PAN) es para que no se recorte una
        // estrella que el arrastre todavía puede traer a la vista.
        if (p.dy < -20 - RANGO_PAN || p.dy > alto + 20 + RANGO_PAN) continue;

        // Titileo: el brillo de reposo (p.a) sube y baja despacio
        var brillo = p.a * (0.75 + 0.25 * (vaiven(t * p.velDeriva * 2.3, p.fase) + 1) / 2);

        ctx.beginPath();
        ctx.arc(p.dx, p.dy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgbLinea.r + ',' + rgbLinea.g + ',' + rgbLinea.b + ',' + brillo.toFixed(3) + ')';
        ctx.fill();
      }
    });

    // --- Cometas ---
    // Fuera de "modo espacio" se arma uno nuevo si ya pasó la espera y
    // no hay ninguno activo (a propósito nunca hay dos a la vez: el
    // efecto de fondo normal es "muy sutil"). En modo espacio hay
    // varios a la vez y aparecen mucho más seguido.
    var maxCometas = espacio ? COMETAS_MAX_ESPACIO : 1;

    if (t > proximoCometaEn && cometas.length < maxCometas && (espacio || !pantallaChica)) {
      crearCometa(t);
      var esperaMin = espacio ? COMETA_ESPERA_MIN_ESPACIO : COMETA_ESPERA_MIN;
      var esperaMax = espacio ? COMETA_ESPERA_MAX_ESPACIO : COMETA_ESPERA_MAX;
      proximoCometaEn = t + esperaMin + Math.random() * (esperaMax - esperaMin);
    }

    // --- Cometas extra al scrollear (fuera de "modo espacio") ---
    // Se miden en distancia scrolleada, no en tiempo: si nadie se
    // mueve por la página, no aparece ninguno de más. Son cometas
    // iguales a los de siempre (crearCometa sin nada especial):
    // simplemente hay más probabilidad de ver uno mientras se navega.
    if (scrollAnterior === null) scrollAnterior = scrollY;
    if (!espacio) {
      scrollEventoAcumulado += Math.abs(scrollY - scrollAnterior);
      if (!reducido && scrollEventoAcumulado > proximoEventoScrollEn) {
        crearCometa(t);
        scrollEventoAcumulado = 0;
        proximoEventoScrollEn = EVENTO_SCROLL_MIN + Math.random() * (EVENTO_SCROLL_MAX - EVENTO_SCROLL_MIN);
      }
    }
    scrollAnterior = scrollY;

    for (var c = cometas.length - 1; c >= 0; c--) {
      var cometa = cometas[c];
      var progreso = (t - cometa.inicio) / cometa.duracion;
      if (progreso >= 1) { cometas.splice(c, 1); continue; }

      var x = cometa.x0 + cometa.vx * (t - cometa.inicio);
      var y = cometa.y0 + cometa.vy * (t - cometa.inicio);
      // Sube y baja: entra y sale suave, nunca aparece/desaparece de golpe
      var opacidad = Math.sin(progreso * Math.PI);

      var mag = Math.sqrt(cometa.vx * cometa.vx + cometa.vy * cometa.vy);
      var ux = cometa.vx / mag, uy = cometa.vy / mag;
      var colaX = x - ux * COMETA_LARGO;
      var colaY = y - uy * COMETA_LARGO;

      var degradado = ctx.createLinearGradient(x, y, colaX, colaY);
      degradado.addColorStop(0, 'rgba(255,255,255,' + (opacidad * 0.85).toFixed(3) + ')');
      degradado.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.strokeStyle = degradado;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(colaX, colaY);
      ctx.stroke();

      // Un puntito más marcado en la cabeza, como el destello
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (opacidad * 0.95).toFixed(3) + ')';
      ctx.fill();
    }

    // --- Destellos (solo en modo espacio) ---
    if (espacio) {
      if (t > proximoDestelloEn) {
        crearDestello(t);
        proximoDestelloEn = t + DESTELLO_ESPERA_MIN + Math.random() * (DESTELLO_ESPERA_MAX - DESTELLO_ESPERA_MIN);
      }
    } else if (destellos.length) {
      destellos.length = 0; // si se sale del modo, no quedan colgados
    }

    for (var d = destellos.length - 1; d >= 0; d--) {
      var destello = destellos[d];
      var progresoD = (t - destello.inicio) / destello.duracion;
      if (progresoD >= 1) { destellos.splice(d, 1); continue; }

      var brilloD = Math.sin(progresoD * Math.PI);
      ctx.beginPath();
      ctx.arc(destello.x, destello.y, destello.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (brilloD * 0.9).toFixed(3) + ')';
      ctx.fill();
    }

    ctx.restore(); // deshace el ctx.translate(panX, panY) de arriba
  }

  // --- Bucle continuo, limitado a CUADROS_POR_SEGUNDO: el vaivén
  // necesita dibujar cuadro a cuadro, no solo al hacer scroll, pero no
  // hace falta a 60fps porque el movimiento es lentísimo. Se corta
  // apenas la pestaña se oculta o si el sistema pide reducir el
  // movimiento. ---
  var ultimoCuadro = 0;
  var INTERVALO = 1000 / CUADROS_POR_SEGUNDO;

  function bucle(t) {
    idAnimacion = requestAnimationFrame(bucle);
    if (t - ultimoCuadro < INTERVALO) return;
    ultimoCuadro = t;
    dibujar(t);
  }

  function arrancar() {
    if (idAnimacion !== null || pausado || reducido) return;
    idAnimacion = requestAnimationFrame(bucle);
  }

  function frenar() {
    if (idAnimacion === null) return;
    cancelAnimationFrame(idAnimacion);
    idAnimacion = null;
  }

  var pendienteResize = false;
  function pedirResize() {
    if (pendienteResize) return;
    pendienteResize = true;
    requestAnimationFrame(function () {
      pendienteResize = false;
      pantallaChica = window.matchMedia('(max-width: 699px)').matches;
      medir();
      if (reducido) dibujar();
    });
  }

  /* ---------------------------------------------------------
     ARRASTRAR PARA NAVEGAR (solo en modo espacio)

     "crudoX/crudoY" acumulan el movimiento del puntero SIN límite;
     cada cuadro, dibujar() los pasa por elastico() para sacar
     panX/panY (esos si acotados, con el frenado suave cerca del
     borde). Al soltar no pasa nada especial: el offset se queda
     donde quedó, listo para seguir arrastrando la próxima vez.
     --------------------------------------------------------- */
  canvas.addEventListener('pointerdown', function (e) {
    // Quien pide menos animación no arrastra: es movimiento de sobra,
    // y además el bucle continuo (el que repinta el arrastre) ni
    // siquiera corre para esa persona (ver "arrancar()" más abajo).
    if (!window.__modoEspacio || reducido) return;
    arrastrando = true;
    volviendo = false;
    origenX = e.clientX - crudoX;
    origenY = e.clientY - crudoY;
    canvas.classList.add('arrastrando');
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    }
  });

  canvas.addEventListener('pointermove', function (e) {
    if (!arrastrando) return;
    crudoX = e.clientX - origenX;
    crudoY = e.clientY - origenY;
    panX = elastico(crudoX, RANGO_PAN);
    panY = elastico(crudoY, RANGO_PAN);
  });

  function soltarArrastre() {
    arrastrando = false;
    canvas.classList.remove('arrastrando');
  }
  canvas.addEventListener('pointerup', soltarArrastre);
  canvas.addEventListener('pointercancel', soltarArrastre);

  /* ---------------------------------------------------------
     PARALAX CON EL MOUSE
     Escucha el mouse en toda la ventana (no solo el canvas, que
     tiene pointer-events:none casi siempre) y guarda la posición
     relativa al centro, de -1 a 1. dibujar() la suaviza y la usa
     para correr cada capa un poco (ver DEFINICION_CAPAS arriba).
     --------------------------------------------------------- */
  if (tieneMouse && !reducido) {
    window.addEventListener('mousemove', function (e) {
      mouseObjetivoX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseObjetivoY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  leerColores();
  medir();
  dibujar();
  arrancar();

  if (reducido) {
    // Sin animación continua, el scroll también repinta la posición estática
    window.addEventListener('scroll', function () { dibujar(); }, { passive: true });
  }
  window.addEventListener('resize', pedirResize);

  // No gastar batería/CPU animando una pestaña que no se ve
  document.addEventListener('visibilitychange', function () {
    pausado = document.hidden;
    if (pausado) frenar(); else arrancar();
  });
})();


/* ------------------------------------------------------------
   VISIBILIDAD DEL BOTÓN "VER LAS ESTRELLAS"

   Solo se ve mientras la sección de proyectos está en pantalla (en el
   home es ".recientes"; en ux-ui.html, el bento grid ".bento-grid";
   en el resto de páginas de categoría sin proyectos todavía, ".projects"):
   aparece con un fundido apenas asoma y desaparece apenas se pierde
   de vista, tanto para arriba como para abajo. El resto del tiempo
   (Hello, Skills, contacto, footer...) queda oculto.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var boton = document.getElementById('boton-espacio');
  var proyectos = document.querySelector('.recientes, .projects, .bento-grid');
  if (!boton || !proyectos) return;

  var observador = new IntersectionObserver(function (entradas) {
    boton.classList.toggle('es-visible', entradas[0].isIntersecting);
  }, { threshold: 0 });

  observador.observe(proyectos);
})();


/* ------------------------------------------------------------
   BOTÓN "VER LAS ESTRELLAS"

   Flotante, va con el scroll (position: fixed en el CSS). Al
   tocarlo, esconde TODO el contenido de la página (header, main,
   footer) y deja solo el fondo animado de puntos/cometas a pantalla
   completa. El propio botón nunca se esconde: es la única forma de
   volver.

   "window.__modoEspacio" es la señal que lee el fondo animado (ver
   más arriba en este mismo archivo) para saber que tiene que meter
   más cometas y algunos destellos extra.
   ------------------------------------------------------------ */

(function () {
  'use strict';

  var boton = document.getElementById('boton-espacio');
  if (!boton) return;

  var raiz = document.documentElement;
  window.__modoEspacio = false;

  function actualizarTexto(activo) {
    boton.querySelectorAll('[data-estado]').forEach(function (span) {
      span.hidden = span.dataset.estado !== (activo ? 'volver' : 'ver');
    });
  }

  function activar(si) {
    window.__modoEspacio = si;
    raiz.classList.toggle('modo-espacio', si);
    boton.setAttribute('aria-pressed', si ? 'true' : 'false');
    actualizarTexto(si);

    // Si el botón estaba "anclado" arriba del footer (con un "top" en
    // línea, ver "VISIBILIDAD DEL BOTÓN"), ESE estilo en línea le
    // gana al "position: fixed" del CSS de acá abajo y el botón queda
    // fuera de pantalla. Se limpia para que siempre vuelva a su lugar
    // fijo de siempre mientras está en modo espacio.
    if (si) {
      boton.classList.remove('anclado');
      boton.style.top = '';
    }

    // Nadie puede tabular hasta contenido invisible mientras está
    // activo (además de estar tapado, ver .modo-espacio en el CSS)
    document.querySelectorAll('.site-header, main, .site-footer').forEach(function (el) {
      el.inert = si;
    });
  }

  boton.addEventListener('click', function () {
    activar(!window.__modoEspacio);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && window.__modoEspacio) activar(false);
  });
})();
