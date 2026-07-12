# Widget de Marcaje Favtel — instrucciones para integrarlo al CRM

Hola 👋 — este es el modal de marcaje de la Suite de Talento Favtel, empaquetado
como un widget independiente. Se integra con **una sola línea de HTML**; no
necesita librerías, no toca los estilos del CRM y no usa sus sesiones.

## Integración (1 línea)

Agregar antes de `</body>` en la página del CRM donde se quiera el botón:

```html
<script src="https://TU-APP.azurewebsites.net/widget/favtel-marcaje.js"
        data-api="https://TU-APP.azurewebsites.net"></script>
```

Eso pinta un **botón flotante morado** en la esquina inferior derecha. Al
hacerle clic se abre el modal: la persona ingresa su **código de empleado
(FV0000)** y su **PIN**, y puede marcar Entrada, Desayuno, Almuerzo, Café y
Salida. El widget recuerda al usuario en ese navegador.

### Opciones

| Atributo | Qué hace |
|---|---|
| `data-api` | URL base del backend Favtel. Obligatorio si el script se copia a otro dominio; si se carga desde el backend Favtel se detecta solo. |
| `data-codigo="FV0077"` | Pre-carga el código del empleado (solo pedirá el PIN). Útil si el CRM ya sabe quién es el usuario logueado. |

## Cómo funciona por dentro

- El widget llama a `POST {api}/api/rh/widget/estado` y `POST {api}/api/rh/widget/marca`
  con `{ codigo, pin, tipo }`.
- `tipo` es uno de: `entrada`, `salida`, `desayuno_inicio`, `desayuno_fin`,
  `almuerzo_inicio`, `almuerzo_fin`, `cafe_inicio`, `cafe_fin`.
- El servidor valida la secuencia (no se puede salir sin entrar, etc.),
  registra la hora **de Costa Rica**, y crea incidencias automáticas:
  entrada tarde (>8:00), comida excedida y salida temprana.
- CORS ya está habilitado. Si quieren restringirlo al dominio del CRM,
  en el App Service se define la variable `WIDGET_ORIGINS=https://crm.ejemplo.com`.

## Prueba rápida

Demo en vivo: `https://TU-APP.azurewebsites.net/widget/demo.html`

PIN inicial de todos los empleados: `1234` (se cambia desde la Suite de
Talento → Equipo → Editar perfil). El rate-limit es de 30 intentos/minuto
por IP+código.
