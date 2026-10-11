const stageInfo = {
  CODE: ["Repositorio y cambios", "Commit firmado, revisión por merge request y protección de rama."],
  BUILD: ["Construcción del artefacto", "Dependencias fijadas, build reproducible y artefacto versionado."],
  TEST: ["Calidad automatizada", "Pruebas unitarias e integración; umbral de cobertura y calidad."],
  SECURITY: ["Controles DevSecOps", "SAST, DAST, SCA, análisis de secretos e imagen de contenedor."],
  "INTEGRACIÓN": ["Entorno de integración", "Despliegue automático y pruebas de humo contra servicios integrados."],
  "CERTIFICACIÓN": ["Certificación", "Validación funcional, evidencia de QA y aprobación requerida."],
  QA: ["Quality Assurance", "Pruebas E2E, regresión, performance y aceptación de release."],
  "PRODUCCIÓN": ["Producción", "Aprobación manual, despliegue controlado, smoke test y rollback disponible."]
};
const envInfo = {
  "INTEGRACIÓN":"Deploy automático habilitado · validaciones de integración aprobadas.",
  "CERTIFICACIÓN":"Release candidato validado · pendiente de aprobación formal si aplica.",
  "QA":"Pruebas E2E disponibles · ambiente estable para validación funcional.",
  "PRODUCCIÓN":"Servicio activo · cambios sujetos a aprobación y estrategia de rollback."
};
const toast = document.getElementById('toast');
let toastTimer;
function notify(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
const dashData={
overview:['VISIÓN GENERAL','Estado operacional consolidado',[['SISTEMAS PROTEGIDOS','128','+6 esta semana'],['CUMPLIMIENTO','98%','objetivo ≥95%'],['ALERTAS ACTIVAS','7','2 críticas'],['DISPONIBILIDAD','99.98%','últimos 30 días']],['Plataforma cloud|Operativa|ok','Políticas críticas|Aplicadas|ok','Escaneos DevSecOps|Completados|ok','Pipeline principal|Deploy exitoso|ok','Hallazgos pendientes|7 vulnerabilidades|warn']],
governance:['GOBERNANZA CLOUD','Políticas, IAM, cumplimiento y riesgos',[['CUMPLIMIENTO','98%','objetivo ≥95%'],['POLÍTICAS','42','3 por revisar'],['IDENTIDADES','286','12 privilegiadas'],['RIESGOS','19','2 críticos']],['IAM mínimo privilegio|Conforme|ok','Etiquetado de recursos|96% cobertura|warn','Cifrado en reposo|Aplicado|ok','Auditoría de cambios|Activa|ok','Retención de logs|Conforme|ok']],
security:['CENTRO DE CIBERSEGURIDAD','Vulnerabilidades, amenazas y protección',[['POSTURA','97%','+2.4% mensual'],['VULNERABILIDADES','7','2 críticas'],['AMENAZAS BLOQUEADAS','38','últimas 24 h'],['SECRETOS EXPUESTOS','0','sin hallazgos']],['CVE crítica · api-service|Prioridad P1|bad','Imagen base antigua|Prioridad P2|warn','Regla IAM amplia|Prioridad P2|warn','Escaneo de secretos|Sin hallazgos|ok','Protección perimetral|Activa|ok']],
pipeline:['CONTROL DE ENTREGA CI/CD','Trazabilidad desde commit hasta producción',[['PIPELINES HOY','24','21 exitosos'],['TASA DE ÉXITO','87.5%','últimas ejecuciones'],['LEAD TIME','8m 42s','promedio'],['FALLOS ABIERTOS','3','revisar logs']],['web-app #4827|main · exitoso|ok','api-service #4826|develop · exitoso|ok','frontend #4825|Falló en SECURITY|bad','infra #4824|main · exitoso|ok','backend #4823|feature/login · exitoso|ok']],
environments:['INFRAESTRUCTURA Y ENTORNOS','Promoción controlada y salud de cargas',[['ENTORNOS','4','activos'],['SALUD GLOBAL','99.7%','estable'],['RELEASE','v1.2.3','desplegada'],['DRIFT','1','revisar']],['Integración|Healthy · automático|ok','Certificación|Validación funcional|ok','QA|Pruebas E2E|ok','Producción|Aprobación requerida|ok','Infraestructura|Diferencia detectada|warn']],
kubernetes:['KUBERNETES COMMAND','Clústeres, workloads, pods y nodos',[['CLÚSTERES','3','dev · qa · prod'],['NODOS READY','12/12','saludables'],['PODS RUNNING','86','4 namespaces'],['RESTARTS','2','última hora']],['web-frontend|3/3 pods disponibles|ok','api-service|4/4 pods disponibles|ok','worker-jobs|2/3 pods disponibles|warn','ingress-controller|2/2 disponibles|ok','monitoring-stack|6/6 disponibles|ok']],
observability:['OBSERVABILIDAD TÁCTICA','Métricas, logs, trazas y salud',[['CPU','32%','normal'],['MEMORIA','68%','estable'],['LATENCIA P95','124 ms','objetivo <200 ms'],['ERROR RATE','0.12%','objetivo <1%']],['API Gateway|99.99% disponibilidad|ok','Autenticación|p95 81 ms|ok','Base de datos|p95 13 ms|ok','Frontend|Latencia elevada|warn','Alertas críticas|0 activas|ok']],
reports:['REPORTES Y AUDITORÍA','Evidencias, cambios y controles',[['REPORTES','12','últimos 30 días'],['EVENTOS','8,421','auditados'],['CONTROLES','41/42','conformes'],['PENDIENTES','5','asignados']],['Postura de seguridad|Generado hoy|ok','Cumplimiento de políticas|Generado hoy|ok','Cambios de infraestructura|Generado hoy|ok','Resumen de pipeline|Generado hoy|ok','Remediación de vulnerabilidades|Revisión pendiente|warn']],
settings:['CONFIGURACIÓN DEL CENTRO','Preferencias locales e integraciones',[['MODO','DEMO','sin conexiones'],['REFRESCO','MANUAL','panel local'],['ALERTAS UI','ACTIVAS','solo visuales'],['API','NO CONECTADA','sin credenciales']],['Animaciones cyber|Interfaz animada|ok','Alertas visuales|Notificaciones locales|ok','Tema|Azul neón / rojo|ok','Integraciones|No configuradas|warn']]
};
const dashModal=document.getElementById('dash-modal'),dashBody=document.getElementById('dash-body');let activeDash='overview';
function renderDash(key){activeDash=key;const d=dashData[key]||dashData.overview;document.getElementById('dash-title').textContent=d[0];document.getElementById('dash-subtitle').textContent=d[1];document.getElementById('dash-time').textContent='ACTUALIZADO '+new Date().toLocaleTimeString('es-CL',{hour12:false});let k=d[2].map(x=>`<div class="dash-kpi"><small>${x[0]}</small><strong>${x[1]}</strong><em>${x[2]}</em></div>`).join('');let rows=d[3].map(x=>{let a=x.split('|');return `<li><span>${a[0]}<br><small>${a[1]}</small></span><b class="dash-${a[2]}">${a[2]==='ok'?'● OK':a[2]==='warn'?'▲ REVISAR':'◆ CRÍTICO'}</b></li>`}).join('');let bars=Array.from({length:12},(_,i)=>`<i style="height:${22+((i*37+key.length*13)%75)}%" data-x="${i+1}"></i>`).join('');dashBody.innerHTML=`<div class="dash-kpis">${k}</div><div class="dash-cols"><article class="dash-card"><h3>▣ ${key==='security'?'COLA DE REMEDIACIÓN':key==='pipeline'?'ÚLTIMAS EJECUCIONES':key==='governance'?'CONTROLES DE GOBERNANZA':key==='environments'?'ESTADO POR ENTORNO':key==='kubernetes'?'WORKLOADS':key==='observability'?'SEÑALES DE SALUD':key==='reports'?'REPORTES RECIENTES':key==='settings'?'PREFERENCIAS':'CENTRO DE OPERACIONES'}</h3><ul class="dash-list">${rows}</ul><div class="dash-actions"><button class="dash-action" data-action="details">Ver detalle</button><button class="dash-action" data-action="filter">Filtrar alertas</button><button class="dash-action" data-action="export">Exportar resumen</button></div><div class="dash-notice" id="dash-notice">Consola lista: selecciona una acción para explorar este dashboard.</div></article><article class="dash-card"><h3>⌁ ${key==='pipeline'?'ETAPAS CI/CD':key==='security'?'EVENTOS DE SEGURIDAD':key==='environments'?'UTILIZACIÓN DE RECURSOS':key==='kubernetes'?'CAPACIDAD DEL CLÚSTER':'TENDENCIA DE ACTIVIDAD'}</h3><div class="dash-bars">${bars}</div><div class="dash-actions"><button class="dash-range active" data-range="24H">24H</button><button class="dash-range" data-range="7D">7D</button><button class="dash-range" data-range="30D">30D</button></div><div class="dash-notice" id="dash-range-result">Ventana 24H · valores ilustrativos.</div></article></div>`;dashModal.classList.add('open');dashModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.section===key));document.getElementById('section-title').textContent=d[0];}
function closeDash(){dashModal.classList.remove('open');dashModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>renderDash(btn.dataset.section)));
dashModal.querySelector('.dash-close').addEventListener('click',closeDash);dashModal.querySelector('[data-close]').addEventListener('click',closeDash);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDash()});document.getElementById('dash-refresh').addEventListener('click',()=>{renderDash(activeDash);notify('Dashboard actualizado con datos demo.');});dashBody.addEventListener('click',e=>{let a=e.target.closest('[data-action]');if(a){let m=document.getElementById('dash-notice');m.textContent=({details:'Detalle ampliado: estado, responsable y evidencia se representan en esta vista demo.',filter:'Filtro aplicado: priorizando los elementos que requieren revisión o son críticos.',export:'Resumen listo en pantalla. Exportación real requiere un backend.'})[a.dataset.action];a.classList.toggle('active')}let r=e.target.closest('[data-range]');if(r){r.parentElement.querySelectorAll('[data-range]').forEach(x=>x.classList.remove('active'));r.classList.add('active');document.getElementById('dash-range-result').textContent=`Ventana seleccionada: ${r.dataset.range}. Valores ilustrativos, no métricas en tiempo real.`}});
document.querySelectorAll('.stage').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.stage').forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  const [title, detail] = stageInfo[btn.dataset.stage];
  document.getElementById('stage-detail').innerHTML = `<b>${title.toUpperCase()}</b><span>${detail}</span>`;
}));
document.querySelectorAll('.environment').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.environment').forEach(e => e.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('env-detail').textContent = envInfo[btn.dataset.env];
  notify(`Entorno seleccionado: ${btn.dataset.env}`);
}));
const obs = document.getElementById('observability-content');
const metricMarkup = obs.innerHTML;
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  if (btn.dataset.metric === 'metrics') obs.innerHTML = metricMarkup;
  if (btn.dataset.metric === 'logs') obs.innerHTML = `<div class="log-list"><div><span>02:48:01 INFO</span> deploy completed</div><div><span>02:48:02 INFO</span> health check passed</div><div>02:48:03 WARN latency above baseline</div><div><span>02:48:04 INFO</span> policy scan passed</div></div>`;
  if (btn.dataset.metric === 'traces') obs.innerHTML = `<div class="trace-list"><div><span>GET /api/health</span><b>24 ms · OK</b></div><div><span>POST /api/login</span><b>81 ms · OK</b></div><div><span>GET /api/catalog</span><b>46 ms · OK</b></div><div><span>DB query</span><b>13 ms · OK</b></div></div>`;
}));
document.getElementById('refresh-pipelines').addEventListener('click', () => {
  const btn = document.getElementById('refresh-pipelines');
  btn.textContent = '✓ Actualizado';
  document.getElementById('pipeline-message').textContent = 'Vista demo actualizada · datos ilustrativos';
  notify('Panel actualizado. Conecta tu CI/CD para obtener datos reales.');
  setTimeout(() => btn.textContent = '↻ Actualizar', 1800);
});
document.getElementById('view-all').addEventListener('click', () => notify('Vista demo: integra GitLab CI o GitHub Actions para consultar todos los pipelines.'));
function updateClock() { document.getElementById('clock').textContent = new Date().toLocaleTimeString('es-CL',{hour12:false,timeZone:'America/Santiago'}) + ' CLT'; }
updateClock(); setInterval(updateClock,1000);
