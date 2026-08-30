# IPSOPOL — Dashboard Ejecutivo de Gestión

Prototipo funcional de dashboard institucional para visualizar y analizar
indicadores de gestión: actividades realizadas, atenciones médicas,
cortesías otorgadas, distribución por servicio, top de especialidades y
detalle diario por especialidad.

Período de referencia: **22–28 de agosto de 2026** (4ta semana de agosto 2026).

---

## 1. Requisitos

- Node.js 18 o superior (recomendado 20+).
- npm 9 o superior.

## 2. Instalación

```bash
npm install
```

## 3. Ejecución en desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en:

```
http://localhost:5173
```

## 4. Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos estáticos optimizados.
Para previsualizar ese build localmente:

```bash
npm run preview
```

## 5. Login (demostración)

La pantalla de acceso acepta **cualquier usuario/contraseña** que cumplan:

- Usuario: mínimo 3 caracteres.
- Contraseña: mínimo 4 caracteres.

La sesión se guarda en `sessionStorage` únicamente para efectos del
prototipo (se pierde al cerrar la pestaña o hacer clic en "Salir").

**Esto NO es un sistema de autenticación real.** No se validan
credenciales contra ninguna base de datos ni se cifra nada. Un despliegue
en producción requiere, como mínimo:

```
Frontend (React)
    ↓
Backend (API con autenticación real)
    ↓
Base de datos
```

con:

- Hash de contraseñas (bcrypt/argon2).
- HTTPS obligatorio.
- Cookies seguras (`HttpOnly`, `Secure`, `SameSite`).
- Gestión de sesiones con expiración.
- Roles y permisos.
- Rate limiting contra fuerza bruta.
- Registro de auditoría (quién entró, cuándo, desde dónde).

## 6. Exportación de datos

- **Descargar PDF**: captura el dashboard completo (`html2canvas` +
  `jsPDF`) y genera un PDF A4 paginado, sin botones ni controles.
- **Exportar PNG**: genera una imagen PNG en alta resolución del
  dashboard completo.
- **Imprimir**: usa `window.print()` con estilos `@media print`
  dedicados que ocultan botones/controles y conservan logo, KPIs,
  gráficos, tabla y pie de página.
- **Copiar datos**: copia la tabla de especialidades al portapapeles en
  formato TSV, lista para pegar en Excel/Sheets.

## 7. Carga de archivos (CSV / Excel)

Desde el botón **"Cargar datos"** se puede importar un archivo `.csv`,
`.xlsx` o `.xls` (máx. 10MB) para reemplazar la tabla de especialidades.

Flujo interno:

```
Archivo → Validación (extensión y tamaño) → Parseo (xlsx) →
Normalización (columnas de día/total) → Actualización de estado →
Tabla
```

Requisitos del archivo:

- Debe tener una columna reconocible como `especialidad`, `nombre`,
  `servicio` o `categoria`.
- Columnas de día opcionales: `lun`, `mar`, `mie`/`mié`, `jue`, `vie`
  (o sus nombres completos: `lunes`, `martes`, etc.).
- Columna `total` opcional; si no está, se calcula sumando los días
  detectados.

Un archivo inválido o mal formado **nunca rompe la aplicación**: se
muestra un mensaje de error comprensible y el dashboard sigue
funcionando con los datos anteriores.

> Nota: cargar un archivo nuevo solo reemplaza la **tabla de
> especialidades**. Los KPIs principales (2.940 actividades, 776
> atenciones médicas, 10 cortesías) son datos oficiales fijos del
> período y no se recalculan a partir del archivo cargado, para evitar
> inconsistencias con las cifras institucionales reportadas.

## 8. Integridad de los datos — regla obligatoria

El total oficial de actividades realizadas del período es **2.940**, y
así se muestra siempre en el KPI principal. El desglose por servicio
(Médicos 776 + Funerarios 348 + Citas 982 + Jubilados 25 + Club 809)
suma exactamente 2.940.

El desglose **diario** suministrado (Lun 472, Mar 308, Mié 393, Jue 443,
Vie 647) suma **2.263**, no 2.940. Esta diferencia (677) es un dato real
de la fuente entregada.

**El dashboard no la corrige, no la reconcilia ni inventa las 677
actividades faltantes.** El gráfico diario usa exactamente los 5
valores suministrados, y junto a él se muestra esta nota:

> "El desglose diario corresponde a los registros diarios suministrados
> y no reconcilia con el total general oficial."

Esta regla debe respetarse en cualquier modificación futura del
proyecto: **nunca alterar silenciosamente los datos entregados para que
"cuadren".**

## 9. Arquitectura del proyecto

```
ipsopol-dashboard/
├── index.html                 # Entry point de Vite (raíz, no en public/)
├── public/
│   ├── logo-ipsopol.png        # Placeholder de logo — reemplazar por el real
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── WelcomeDashboard.jsx
│   │   ├── Header.jsx
│   │   ├── KPICards.jsx
│   │   ├── DataTable.jsx
│   │   ├── UploadData.jsx
│   │   ├── Footer.jsx
│   │   └── Charts/
│   │       ├── LineChart.jsx
│   │       ├── BarChartHorizontal.jsx
│   │       ├── PieChart.jsx
│   │       └── BarChart.jsx
│   ├── data/
│   │   ├── initialData.js      # Fuente central de datos + reglas de integridad
│   │   ├── actividades.json
│   │   ├── especialidades.json
│   │   └── cortesias.json
│   ├── utils/
│   │   ├── dataProcessor.js    # Parseo/normalización CSV-XLSX, formateo
│   │   ├── exportPDF.js
│   │   ├── exportPNG.js
│   │   ├── exportUtils.js      # Imprimir, copiar al portapapeles
│   │   └── validation.js       # Validación de login y archivos
│   ├── styles/
│   │   ├── globals.css
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   ├── App.jsx                 # Orquesta login → presentación → dashboard
│   └── main.jsx
├── package.json
├── vite.config.js
├── jsconfig.json
├── .env.example
└── .gitignore
```

**Desviación deliberada de la estructura solicitada:** `index.html` vive
en la raíz del proyecto, no en `public/`. Es un requisito de Vite (el
archivo dentro de `public/` no se usaría como punto de entrada); todo lo
demás sigue la estructura pedida.

## 10. Responsive

Breakpoints implementados en `src/styles/responsive.css`:

| Rango | Comportamiento |
|---|---|
| ≤479px | Una columna, cards apiladas, tabla con scroll horizontal |
| 480–767px | Una columna, toolbar de tabla apilado |
| 768–1023px | KPIs y gráficos a una columna, header más compacto |
| 1024–1399px | Layout estándar de escritorio (3 KPIs, 2 columnas de gráficos) |
| ≥1400px | Contenedor ampliado para monitores grandes/ultrawide |

Probado conceptualmente en 360, 390, 480, 768, 1024, 1280, 1440, 1920 y
2560px de ancho.

## 11. Accesibilidad

- Roles/atributos ARIA en formulario de login, tabla y notificaciones
  (`role="alert"`, `role="status"`, `aria-invalid`, `aria-describedby`,
  `aria-sort`).
- `alt` descriptivo en imágenes/logo.
- Foco visible (`:focus-visible`) en todos los elementos interactivos.
- Navegación por teclado en encabezados de tabla ordenables
  (`tabIndex`, `onKeyDown` con Enter/Espacio).
- Contraste de color ajustado a la paleta institucional.
- HTML semántico (`header`, `main`, `nav`, `section`, `article`,
  `footer`).

## 12. Datos y próximos pasos

- Los datos actuales son los oficiales suministrados para el período
  22–28 de agosto de 2026 y están centralizados en `src/data/`.
- La arquitectura separa UI, datos, procesamiento, exportación,
  validación y estado, dejando el proyecto preparado para reemplazar
  `src/data/*.json` por llamadas a una API/backend real sin reescribir
  los componentes.
- Arquitectura futura sugerida para producción:

```
React (frontend)
    ↓
API REST/GraphQL
    ↓
Backend (autenticación, autorización, reglas de negocio)
    ↓
Base de datos
```

## 13. Limitaciones conocidas del prototipo

- El login es solo de demostración (ver sección 5).
- El logo es un placeholder generado (`IPSOPOL` sobre fondo azul);
  debe sustituirse por el logotipo institucional real en
  `public/logo-ipsopol.png` manteniendo el mismo nombre de archivo.
- La carga de CSV/XLSX solo reemplaza la tabla de especialidades, no
  los KPIs oficiales (ver sección 7).
- No hay persistencia real de datos entre sesiones (todo vive en el
  estado de React y `sessionStorage`).
