# Portfolio — Cristian Vélez

## Qué es esto

Portfolio personal de **Cristian Vélez, Product UX/UI Designer**. Sitio estático que se
publica en **Netlify**. El diseño de referencia vive en **Figma** y es la fuente de verdad
visual: si el código y el Figma no coinciden, gana el Figma.

## Contexto de la persona con la que trabajas

Cristian es **diseñador UX/UI, no desarrollador**. Esto cambia cómo se trabaja acá:

- Explicar en español, sin jerga técnica, o traduciendo la jerga cuando aparece.
- No asumir que sabe usar terminal, npm, git o build tools.
- Preferir siempre la solución que él pueda editar solo después (texto plano legible,
  archivos bien nombrados, comentarios en el HTML que digan qué es cada bloque).
- Antes de introducir cualquier herramienta nueva, explicar qué problema resuelve y qué
  costo de mantenimiento tiene.
- Al hablar de layout, tipografía o espaciado, usar vocabulario de diseño (auto layout,
  grid, escala tipográfica, tokens) — eso sí lo domina.

## Stack (decidido)

**HTML + CSS + JavaScript puro. Sin frameworks, sin build, sin instalar nada.**

Razones: el sitio son pocas vistas, Cristian puede abrir cualquier archivo y editar textos,
y Netlify publica la carpeta tal cual arrastrándola al navegador.

**No introducir** React, Astro, Tailwind, npm, bundlers ni preprocesadores sin que él lo
pida explícitamente.

## Estructura de archivos

```
Landing/
├── index.html                  # Home
├── css/
│   ├── tokens.css              # Variables: colores, tipografía, espaciado (desde Figma)
│   └── styles.css              # Estilos del sitio
├── js/
│   └── main.js                 # Menú móvil, animaciones de scroll, etc.
├── assets/
│   ├── img/                    # Íconos y assets del sitio
│   ├── perfil/                 # Foto de Cristian (cristian.jpg/.png/.webp)
│   ├── projects/               # Una carpeta por proyecto, con sus capturas
│   │   └── doqmind-platform/
│   └── cv/                     # PDF del CV
├── js/projects.js              # Lista de imágenes y captions de cada carrusel
└── _landing-v1-referencia/     # Versión vieja. NO tocar, NO publicar. Solo referencia.
```

`_landing-v1-referencia/` guarda la landing anterior. Sirve para reutilizar **textos y
datos** (bio, experiencia, contacto), no estilos.

## Cómo trabajar con el Figma

El diseño está repartido en **más de un archivo de Figma**. Nodos ya implementados:

| Sección | Archivo (fileKey) | Nodo |
|---|---|---|
| Header / navegación | `XeaOjLgdMnxQojsFANtGua` (Untitled) | `2002:31` |
| Hello! (hero) | `0XJzeAXKgCdY74cjjeossm` (Projects) | `2139:3922` |

**Tipografías del diseño** (todas disponibles en Google Fonts): Alexandria (400/700),
Archivo (600), Archivo Black, Asta Sans (400).

- Cristian pasa links con `node-id` (clic derecho sobre el frame → *Copy link to selection*).
- Se usan las herramientas MCP de Figma: `get_metadata` para ver la estructura,
  `get_screenshot` para ver el frame, `get_design_context` para extraer código de referencia.
- El código que devuelve Figma es **referencia, no producto final**: hay que adaptarlo a
  HTML semántico + los tokens de este proyecto. Nunca pegarlo tal cual.
- Antes de codear una vista, extraer primero los **tokens** (colores, tipos, espaciados) a
  `css/tokens.css`, y recién después maquetar.

## Especificaciones de diseño dadas por Cristian

Valores que él definió y que no se deducen del Figma ni del código. Mandan sobre
cualquier estimación.

- **Descripción en las cards de proyecto (`.project-desc`)**:
  - Interlineado **130%** (`line-height: 1.3`).
  - Color del texto **`#696969`** (el token `--color-muted`).
  - **Debe llenar TODO el ancho disponible de la card. Sin `max-width`, nunca.**
    Esto está decidido y no se discute más. Se probó un tope de `65ch` por
    medida de lectura y **Cristian lo descartó**: no volver a proponerlo ni a
    agregarlo "por buenas prácticas tipográficas". Si en algún momento aparece
    un `max-width` en `.project-desc`, es un error: bórralo.
- **Textos del carrusel en color `#696969`**: el pie de foto de cada captura
  (`.gallery-caption`) y el contador 1/X (`.gallery-counter`).

## Nombres de archivo de los assets — regla operativa

Cristian sube imágenes con el nombre que le resulte natural (`Cristian.png`,
`Assets Module list view.png`). **Al recibirlas hay que renombrarlas a minúsculas
con guiones, sin espacios ni acentos**, y actualizar las referencias.

Por qué importa: Windows no distingue mayúsculas, pero el servidor de Netlify (Linux)
sí. Un archivo `Cristian.png` referenciado como `cristian.png` **funciona en local y
falla al publicar**, sin ningún aviso. Es un error que no se ve hasta que el sitio
está en vivo.

Ojo: `Rename-Item` en Windows no permite cambiar solo mayúsculas; hay que renombrar
a un nombre temporal y luego al definitivo.

## Reglas de código

- **HTML semántico**: `header`, `nav`, `main`, `section`, `article`, `footer`. Un solo `h1`
  por página, jerarquía de headings correcta.
- **Comentarios en español** marcando cada sección del HTML, para que Cristian encuentre
  dónde editar.
- **Nada de valores sueltos en CSS**: todo color, tamaño de fuente y espaciado sale de una
  variable de `tokens.css`.
- **Accesibilidad**: contraste AA mínimo, `alt` real en todas las imágenes, foco visible en
  links y botones, navegación usable con teclado.
- **Performance**: imágenes en WebP, `loading="lazy"` fuera del primer viewport, sin
  librerías externas salvo necesidad justificada.
- Idioma del sitio: **español** (`<html lang="es">`).

## Responsive — regla no negociable

**Toda sección que se maquete tiene que funcionar en celular, tablet y desktop. Sin
excepciones y sin dejarlo "para después".** Una vista no está terminada hasta que se ve
bien en los tres tamaños.

- **Mobile first**: el CSS base se escribe para celular y se va agrandando con
  `@media (min-width: ...)`. Nunca al revés.
- **Breakpoints del proyecto**:
  - base — celular (hasta 599px)
  - `min-width: 600px` — tablet
  - `min-width: 1024px` — desktop (acá van las medidas exactas del Figma)
- **El Figma normalmente solo trae desktop (1440px).** Cuando falte el frame mobile:
  1. Adaptar con criterio de diseño (apilar columnas, reducir espaciados, ocultar lo
     accesorio, hacer scroll horizontal en filas largas).
  2. **Decírselo a Cristian explícitamente**: qué se decidió y por qué, para que él valide
     o pase el frame mobile y se haga fiel al diseño.
- **Nunca** anchos fijos en px para contenedores. Usar `max-width` + `width: 100%`, `%`,
  `rem`, `clamp()`, flexbox y grid.
- Imágenes siempre `max-width: 100%`.
- Tipografías que escalan con `clamp()` cuando el diseño lo permita.
- Áreas táctiles de mínimo 44×44px en móvil (links, botones, ítems de menú).
- **Nada de scroll horizontal en el body.** Si un bloque es más ancho que la pantalla
  (tablas, filas de tarjetas), ese bloque scrollea dentro de sí mismo con `overflow-x: auto`.
- **Verificar antes de dar por cerrada una vista**: medir en el navegador a 375px, 768px y
  1440px de ancho, y confirmar que no se rompe nada ni aparece scroll horizontal.

## Publicación en Netlify

Método: **drag & drop** en https://app.netlify.com/drop — se arrastra la carpeta del
proyecto y queda publicada. Para actualizar, se vuelve a arrastrar.

- El archivo de entrada debe llamarse `index.html` y estar en la raíz.
- Rutas relativas siempre (`css/styles.css`, no `/css/styles.css` ni rutas de Windows).
- Si más adelante se quiere formulario de contacto: **Netlify Forms** (funciona sin backend,
  solo requiere `data-netlify="true"` en el `<form>`).
- El dominio gratis es `nombre.netlify.app`; se puede conectar un dominio propio después.

## Datos reales de Cristian (para no inventarlos)

- **Rol**: Product / UX-UI Designer
- **Email**: velezcristian92@gmail.com
- **Teléfono**: (+57) 310 444 7785
- **Behance**: https://www.behance.net/Crisvelez
- **Experiencia**: UX/UI Designer en Cafeto Software (Cali, 2020–presente);
  Visual Communications Team Lead en CIDS (Cali, 2016–2019)
- **Educación**: Diseño Industrial, Universidad Icesi (2015);
  Certificado UX/UI, Coder House Buenos Aires (2021)
- **Idiomas**: Español nativo, Inglés B2

No inventar proyectos, métricas, clientes ni testimonios. Si falta contenido, preguntarle.

## Estado del proyecto

- [x] Landing anterior archivada en `_landing-v1-referencia/`
- [x] Stack decidido: HTML/CSS/JS puro
- [x] Tokens del header extraídos a `css/tokens.css`
- [x] Header / navegación maquetado (Figma node `2002:31`)
- [x] Sección Hello! (hero) — Figma node `2139:3922`
- [x] Sección Projects — tarjeta + carrusel (proyecto 1: DOQMIND platform)
- [ ] Cargar las capturas reales de DOQMIND platform
- [ ] Agregar el resto de los proyectos
- [ ] Sección Work experience
- [ ] Sección Get in touch
- [ ] Definir e implementar vistas de proyecto
- [ ] Publicar en Netlify
