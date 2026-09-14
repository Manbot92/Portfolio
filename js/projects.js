/* ============================================================
   PROYECTOS — acá listas las imágenes de cada carrusel.
   ============================================================

   CÓMO AGREGAR UNA IMAGEN A UN PROYECTO:

   1. Copia el archivo dentro de la carpeta del proyecto
      (ej: assets/projects/doqmind-platform/).

   2. Agrega una línea a su lista "images", así:

         { file: 'nombre-del-archivo.png', caption: 'Texto bajo la imagen' },

      - "file"    = el nombre EXACTO del archivo, con su extensión.
      - "caption" = descripción de la imagen. YA NO SE MUESTRA en pantalla,
        pero sigue haciendo falta: es lo que leen los lectores de pantalla
        y lo que aparece si la imagen no carga. Descríbela en pocas
        palabras (ej: "Projects grid view").

   3. Listo. El contador (1/9) se calcula solo contando esta lista,
      y el orden del carrusel es el orden en que están acá.

   Consejo: exporta las capturas en proporción 16:9 para que llenen
   el marco sin bordes vacíos.
   ============================================================ */

const PROJECTS = {

  /* El orden va de lo general a lo particular y termina en la
     configuración: los listados de proyectos, el detalle de uno, los
     módulos, y al final la administración. */
  'doqmind-platform': {
    folder: 'assets/projects/doqmind-platform/',
    images: [
      { file: '01-projects.png',                caption: 'Projects grid view' },
      { file: '02-projects-list-view.png',      caption: 'Projects list view' },
      { file: '04-tasks.png',                   caption: 'Tasks' },
      { file: '05-assets-module.png',           caption: 'Assets module' },
      { file: '06-assets-module-list-view.png', caption: 'Assets module list view' },
    ]
  },

  'doqmind-viewer': {
    folder: 'assets/projects/doqmind-viewer/',
    images: [
      { file: '01-general.jpg',           caption: 'General view' },
      { file: '02-sidepanel-pages.jpg',   caption: 'Side panel pages' },
      { file: '04-separations.jpg',       caption: 'Separations' },
      { file: '11-slider-view.jpg',       caption: 'Slider view' },
      // Esta sigue en PNG: es de pocos colores y en JPEG pesaba MÁS
      { file: '12-barcodes.png',          caption: 'Barcodes' },
    ]
  },

  /* El orden de esta lista es el orden del carrusel. Para reordenarlo,
     mové las líneas de lugar (no hace falta renombrar los archivos). */
  'omega-security': {
    folder: 'assets/projects/omega-security/',
    images: [
      { file: '01-menu-navegacion.jpg',              caption: 'Navigation menu and sections' },
      { file: '02-ingresos-salidas-visitantes.jpg',  caption: 'Entries and exits — visitors' },
      { file: '04-ingreso-visitante-formulario.jpg', caption: 'Visitor check-in form' },
      { file: '06-ingreso-vehicular-manual.jpg',     caption: 'Vehicle check-in — manual entry' },
      { file: '08-correspondencia-entregada.jpg',    caption: 'Mail record — delivered' },
      { file: '10-busqueda-rapida.jpg',              caption: 'Quick search results' },
      { file: '11-minutas.jpg',                      caption: 'Logbook' },
    ]
  },

  /* El orden sigue el relato del sitio: la portada, cómo se armó el
     protocolo, dónde se aplicó y qué se ve en el tablero. */
  'ciat-cgiar-foresight': {
    folder: 'assets/projects/ciat-cgiar-foresight/',
    images: [
      { file: '01-home.jpg',           caption: 'Home' },
      { file: '02-metodologia.jpg',    caption: 'Methodology' },
      { file: '03-paises-piloto.jpg',  caption: 'Pilot countries' },
      { file: '04-dashboard.jpg',      caption: 'Indicators dashboard' },
    ]
  },

  /* El orden sigue el recorrido de compra: entrar, ver el catálogo,
     entrar a un producto, pagar y facturar. */
  'le-grand-frances-bakery': {
    folder: 'assets/projects/le-grand-frances-bakery/',
    images: [
      { file: '01-home.jpg',         caption: 'Home' },
      { file: '02-productos.jpg',    caption: 'Product listing' },
      { file: '03-producto.jpg',     caption: 'Product detail' },
      { file: '04-payment.jpg',      caption: 'Payment' },
      { file: '05-facturacion.jpg',  caption: 'Billing' },
    ]
  },

  /* El orden sigue el recorrido del inversor: entra por los destacados,
     conoce Dubai, mira el barrio, recorre los proyectos y entra al
     detalle de una propiedad. */
  'driven-properties-latam': {
    folder: 'assets/projects/driven-properties-latam/',
    images: [
      { file: '01-destacados.jpg',        caption: 'Featured properties' },
      { file: '02-conoce-dubai.jpg',      caption: 'Why Dubai' },
      { file: '03-barrio-downtown.jpg',   caption: 'Neighbourhood page' },
      { file: '04-proyectos.jpg',         caption: 'Projects for sale' },
      { file: '05-detalle-propiedad.jpg', caption: 'Property detail' },
    ]
  },

  /* ============================================================
     BRANDING — VISUAL COMMUNICATION DESIGN
     ============================================================ */
  'johanna-borrero-pediatria': {
    folder: 'assets/projects/johanna-borrero-pediatria/',
    images: [
      { file: '01.jpg', caption: 'Cover — brand manual' },
      { file: '02.jpg', caption: 'Contents' },
      { file: '03.jpg', caption: 'Section 01 — The brand' },
      { file: '04.jpg', caption: 'Brand essence — the elephant symbol' },
      { file: '05.jpg', caption: 'Voice and tone' },
      { file: '06.jpg', caption: 'Section 02 — The logo' },
      { file: '07.jpg', caption: 'Anatomy of the brand' },
      { file: '08.jpg', caption: 'Authorized logo versions' },
      { file: '09.jpg', caption: 'Clear space and minimum sizes' },
      { file: '10.jpg', caption: 'Isotype in reduced spaces' },
      { file: '11.jpg', caption: 'Section 03 — Color and typography' },
      { file: '12.jpg', caption: 'Color palette' },
      { file: '13.jpg', caption: 'Typography' },
      { file: '14.jpg', caption: 'Section 04 — Applications' },
      { file: '15.jpg', caption: 'Stationery' },
      { file: '16.jpg', caption: 'Embroidery on coats and uniforms' },
      { file: '17.jpg', caption: 'Office and signage' },
      { file: '18.jpg', caption: 'Digital media' },
      { file: '19.jpg', caption: 'Materials for patients' },
      { file: '20.jpg', caption: 'Section 05 — Incorrect uses' },
      { file: '21.jpg', caption: 'Things never to do' },
      { file: '22.jpg', caption: 'Contact and files' },
    ]
  },

  'eme-al-cubo': {
    folder: 'assets/projects/eme-al-cubo/',
    images: [
      { file: '01.jpg', caption: 'Cover — brand manual' },
      { file: '02.jpg', caption: 'Brand essence — the M-cubed symbol' },
      { file: '03.jpg', caption: 'Logo composition — horizontal and vertical lockups' },
      { file: '04.jpg', caption: 'Authorized color versions' },
      { file: '05.jpg', caption: 'Clear space and minimum sizes' },
      { file: '06.jpg', caption: 'Color palette' },
      { file: '07.jpg', caption: 'Typography' },
      { file: '08.jpg', caption: 'Incorrect uses' },
      { file: '09.jpg', caption: 'Business cards' },
      { file: '10.jpg', caption: 'Brochure' },
      { file: '11.jpg', caption: 'Web and digital' },
      { file: '12.jpg', caption: 'Files and approval' },
    ]
  },

  'st-dukes-distillery': {
    folder: 'assets/projects/st-dukes-distillery/',
    images: [
      { file: '01.jpg', caption: 'Cover — brand manual' },
      { file: '02.jpg', caption: 'The brand — from grass to glass' },
      { file: '03.jpg', caption: 'Lockups — primary, horizontal and symbol only' },
      { file: '04.jpg', caption: 'Approved color versions' },
      { file: '05.jpg', caption: 'Clear space and minimum sizes' },
      { file: '06.jpg', caption: 'Colour palette' },
      { file: '07.jpg', caption: 'Typography' },
      { file: '08.jpg', caption: 'Bottle labels' },
      { file: '09.jpg', caption: 'Glassware, plates and napkins' },
      { file: '10.jpg', caption: 'Venue and bar' },
      { file: '11.jpg', caption: 'Business cards and stationery' },
      { file: '12.jpg', caption: 'Misuse' },
    ]
  },

  'the-tech-guys': {
    folder: 'assets/projects/the-tech-guys/',
    images: [
      { file: '01.jpg', caption: 'Cover — brand manual' },
      { file: '02.jpg', caption: 'The brand — your identity is the key' },
      { file: '03.jpg', caption: 'Lockups — primary, stacked and icon' },
      { file: '04.jpg', caption: 'Approved color versions' },
      { file: '05.jpg', caption: 'Clear space and minimum sizes' },
      { file: '06.jpg', caption: 'Colour palette' },
      { file: '07.jpg', caption: 'Typography' },
      { file: '08.jpg', caption: 'Website' },
      { file: '09.jpg', caption: 'Social banners' },
      { file: '10.jpg', caption: 'Brochure' },
      { file: '11.jpg', caption: 'Business cards and stationery' },
      { file: '12.jpg', caption: 'Misuse' },
    ]
  },

  'jesus-i-know-but-who-are-you': {
    folder: 'assets/projects/jesus-i-know-but-who-are-you/',
    images: [
      { file: '01.jpg', caption: 'Front cover' },
      { file: '02.jpg', caption: 'Front and back cover mockup' },
      { file: '03.jpg', caption: 'Title page and foreword spread' },
    ]
  },

  'mastering-your-ocd': {
    folder: 'assets/projects/mastering-your-ocd/',
    images: [
      { file: '01.jpg', caption: 'Front cover' },
      { file: '02.jpg', caption: 'Title page and table of contents spread' },
      { file: '03.jpg', caption: 'Back cover' },
    ]
  },

  /* ============================================================
     3D — BOOTH DESIGN
     Antes eran proyectos separados, uno por cliente. Ahora son un solo
     proyecto ("Bigjonan Studio") con todos los renders en un mismo
     carrusel. El caption de cada imagen es el nombre del cliente: son
     renders únicos, no hay una secuencia de pantallas que describir.
     ============================================================ */
  'bigjonan-studio': {
    folder: 'assets/projects/booth-design/',
    images: [
      { file: 'aht-fehgra.png', caption: 'AHT & FEHGRA' },
      { file: 'bellizzi.png', caption: 'Bellizzi' },
      { file: 'crexell-01.png', caption: 'Crexell' },
      { file: 'crexell-02.png', caption: 'Crexell' },
      { file: 'desbravador.png', caption: 'Desbravador' },
      { file: 'dosivac.png', caption: 'Dosivac' },
      { file: 'eco-cubiertas.png', caption: 'Eco Cubiertas' },
      { file: 'equipel.png', caption: 'Equipel' },
      { file: 'flexseal.png', caption: 'Flexseal' },
      { file: 'full-assistance.png', caption: 'Full Assistance' },
      { file: 'full-lock.png', caption: 'Full Lock' },
      { file: 'hoteles-mas-verdes.png', caption: 'Hoteles más Verdes' },
      { file: 'izajes.png', caption: 'Izajes' },
      { file: 'mirbla.png', caption: 'Mirbla' },
      { file: 'nutrien.png', caption: 'Nutrien' },
      { file: 'proilde.png', caption: 'Proilde' },
      { file: 'rodizio-campo.png', caption: 'Rodizio Campo' },
      { file: 'salto-grande.png', caption: 'Salto Grande' },
      { file: 'uruguay-natural.png', caption: 'Uruguay Natural' },
      { file: 'vaca-valiente.png', caption: 'Vaca Valiente' },
      { file: 'yamana-gold.png', caption: 'Yamana Gold' },
      { file: 'gallery-1.png', caption: 'Gallery 1' },
      { file: 'gallery-2.png', caption: 'Gallery 2' },
    ]
  },

  /* ============================================================
     3D — PRODUCT MODELING
     ============================================================ */
  'amin-by-idraet': {
    folder: 'assets/projects/product-modeling/',
    images: [
      { file: 'amin-by-idraet-01.png', caption: 'Amin by Idraet' },
      { file: 'amin-by-idraet-02.png', caption: 'Amin by Idraet' },
      { file: 'amin-by-idraet-03.png', caption: 'Amin by Idraet' },
      { file: 'amin-by-idraet-04.png', caption: 'Amin by Idraet' },
    ]
  },
  'idraet-argentina': {
    folder: 'assets/projects/product-modeling/',
    images: [
      { file: 'idraet-argentina-01.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-02.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-03.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-04.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-05.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-06.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-07.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-08.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-09.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-10.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-11.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-12.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-13.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-14.png', caption: 'Idraet Argentina' },
      { file: 'idraet-argentina-15.png', caption: 'Idraet Argentina' },
    ]
  }

};
