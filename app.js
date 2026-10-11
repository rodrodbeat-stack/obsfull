const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => [
    ...document.querySelectorAll(selector)
];

/* ==============================
   RELOJ DEL SISTEMA
============================== */

function updateClock() {
    const time = new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        timeZone: "UTC"
    });

    $("#clock").textContent = time + " UTC";
}

updateClock();

setInterval(updateClock, 1000);


/* ==============================
   DATOS DE LOS MÓDULOS
============================== */

const modules = {

    overview: {
        title: "COMMAND OVERVIEW",

        columns: [
            "SYSTEM",
            "STATUS",
            "DETAIL"
        ],

        rows: [
            ["Core Services", "NOMINAL", "24/26 healthy"],
            ["Cloud Fabric", "CONNECTED", "AWS / Azure / GCP"],
            ["Platform Readiness", "87%", "Deployment checks"],
            ["Availability", "99.95%", "Service SLO"]
        ]
    },

    cloud: {
        title: "CLOUD FABRIC / INVENTORY",

        columns: [
            "RESOURCE",
            "PROVIDER",
            "TYPE",
            "ENVIRONMENT",
            "STATUS"
        ],

        rows: [
            ["eks-prod-core-01", "AWS", "Kubernetes", "Production", "HEALTHY"],
            ["vnet-shared-prod", "Azure", "Virtual Network", "Production", "HEALTHY"],
            ["gke-analytics-01", "GCP", "Kubernetes", "Staging", "HEALTHY"],
            ["storage-prod-02", "AWS", "Object Storage", "Production", "REVIEW"],
            ["kv-platform-prod", "Azure", "Key Vault", "Production", "HEALTHY"]
        ]
    },

    cicd: {
        title: "CI/CD PIPELINE CONTROL",

        columns: [
            "PIPELINE",
            "STAGE",
            "DURATION",
            "ENVIRONMENT",
            "STATUS"
        ],

        rows: [
            ["payments-api", "Deploy", "02m 18s", "Production", "RUNNING"],
            ["catalog-service", "Complete", "06m 42s", "Production", "SUCCESS"],
            ["infra-live", "Terraform Plan", "01m 09s", "Staging", "SUCCESS"],
            ["identity-gateway", "Security Scan", "03m 11s", "Development", "REVIEW"]
        ]
    },

    governance: {
        title: "CLOUD GOVERNANCE MATRIX",

        columns: [
            "CONTROL",
            "DOMAIN",
            "RESULT",
            "FINDINGS",
            "OWNER"
        ],

        rows: [
            ["Encryption at rest", "Data Protection", "COMPLIANT", "0", "Data Platform"],
            ["Public storage disabled", "Cloud Security", "NON-COMPLIANT", "3", "Cloud Ops"],
            ["Mandatory resource tags", "FinOps", "PARTIAL", "7", "FinOps"],
            ["Privileged access MFA", "Identity", "REVIEW", "2", "Security"],
            ["Resource ownership", "Governance", "PARTIAL", "4", "Platform Ops"]
        ]
    },

    security: {
        title: "ZERO TRUST SECURITY GRID",

        columns: [
            "FINDING",
            "ASSET",
            "SEVERITY",
            "DETECTED",
            "OWNER"
        ],

        rows: [
            ["Public storage policy", "storage-prod-02", "HIGH", "12 min ago", "Cloud Ops"],
            ["Over-privileged IAM role", "platform-team", "MEDIUM", "34 min ago", "Security"],
            ["Missing owner tag", "compute-node-18", "MEDIUM", "1 hr ago", "FinOps"],
            ["MFA verification", "admin-identities", "REVIEW", "Now", "Security"]
        ]
    },

    observability: {
        title: "TELEMETRY / SRE NEXUS",

        columns: [
            "SERVICE",
            "AVAILABILITY",
            "P95 LATENCY",
            "ERROR RATE",
            "HEALTH"
        ],

        rows: [
            ["payments-api", "99.99%", "124 ms", "0.08%", "HEALTHY"],
            ["catalog-service", "99.97%", "182 ms", "0.11%", "HEALTHY"],
            ["identity-gateway", "99.91%", "241 ms", "0.42%", "WATCH"],
            ["notification-worker", "99.95%", "156 ms", "0.06%", "HEALTHY"]
        ]
    }

};


/* ==============================
   NOTIFICACIONES
============================== */

let toastTimeout;

function notify(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


/* ==============================
   NAVEGACIÓN ENTRE MÓDULOS
============================== */

function openModule(moduleName) {

    const data = modules[moduleName];

    if (!data) {
        return;
    }

    $("#detailsTitle").textContent = data.title;

    const tableHead = data.columns
        .map(column => `<th>${column}</th>`)
        .join("");

    const tableRows = data.rows
        .map(row => {
            const cells = row
                .map(value => `<td>${value}</td>`)
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    $("#detailsContent").innerHTML = `
        <table class="detail-table">
            <thead>
                <tr>${tableHead}</tr>
            </thead>

            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    $("#details").classList.add("open");

    $$(".bottom-nav button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.module === moduleName
        );
    });

    $("#details").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ==============================
   BOTONES DE MÓDULOS
============================== */

$$("[data-module]").forEach(button => {

    button.addEventListener("click", () => {

        openModule(button.dataset.module);

    });

});


/* ==============================
   CERRAR DETALLE
============================== */

$("#closeDetails").addEventListener("click", () => {

    $("#details").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* ==============================
   RADAR INTERACTIVO
============================== */

$$(".blip").forEach(node => {

    node.addEventListener("click", () => {

        const message = node.dataset.info;

        $("#radarMessage").textContent =
            "NODE SELECTED / " + message.toUpperCase();

        notify(message);

    });

});


/* ==============================
   ZOOM DEL RADAR
============================== */

let zoom = 1;

$("#zoomIn").addEventListener("click", () => {

    zoom = Math.min(1.15, zoom + 0.05);

    $("#radar").style.transform = `scale(${zoom})`;

});

$("#zoomOut").addEventListener("click", () => {

    zoom = Math.max(0.85, zoom - 0.05);

    $("#radar").style.transform = `scale(${zoom})`;

});


/* ==============================
   MODO CONTRASTE
============================== */

$("#contrastBtn").addEventListener("click", () => {

    document.body.classList.toggle("high-contrast");

    notify("DISPLAY CONFIGURATION UPDATED");

});


/* ==============================
   CAMBIAR ENTORNO
============================== */

$("#environment").addEventListener("change", event => {

    const environment = event.target.value;

    notify("ENVIRONMENT SELECTED: " + environment);

});


/* ==============================
   SIMULACIÓN DE CARGA
============================== */

function simulateCoreLoad() {

    const load = Math.floor(
        35 + Math.random() * 25
    );

    $("#coreLoad").textContent = load + "%";

}

setInterval(simulateCoreLoad, 5000);
const biCharts = {};

function openBIDashboard(event) {
  if (event) event.preventDefault();

  const dashboard = document.getElementById("bi-dashboard");
  if (!dashboard) return;

  document.querySelectorAll("body > *").forEach(element => {
    if (
      element.id !== "bi-dashboard" &&
      element.tagName !== "SCRIPT"
    ) {
      element.dataset.biPreviousDisplay =
        element.style.display || "";
      element.style.display = "none";
    }
  });

  dashboard.hidden = false;
  renderBIDashboard();
  window.scrollTo(0, 0);
}

function closeBIDashboard() {
  const dashboard = document.getElementById("bi-dashboard");
  if (!dashboard) return;

  dashboard.hidden = true;

  document.querySelectorAll("[data-bi-previous-display]")
    .forEach(element => {
      element.style.display =
        element.dataset.biPreviousDisplay;
      delete element.dataset.biPreviousDisplay;
    });

  window.scrollTo(0, 0);
}

function renderBIDashboard() {
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está disponible.");
    return;
  }

  const days = Number(
    document.getElementById("bi-period")?.value || 30
  );

  const labels = Array.from(
    { length: 7 },
    (_, i) => {
      const day = Math.round(i * (days - 1) / 6);
      return `D-${days - day}`;
    }
  );

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#d8def0" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#91a0bb" },
        grid: { color: "#ffffff0c" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#91a0bb" },
        grid: { color: "#ffffff12" }
      }
    }
  };

  function createChart(id, config) {
    if (biCharts[id]) biCharts[id].destroy();

    const canvas = document.getElementById(id);
    if (canvas) {
      biCharts[id] = new Chart(canvas, config);
    }
  }

  createChart("bi-pipeline-chart", {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Exitosos",
          data: [82, 88, 85, 93, 91, 96, 97],
          borderColor: "#00e5ff",
          tension: 0.35
        },
        {
          label: "Fallidos",
          data: [18, 12, 15, 7, 9, 4, 3],
          borderColor: "#ff5577",
          tension: 0.35
        }
      ]
    },
    options: commonOptions
  });

  createChart("bi-cost-chart", {
    type: "doughnut",
    data: {
      labels: ["AWS", "Azure", "GCP"],
      datasets: [{
        data: [50, 30, 20],
        backgroundColor: ["#00e5ff", "#b388ff", "#ffb454"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#d8def0" }
        }
      }
    }
  });

  createChart("bi-governance-chart", {
    type: "doughnut",
    data: {
      labels: ["Cumple", "Pendiente", "Incumple"],
      datasets: [{
        data: [78, 14, 8],
        backgroundColor: ["#00e5a0", "#ffb454", "#ff5577"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#d8def0" }
        }
      }
    }
  });

  createChart("bi-observability-chart", {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Eventos",
        data: [42, 56, 39, 68, 51, 34, 29],
        backgroundColor: "#b388ff",
        borderRadius: 5
      }]
    },
    options: commonOptions
  });
}

document.getElementById("bi-period")
  ?.addEventListener("change", renderBIDashboard);
