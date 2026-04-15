# Playwright Automation Framework — Screenplay Pattern

> **Autor:** Jairo Alonso Osorio Cruz — Ingeniero de Software QA Senior
> **Stack:** Playwright · TypeScript · Screenplay Pattern
> **APIs bajo prueba:** [DummyJSON](https://dummyjson.com) (API REST) · [DemoBlaze](https://www.demoblaze.com) (UI)

---

## Importancia del proyecto

Este proyecto demuestra cómo construir un framework de automatización de pruebas **profesional, escalable y mantenible** aplicando el **Screenplay Pattern**, un patrón de diseño orientado a actores que resuelve los problemas clásicos de los frameworks basados en Page Object Model (POM):

| Problema con POM | Solución con Screenplay |
|---|---|
| Clases God-Object con demasiadas responsabilidades | Cada Task/Question tiene una única responsabilidad |
| Tests acoplados a la implementación técnica | El test describe **qué hace el usuario**, no cómo lo hace |
| Difícil reutilización entre proyectos | Abilities, Tasks y Questions son componentes intercambiables |
| Legibilidad baja para no técnicos | Sintaxis expresiva: `actor.attemptsTo(...)` / `actor.asks(...)` |

El framework cubre dos capas de prueba completamente aisladas:
- **API REST** → autenticación, consulta de perfil, creación y actualización de productos contra DummyJSON.
- **UI end-to-end** → flujo de registro de usuarios en DemoBlaze con Chromium.

---

## Prerrequisitos

| Herramienta | Versión mínima | Notas |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18 LTS o superior | Incluye `npm` |
| npm | 9 o superior | Viene con Node.js |
| Git | cualquier versión reciente | Para clonar el repositorio |
| Chromium | instalado por Playwright | Se descarga automáticamente en el paso de instalación |

> No se requiere instalar ningún navegador manualmente. Playwright descarga sus propios binarios.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd test2
```

### 2. Instalar dependencias de Node.js

```bash
npm install
```

### 3. Instalar los navegadores de Playwright

```bash
npx playwright install chromium
```

> Si deseas instalar todos los navegadores disponibles (Chromium, Firefox, WebKit):
> ```bash
> npx playwright install
> ```

### 4. Configurar las variables de entorno

Crea o edita el archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# URL base de la API REST bajo prueba
BASE_URL=https://dummyjson.com

# URL base de la aplicación web bajo prueba
UI_BASE_URL=https://www.demoblaze.com

# Credenciales de prueba (DummyJSON)
TEST_USERNAME=emilys
TEST_PASSWORD=emilyspass

# No es necesario completar este campo — se genera automáticamente al correr los tests
ACCESS_TOKEN=
```

> `ACCESS_TOKEN` es escrito automáticamente por el `globalSetup` antes de que arranquen los workers. No es necesario completarlo a mano.

---

## Estructura del proyecto

```
test/
├── .env                          # Variables de entorno (credenciales, URLs, token JWT)
├── playwright.config.ts          # Configuración central: proyectos API y UI, globalSetup
├── package.json
│
├── src/
│   ├── core/
│   │   ├── Actor.ts              # El protagonista: ejecuta Tasks y hace Questions
│   │   ├── Task.ts               # Interfaz base para todas las tareas
│   │   └── Question.ts           # Interfaz base para todas las preguntas
│   │
│   ├── abilities/
│   │   ├── CallApi.ts            # Habilidad: realizar peticiones HTTP (envuelve APIRequestContext)
│   │   └── BrowseTheWeb.ts       # Habilidad: controlar el navegador (envuelve Page)
│   │
│   ├── tasks/
│   │   ├── LoginTask.ts          # POST /auth/login — hace login y persiste el token
│   │   ├── GetProfileTask.ts     # GET /auth/me — consulta el perfil autenticado
│   │   ├── CreateProductTask.ts  # POST /products/add — crea un producto
│   │   ├── UpdateProductTask.ts  # PUT /products/{id} — actualiza un producto
│   │   └── SignUpTask.ts         # UI: flujo completo de registro en DemoBlaze
│   │
│   ├── questions/
│   │   ├── ResponseStatus.ts     # Extrae el código HTTP de una APIResponse
│   │   └── ResponseBody.ts       # Extrae y tipifica el cuerpo JSON de una APIResponse
│   │
│   └── utils/
│       └── TokenManager.ts       # Lee y persiste el JWT en .env y en process.env
│
└── tests/
    ├── api/
    │   ├── global-setup.ts       # Login previo al arranque de workers — escribe el token en .env
    │   ├── tc01-login.spec.ts    # TC-01: Login exitoso y persistencia del token
    │   ├── tc02-get-profile.spec.ts  # TC-02: Obtener perfil con token válido
    │   ├── tc03-create-product.spec.ts  # TC-03: Crear producto autenticado
    │   └── tc04-update-product.spec.ts  # TC-04: Actualizar producto existente
    │
    └── ui/
        └── tc01-signup.spec.ts   # TC-01 UI: Registro exitoso en DemoBlaze
```

### Flujo de datos entre capas

```
Test spec
  └─► Actor.attemptsTo(Task)
        └─► Task.performAs(actor)
              └─► actor.abilityTo<CallApi>(CallApi)  ←── habilidad inyectada en el spec
                    └─► APIRequestContext (Playwright)
                          └─► API REST (DummyJSON)

Test spec
  └─► Actor.asks(Question)
        └─► Question.answeredBy(actor)
              └─► APIResponse → número / objeto JSON tipado
```

---

## Por qué `test.step` en lugar de Cucumber para Gherkin

Este framework implementa la sintaxis **Given / When / Then** directamente con `test.step` de Playwright, en lugar de integrar Cucumber (`@cucumber/cucumber` + archivos `.feature`). Esta decisión es intencional y tiene ventajas concretas:

### 1. Sin fricción de configuración
Cucumber requiere instalar dependencias adicionales (`@cucumber/cucumber`, `@badeball/cypress-cucumber-preprocessor` o equivalente para Playwright), configurar step definitions en archivos separados y mantener sincronizados los archivos `.feature` con el código. Con `test.step` el Gherkin vive dentro del mismo archivo de test, sin configuración extra.

### 2. Tipado TypeScript de extremo a extremo
Los step definitions de Cucumber son funciones anónimas que reciben parámetros como `string`. Con `test.step` las variables (`response`, `status`, `body`) son tipadas en TypeScript y el compilador detecta errores en tiempo de desarrollo, no en tiempo de ejecución.

### 3. Reporte HTML nativo de Playwright
Playwright genera un reporte HTML interactivo que muestra cada `test.step` como un paso numerado con su estado (passed/failed), capturas y trazas de red. Este nivel de detalle es equivalente al reporte de Cucumber sin necesitar configurar una herramienta adicional.

### 4. Compatibilidad total con el Screenplay Pattern
El Screenplay Pattern ya expresa la intención del test en lenguaje de negocio:
```typescript
// Given
alice = Actor.named('Alice').whoCan(new CallApi(request));

// When
response = await alice.attemptsTo(LoginTask.with(username, password));

// Then
expect(await alice.asks(ResponseStatus.of(response))).toBe(200);
```
Agregar Cucumber encima de esto sería redundante — la legibilidad ya está garantizada por el patrón.

### 5. Ejecución y depuración más simples
Con `test.step` se puede correr un test individual con un solo comando, depurarlo en UI mode, o inspeccionarlo en el trace viewer sin necesidad de configurar un runner alternativo.

> **Conclusión:** `test.step` entrega la estructura BDD (Given/When/Then), el reporte visual y la trazabilidad que se esperan de Cucumber, con la ventaja de integrarse nativamente en el ecosistema Playwright sin complejidad adicional.

---

## Comandos para reproducir las pruebas

### Ejecutar todos los tests (API + UI)

```bash
npm test
```

### Ejecutar solo los tests de API (secuencial, worker único)

```bash
npm run test:api
```

### Ejecutar solo los tests de UI

```bash
npm run test:ui
```

### Ejecutar un archivo de test específico

```bash
npx playwright test tests/api/tc01-login.spec.ts
npx playwright test tests/api/tc02-get-profile.spec.ts
npx playwright test tests/api/tc03-create-product.spec.ts
npx playwright test tests/api/tc04-update-product.spec.ts
npx playwright test tests/ui/tc01-signup.spec.ts
```

### Ejecutar un test por nombre (grep)

```bash
npx playwright test --grep "TC-01"
npx playwright test --grep "Login exitoso"
```

### Abrir el modo UI interactivo (recomendado para desarrollo)

```bash
npm run test:ui:mode
```

> En UI mode puedes seleccionar y correr tests individualmente, ver el trace en tiempo real y depurar paso a paso.

### Ver el reporte HTML de la última ejecución

```bash
npx playwright show-report
```

### Ejecutar en modo headed (con ventana del navegador visible)

```bash
npx playwright test --project="Test UI" --headed
```

### Activar modo debug (abre Playwright Inspector)

```bash
npx playwright test tests/ui/tc01-signup.spec.ts --debug
```

---

## Documentación oficial

| Recurso | Enlace |
|---|---|
| Playwright — Documentación oficial | https://playwright.dev/docs/intro |
| Playwright — API de pruebas (APIRequestContext) | https://playwright.dev/docs/api/class-apirequestcontext |
| Playwright — test.step | https://playwright.dev/docs/api/class-test#test-step |
| Playwright — Global Setup | https://playwright.dev/docs/test-global-setup-teardown |
| Playwright — Trace Viewer | https://playwright.dev/docs/trace-viewer |
| DummyJSON — Documentación de la API | https://dummyjson.com/docs |
| DummyJSON — Autenticación (JWT) | https://dummyjson.com/docs/auth |
| DummyJSON — Productos | https://dummyjson.com/docs/products |

---

## Notas adicionales

- El archivo `.env` es rastreado por Git en este proyecto porque contiene únicamente credenciales de prueba de APIs públicas. En proyectos productivos con datos sensibles debe añadirse a `.gitignore`.
- `ACCESS_TOKEN` en `.env` es sobreescrito en cada ejecución de los tests por el `globalSetup`. Su valor en el repositorio puede estar desactualizado esto es esperado.
- Los tests de API corren con `--workers=1` para garantizar el orden TC-01 → TC-02 → TC-03 → TC-04, aunque cada test es autónomo gracias al token gestionado por `globalSetup`.
