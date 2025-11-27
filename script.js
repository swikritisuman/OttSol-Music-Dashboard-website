document.addEventListener("DOMContentLoaded", () => {
  createRevenueChart();
  createCountryChart();
  loadDspDataAndCreateChart();
});

/* --------------------------------------
   1. MONTH-WISE REVENUE (STATIC SAMPLE)
-------------------------------------- */
function createRevenueChart() {
  const ctx = document.getElementById("revenueChart");

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data = [120000, 150000, 180000, 160000, 200000, 230000];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          backgroundColor: "#2563eb77",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

/* --------------------------------------
   2. COUNTRY-WISE STREAMS PIE CHART (STATIC)
-------------------------------------- */
function createCountryChart() {
  const ctx = document.getElementById("countryChart");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["India", "USA", "UK", "Others"],
      datasets: [
        {
          data: [62, 15, 9, 14],
          backgroundColor: ["#2563eb", "#16a34a", "#facc15", "#f97316"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

/* --------------------------------------
   3. DSP PERFORMANCE USING CSV FILES
-------------------------------------- */
function loadDspDataAndCreateChart() {
  const files = [
    { url: "airtel-report.csv", name: "Airtel" },
    { url: "wynk-report.csv", name: "Wynk" },
    { url: "jiosaavn-report.csv", name: "JioSaavn" },
  ];

  const promises = files.map((file) => parseCsvTotal(file.url, file.name));

  Promise.all(promises).then((results) => {
    const labels = results.map((r) => r.name);
    const data = results.map((r) => r.total);

    document.getElementById("dspLoading").style.display = "none";
    const canvas = document.getElementById("dspChart");
    canvas.style.display = "block";

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Total Streams",
            data,
            borderColor: "#2563eb",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            backgroundColor: "#2563eb33",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  });
}

/* CSV PARSER FUNCTION */
function parseCsvTotal(url, name) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (result) => {
        let totalStreams = 0;

        result.data.forEach((row) => {
          const value = Number(String(row["total"]).replace(/,/g, "").trim());
          if (!isNaN(value)) totalStreams += value;
        });

        resolve({ name, total: totalStreams });
      },
      error: reject,
    });
  });
}

/* --------------------------------------------------
   FORMSPREE AJAX SUBMISSION (NO REDIRECT)
-------------------------------------------------- */
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // stop page reload

  const form = e.target;
  const status = document.getElementById("form-status");

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      status.style.display = "block";
      status.textContent = "Message sent successfully!";
      form.reset();
    } else {
      status.style.display = "block";
      status.style.color = "red";
      status.textContent = "Something went wrong. Try again!";
    }
  } catch (error) {
    status.style.display = "block";
    status.style.color = "red";
    status.textContent = "Network error!";
  }
});

