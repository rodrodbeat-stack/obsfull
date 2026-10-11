# SKYNET — Governance · Security · CI/CD Dashboard

Dashboard web responsive con estética futurista inspirada en interfaces sci-fi/Robotech: gobernanza cloud, DevSecOps, pipeline de despliegue, entornos y observabilidad.

## Ejecutar localmente

No requiere instalación, Node.js ni dependencias.

1. Descarga y descomprime el ZIP.
2. Abre `index.html` en el navegador.
3. Para desarrollo, también puedes abrir la carpeta en Visual Studio Code y usar la extensión **Live Server**.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube `index.html`, `styles.css`, `app.js`, `README.md` y la carpeta `assets/` a la raíz del repositorio.
3. En GitHub, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, elige `main` y `/ (root)`, y guarda.
5. Espera a que GitHub Pages publique el sitio y abre la URL que entrega.

## Funcionalidad incluida

- Menú lateral interactivo con navegación por secciones.
- Paneles de gobernanza y riesgos.
- Resumen de seguridad y gráfico de amenazas.
- Pipeline CI/CD desde CODE hasta PRODUCCIÓN, incluyendo SECURITY, INTEGRACIÓN, CERTIFICACIÓN y QA.
- Selección de etapa para ver controles asociados.
- Selección de entornos y estado ilustrativo.
- Tabs de observabilidad para Métricas, Logs y Traces.
- Diseño responsive para escritorio, tablet y móvil.

## Importante

Los números, estados, logs, métricas y pipelines que aparecen son **datos de demostración**. El dashboard es una interfaz estática interactiva; no ejecuta despliegues ni se conecta automáticamente a GitHub, GitLab, Azure, AWS, GCP, Kubernetes o herramientas de seguridad. Para usar datos reales, hay que implementar una API/backend seguro e integrar los servicios correspondientes. No publiques credenciales, tokens ni secretos en archivos frontend.


## Dashboards interactivos
Cada opción del menú lateral abre un dashboard cibernético independiente con KPI, estado de controles, gráficos ilustrativos, filtros locales y actualización de panel. Los datos son de demostración; para integraciones reales se necesita API/backend.
