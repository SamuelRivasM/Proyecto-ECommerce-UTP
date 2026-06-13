# Automatización K6 con GitHub Actions

## 1. Ubicación recomendada

El trabajo más reciente del repositorio mantiene las pruebas en `test/pruebas-k6`. Para usar este paquete, muévelas a la ruta acordada:

```bash
git mv test/pruebas-k6 test/auto-pruebas-k6
```

Luego copia o reemplaza los dos scripts de este directorio y agrega el workflow en `.github/workflows/k6-performance.yml`.

## 2. Configuración en GitHub

En **Settings > Secrets and variables > Actions**, crea:

### Variables del repositorio

- `K6_FRONTEND_URL`: URL pública del frontend, sin `/` final.
- `K6_BACKEND_URL`: URL pública del backend, sin `/` final.

### Secrets del repositorio

- `K6_LOGIN_EMAIL`: cuenta de prueba existente.
- `K6_LOGIN_PASSWORD`: contraseña de la cuenta de prueba.

No guardes credenciales reales dentro de los archivos `.js`.

## 3. Perfiles

- `smoke`: 1 usuario virtual durante 20 segundos. Se ejecuta en cada cambio del workflow o de los scripts en `develop`.
- `load`: aumenta progresivamente hasta 50 usuarios virtuales. Se ejecuta los lunes y también puede lanzarse manualmente.
- `stress`: aumenta hasta 100 usuarios virtuales. Se recomienda ejecutarlo manualmente contra un entorno de pruebas autorizado.

Todos los perfiles aplican los criterios del proyecto:

- tasa de solicitudes fallidas menor a 5 %;
- percentil 95 de duración menor a 3 segundos;
- porcentaje de checks superior a 95 %.

Cuando un umbral no se cumple, K6 devuelve un código de error y el job queda marcado como fallido.

## 4. Reportes

Cada ejecución conserva durante 30 días:

- dashboard HTML de catálogo;
- dashboard HTML de login;
- resúmenes JSON;
- salida de consola de K6.

Los archivos aparecen en la sección **Artifacts** de la ejecución del workflow.

## 5. Consideración sobre localhost

Un runner hospedado por GitHub no puede entrar al `localhost` de una computadora del equipo. Por eso el workflow usa las URL desplegadas configuradas en `K6_FRONTEND_URL` y `K6_BACKEND_URL`. La base de datos y la cuenta de prueba deben estar disponibles en ese entorno.

## 6. K6 y Grafana

`K6_WEB_DASHBOARD_EXPORT` genera un reporte HTML autónomo para la evidencia de CI. Esto no crea por sí solo un dashboard persistente en un servidor Grafana. Para conservar series históricas en Grafana se necesita una segunda etapa, por ejemplo Grafana Cloud k6 o una salida de métricas hacia un backend compatible. Esa integración puede registrarse como el siguiente incremento de automatización.
