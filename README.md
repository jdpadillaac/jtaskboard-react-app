# JTaskboard — App de gestión de tareas

Aplicación web tipo Jira para la gestión de tareas. Permite listar, crear,
editar, cambiar el estado y eliminar tareas. Consume un backend
Java/Spring real y está construida con una arquitectura limpia por capas.

> El idioma del código y de la interfaz es **español**.

---

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Cómo levantar el proyecto en local](#cómo-levantar-el-proyecto-en-local)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Qué tener en cuenta al probar](#qué-tener-en-cuenta-al-probar)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Backend y contrato de la API](#backend-y-contrato-de-la-api)
- [Funcionalidades](#funcionalidades)
- [Pruebas](#pruebas)
- [Estado del proyecto](#estado-del-proyecto)

---

## Tecnologías

| Área | Tecnología |
|---|---|
| Build / dev server | Vite 8 |
| UI | React 19 + TypeScript (modo `strict`) |
| Componentes visuales | Material UI (MUI) v9 + Emotion |
| Iconos | `@mui/icons-material` |
| Enrutado | react-router-dom v7 |
| HTTP | axios |
| Editor de descripción | `@mdxeditor/editor` (Markdown WYSIWYG) |
| Pruebas | Vitest + Testing Library + jsdom |
| Calidad | ESLint (incluye reglas de frontera entre capas) |

---

## Requisitos previos

- **Node.js 20.19+** (recomendado 22 LTS o superior). Vite 8 no funciona
  con versiones anteriores.
- **npm** (incluido con Node).

Comprobar la versión instalada:

```bash
node -v
```

---

## Cómo levantar el proyecto en local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno a partir del ejemplo
cp .env.example .env

# 3. Arrancar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en la URL que imprime Vite en consola
(por defecto **http://localhost:5173**).

No hace falta levantar ningún backend localmente: la app consume el
backend ya desplegado (ver [Backend y contrato de la API](#backend-y-contrato-de-la-api)).

---

## Variables de entorno

Se definen en el archivo `.env` (hay una plantilla en `.env.example`):

| Variable | Descripción | Valor en desarrollo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `/api/v1` |

En desarrollo se usa la ruta relativa `/api/v1` para que las peticiones
pasen por el **proxy de Vite** (configurado en `vite.config.ts`), que las
redirige al backend real y evita errores de CORS desde el navegador.

Para apuntar directamente al backend (sin proxy) se usaría la URL
absoluta: `https://jtaskboard.onrender.com/api/v1`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila TypeScript y genera el build de producción (`tsc -b && vite build`) |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Ejecuta ESLint (incluye las reglas de frontera entre capas) |
| `npm test` | Ejecuta toda la suite de pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas en modo observación |

---

## Qué tener en cuenta al probar

- **El backend está desplegado en Render (plan gratuito).** Si lleva un
  rato sin uso, entra en reposo: la **primera petición puede tardar entre
  30 y 60 segundos** mientras el servicio "despierta". Las siguientes
  responden con normalidad. Si el listado tarda en cargar al abrir la
  app, es esto — no un error.
- **Proxy de CORS:** en desarrollo todas las llamadas a `/api` las
  redirige Vite al backend. Por eso es importante mantener
  `VITE_API_URL=/api/v1` en el `.env`.
- **Carga diferida:** las páginas de crear y editar cargan el editor
  Markdown (pesado) en un *chunk* aparte; puede haber un instante de
  carga la primera vez que se abren.
- **Diseño responsive:** en pantallas anchas el listado se muestra como
  tabla; en móvil (< 600 px) se muestra como tarjetas.

---

## Arquitectura

Arquitectura limpia pragmática: **3 capas + raíz de composición**. La
regla fundamental es la **regla de dependencia**: las dependencias apuntan
siempre hacia el dominio; el dominio no importa a nadie.

```
domain  ←  data
   ↑         ↑
   └──  presentation  ──┘
            ↑
           app  (raíz de composición — conecta todo)
```

| Capa | Responsabilidad |
|---|---|
| `domain/` | TypeScript puro: entidades e interfaces (puertos). Sin React ni axios. |
| `data/` | Implementa los puertos del dominio: cliente HTTP, DTOs y *mappers*. |
| `presentation/` | React: componentes, páginas, hooks, estilos y etiquetas de UI. |
| `app/` | Raíz de composición: crea las implementaciones y las inyecta. |

**Desacoplamiento:** el dominio define la interfaz `TaskRepository` (el
puerto); `data/` la implementa (`HttpTaskRepository`); la presentación la
recibe por React Context (`useRepositories`) y nunca importa `data/`
directamente. Cambiar el backend implica tocar solo la capa `data/`.

**Alias de imports:** `@domain/*`, `@data/*`, `@presentation/*`, `@app/*`
apuntan a `src/{domain,data,presentation,app}/*`.

**Fronteras vigiladas por ESLint:**
- `src/domain/**` no puede importar de `@data`, `@presentation` ni `@app`.
- `src/presentation/**` no puede importar de `@data`.

---

## Estructura de carpetas

```
src/
├── domain/                  Entidades y puertos (TypeScript puro)
│   └── task/
│       ├── task.ts          Task, TaskStatus, NewTask, TASK_STATUSES, límites
│       └── task-repository.ts   Interfaz TaskRepository (el puerto)
│
├── data/                    Implementación de los puertos
│   ├── http/
│   │   └── http-client.ts   Instancia de axios
│   └── task/
│       ├── task.dto.ts      Forma de los datos de la API
│       ├── task.mapper.ts   Conversión DTO ↔ entidad
│       └── http-task-repository.ts   HttpTaskRepository
│
├── presentation/            Capa de React
│   ├── components/          ConfirmDialog, StatusSelect, TaskList, TaskCard,
│   │                        TaskRow, TaskForm, MarkdownEditor, estados, etc.
│   ├── pages/               HomePage, CreateTaskPage, EditTaskPage
│   ├── hooks/               useTasks
│   ├── labels/              Textos de UI (STATUS_LABELS)
│   └── styles/              theme.ts (tema de MUI), index.css
│
├── app/                     Raíz de composición
│   ├── composition-root.ts  Crea HttpTaskRepository
│   ├── repositories-context.ts · repositories.tsx · useRepositories.ts
│
└── test/                    Utilidades de prueba (fake del repositorio, setup)
```

### Rutas

| Ruta | Vista |
|---|---|
| `/` | Listado de tareas |
| `/tasks/new` | Crear tarea |
| `/tasks/edit` | Editar tarea (recibe la tarea por estado de navegación) |

---

## Backend y contrato de la API

- **URL base:** `https://jtaskboard.onrender.com`
- **OpenAPI:** `/api-docs` — **Swagger UI:** `/swagger-ui/index.html`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/tasks` | Lista todas las tareas |
| `POST` | `/api/v1/tasks` | Crea una tarea — body `{ title, description }` |
| `PUT` | `/api/v1/tasks/{id}` | Actualiza una tarea — body `{ title, description }` |
| `PATCH` | `/api/v1/tasks/{id}/status` | Cambia el estado — body `{ status }` |
| `DELETE` | `/api/v1/tasks/{id}` | Elimina una tarea |

**Modelo `TaskResponse`:** `{ id (uuid), taskKey, title, description, status, createdAt }`

- `status`: `TODO` · `IN_PROGRESS` · `DONE`
- Límites: `title` ≤ 100 caracteres · `description` ≤ 32767 caracteres

---

## Funcionalidades

- ✅ **Listar tareas** — página principal responsiva (tabla en escritorio,
  tarjetas en móvil).
- ✅ **Crear tarea** — formulario con editor Markdown para la descripción.
- ✅ **Editar tarea** — modifica título y descripción.
- ✅ **Cambiar estado** — selector tipo Jira: al pulsar la etiqueta de
  estado se despliega el menú de estados; el cambio se aplica de forma
  optimista y se revierte si el servidor falla.
- ✅ **Eliminar tarea** — con diálogo de confirmación.

---

## Pruebas

El proyecto incluye pruebas unitarias con **Vitest** y **Testing Library**
que cubren cada operación en la capa de datos y en la de presentación.

```bash
npm test            # ejecuta toda la suite
npm run test:watch  # modo observación
```

La arquitectura por puertos facilita las pruebas: los componentes y hooks
reciben un **doble de prueba** del `TaskRepository` (en `src/test/`) por
React Context, sin necesidad de mockear la red.

---

## Estado del proyecto

**Implementado:** listado responsive, crear, editar, cambiar estado y
eliminar tareas; UI con Material UI; suite de pruebas unitarias.

**Pendiente:** página con un gráfico de tareas por estado (no incluida en
esta entrega).

Para más contexto técnico y convenciones del proyecto, ver `CLAUDE.md`.
