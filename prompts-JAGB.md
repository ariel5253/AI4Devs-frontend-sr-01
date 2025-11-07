# Prompts y Desarrollo - AI4DEVS-FRONTEND-SR-01

## Prompt 1: Creación de la Vista Position (Kanban)

**Fecha:** Inicio del proyecto

**Prompt:**
```
Eres un desarrollador senior full-stack experto en React + TypeScript y Node.js.  

Te encuentras trabajando en el proyecto **AI4DEVS-FRONTEND-SR-01**, que ya cuenta con una página "positions" donde se listan las diferentes vacantes de la empresa con filtros y botones "Ver proceso".

Tu misión es **crear la nueva página "position"**, una interfaz tipo **kanban** para visualizar y gestionar los candidatos asociados a una posición específica, consumiendo los endpoints existentes del backend.

──────────────────────────────
📂 **CONTEXTO DEL PROYECTO**
──────────────────────────────

Estructura actual (respetar, no modificar):

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── application/
│   ├── domain/
│   ├── presentation/
│   ├── prompts/
│   ├── routes/
│   └── index.ts
├── .env
└── docker-compose.yml

frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── services/
│   ├── App.tsx
│   └── index.tsx
└── .env
```

──────────────────────────────
⚙️ **VARIABLES DE ENTORNO (ya funcionales)**
──────────────────────────────

```
DB_PASSWORD=D1ymf8wyQEGthFR1E9xhCq
DB_USER=LTIdbUser
DB_NAME=LTIdb
DB_PORT=5441
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
```

**No modificar estas variables.**  
El proyecto ya tiene docker-compose ejecutado y una BD accesible.

──────────────────────────────
📖 **HISTORIA DE USUARIO**
──────────────────────────────

**Visualizar y gestionar los candidatos asociados a una posición (Vista Position)**

Como reclutador,  
Quiero poder ver en una vista tipo kanban los candidatos de una posición específica,  
Para gestionar fácilmente en qué fase se encuentra cada candidato.

──────────────────────────────
✅ **CRITERIOS DE ACEPTACIÓN**
──────────────────────────────

1. La vista `/position/:id` debe mostrar:
   - Título de la posición (`positionName`)
   - Flecha de retorno al listado de posiciones (usa React Router `useNavigate`)

2. Mostrar las fases del proceso (entrevista) como **columnas kanban**.
   - Cada columna representa una fase (por ejemplo: "Initial Screening", "Technical Interview", "Manager Interview")

3. Cada **tarjeta** representa un candidato, mostrando:
   - Nombre completo (`fullName`)
   - Puntuación promedio (`averageScore`) mediante iconos o puntos visuales.

4. Permitir **arrastrar y soltar** (drag & drop) las tarjetas entre columnas:
   - Al soltar una tarjeta, llamar a `PUT /candidates/:id/stage` enviando el nuevo `interview_step_id`.

5. Mostrar **indicador de carga** mientras se obtiene la información.

6. En caso de error, mostrar mensaje claro ("Error al obtener los datos del proceso").

7. Diseño responsivo:
   - En desktop: columnas horizontales.
   - En móvil: fases en vertical (100% ancho).

8. Mantener los elementos globales del layout (menú superior, footer, etc.).

──────────────────────────────
🧱 **BACKEND (si aplica)**
──────────────────────────────

No crear nuevos endpoints.  
Usar los ya existentes:

- `GET /positions/:id/interviewFlow`
- `GET /positions/:id/candidates`
- `PUT /candidates/:id/stage`

──────────────────────────────
🎨 **FRONTEND — NUEVA VISTA**
──────────────────────────────

1. Crear archivo `frontend/src/components/PositionBoard.tsx`:
   - Obtiene el `id` de la posición desde la URL (React Router).
   - Hace dos peticiones paralelas:
     - `GET /positions/:id/interviewFlow`
     - `GET /positions/:id/candidates`
   - Usa estado local para:
     - `positionName`
     - `steps` (array con fases del proceso)
     - `candidates` (array con candidatos)
   - Usa librería `react-beautiful-dnd` o `@hello-pangea/dnd` para drag & drop.

2. Lógica del kanban:
   - Cada columna = una fase (`interviewStep.name`)
   - Dentro de cada columna, filtrar los candidatos cuyo `currentInterviewStep` coincide con el nombre de la fase.
   - En el evento `onDragEnd`, detectar si cambió de columna:
     - Llamar PUT `/candidates/:id/stage` con el nuevo `interview_step_id`
     - Actualizar estado local (`setCandidates`)

3. Interfaz visual:
   - Título principal arriba: `${positionName} Position`
   - Flecha de retorno (icono ←) con `useNavigate(-1)`
   - Grid horizontal de columnas (scroll horizontal si overflow)
   - Tarjeta del candidato:
     - Fondo blanco, borde suave, sombra ligera.
     - Nombre completo.
     - Indicadores de puntuación (círculos verdes según `averageScore`).
   - Responsivo con Tailwind CSS o CSS modules.

4. Añadir ruta en `frontend/src/App.tsx`:
   ```tsx
   <Route path="/position/:id" element={<PositionBoard />} />
   ```

Crear servicio en `frontend/src/services/positionService.ts`:
```ts
export const getInterviewFlow = (id: string) => fetch(`${API_URL}/positions/${id}/interviewFlow`);
export const getCandidates = (id: string) => fetch(`${API_URL}/positions/${id}/candidates`);
export const updateCandidateStage = (candidateId: string, newStepId: string) =>
  fetch(`${API_URL}/candidates/${candidateId}/stage`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId: candidateId, currentInterviewStep: newStepId })
  });
```

Mantener consistencia visual con la vista de listado (positions).
```

**Resultado:** Se creó la vista kanban completa con drag & drop funcional.



## Prompt 6: Mensaje cuando No Hay Candidatos

**Prompt:**
```
pero en la posicion 2 no esta mostrando el mensaje en la interfaz de que no hay candidatos
```

**Resultado:** 
- Se añadió lógica para mostrar mensaje "No hay candidatos en esta fase" cuando una columna está vacía
- Se mejoraron los estilos CSS para hacer el mensaje más visible
- Se corrigió la estructura del Droppable para renderizar correctamente el mensaje

---

## Prompt 7: Manejo de Posiciones Cerradas

**Prompt:**
```
pero es que necesito cumplir con la funcionalidad siguiente tambien: 

Queremos que al hacer clic en el botón "Ver proceso" de cualquiera de las posiciones, nos lleve a la vista de detalle de cada posición, denominada "position".o sea en la priemra ya se cumple, y si esta cerrada cada posicion pues mostarr un mensaje o algo asi mejor, como le hacemos?
```

**Resultado:** 
- Se actualizó el backend para devolver el `status` de la posición
- Se añadió lógica en el frontend para detectar posiciones cerradas
- Se muestra un mensaje informativo cuando la posición está cerrada
- Se deshabilita el drag & drop cuando la posición está cerrada
- Se añadieron estilos visuales para indicar que está deshabilitada

---

## Conclusión

### Resumen de lo Implementado

Se desarrolló exitosamente la **vista Position** con las siguientes características:

#### 1. **Componente Principal: PositionBoard.tsx**
   - Vista kanban completa con drag & drop funcional
   - Integración con React Router para navegación
   - Manejo de estados (loading, error, updating)
   - Actualización optimista del estado

#### 2. **Servicios: positionService.ts**
   - `getInterviewFlow()` - Obtiene el flujo de entrevistas de una posición
   - `getCandidates()` - Obtiene los candidatos asociados a una posición
   - `updateCandidateStage()` - Actualiza la etapa de un candidato

#### 3. **Funcionalidades Implementadas**
   - ✅ Vista kanban con columnas por fase de entrevista
   - ✅ Drag & drop entre columnas
   - ✅ Indicadores de puntuación visuales (círculos)
   - ✅ Contador de candidatos por fase
   - ✅ Mensaje cuando no hay candidatos en una fase
   - ✅ Manejo de errores (posición no encontrada, errores de red)
   - ✅ Diseño responsivo (desktop y móvil)
   - ✅ Botón de retorno al listado
   - ✅ Manejo de posiciones cerradas (deshabilita drag & drop)

#### 4. **Correcciones y Mejoras**
   - ✅ Actualización del schema.prisma para usar variables de entorno
   - ✅ Seed idempotente usando `upsert`
   - ✅ Añadidos `interviewSteps` para todas las posiciones
   - ✅ Corrección del controlador del backend para devolver estructura correcta
   - ✅ Manejo de errores mejorado en el frontend

#### 5. **Archivos Creados/Modificados**

**Creados:**
- `frontend/src/components/PositionBoard.tsx`
- `frontend/src/components/PositionBoard.css`
- `frontend/src/services/positionService.ts`

**Modificados:**
- `frontend/src/App.js` - Añadida ruta `/position/:id`
- `frontend/src/components/Positions.tsx` - Botón "Ver proceso" funcional
- `frontend/package.json` - Añadida dependencia `@hello-pangea/dnd`
- `backend/prisma/schema.prisma` - Actualizado para usar `env("DATABASE_URL")`
- `backend/src/presentation/controllers/positionController.ts` - Corregida estructura de respuesta
- `backend/src/application/services/positionService.ts` - Añadido campo `status`
- `backend/prisma/seed.ts` - Seed idempotente con todos los datos necesarios

#### 6. **Tecnologías Utilizadas**
   - React 18.3.1
   - TypeScript 4.9.5
   - React Router DOM 6.23.1
   - @hello-pangea/dnd 16.4.0 (drag & drop)
   - React Bootstrap 2.10.2
   - Bootstrap 5.3.3
   - Prisma 5.14.0
   - Express.js
   - PostgreSQL

### Estado Final del Proyecto

✅ **Funcionalidad Completa:**
- La vista Position está completamente funcional
- Drag & drop funciona correctamente
- Manejo de errores implementado
- Diseño responsivo
- Manejo de posiciones cerradas
- Mensajes informativos cuando no hay candidatos

✅ **Calidad del Código:**
- Código TypeScript tipado
- Componentes modulares y reutilizables
- Manejo de errores robusto
- Estilos CSS organizados
- Comentarios explicativos

✅ **Base de Datos:**
- Migraciones aplicadas correctamente
- Seed ejecutado con datos de prueba
- Todas las posiciones tienen sus `interviewSteps` correspondientes

### Próximos Pasos Sugeridos (Opcional)

1. **Tests Unitarios:** Añadir tests con React Testing Library
2. **Tests E2E:** Implementar tests con Cypress para drag & drop
3. **Optimizaciones:** Implementar React.memo para optimizar renders
4. **Animaciones:** Añadir animaciones suaves con framer-motion
5. **Filtros:** Implementar filtros de búsqueda en el kanban
6. **Exportación:** Añadir funcionalidad para exportar datos del proceso

---

**Desarrollado por:** JESUS ARIEL GONZALEZ BONILLA  
**Fecha:** Noviembre 2024  
**Proyecto:** AI4DEVS-FRONTEND-SR-01

