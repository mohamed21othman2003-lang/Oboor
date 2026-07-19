"use client";

import { useEffect, useRef } from "react";
import Chart, { type ChartConfiguration, type ChartTypeRegistry, type Plugin } from "chart.js/auto";

// إعدادات عامة موحّدة
Chart.defaults.font.family = "'Segoe UI', Tahoma, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = "#5a7274";

// لوحة ألوان تركوازية موحّدة (matching)
const TEAL = "#1FA6A8";
const GRID = "#eef4f5";
const INK = "#5a7274";
export const PALETTE = ["#1FA6A8", "#0F6C73", "#5FD3D0", "#5B4B8A", "#3B82F6", "#E0A64B", "#8CA0A6", "#A8D8DD"];

type Datum = { label: string; count: number };

function useChart<T extends keyof ChartTypeRegistry>(config: ChartConfiguration<T>, dep: string) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
  return ref;
}

const tooltip = { backgroundColor: "#0F6C73", padding: 9, cornerRadius: 6, displayColors: false } as const;

/** أعمدة: أفقية (horizontal=true، الافتراضي) أو رأسية (column). لون تركوازي موحّد. */
export function BarChart({ data, horizontal = true, height = 200 }: { data: Datum[]; horizontal?: boolean; height?: number }) {
  const ref = useChart(
    {
      type: "bar",
      data: {
        labels: data.map((d) => d.label),
        datasets: [{ data: data.map((d) => d.count), backgroundColor: TEAL, borderRadius: 5, barPercentage: 0.74, categoryPercentage: 0.82 }],
      },
      options: {
        indexAxis: horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip },
        scales: horizontal
          ? {
              x: { reverse: true, beginAtZero: true, grid: { color: GRID }, border: { display: false }, ticks: { color: INK, precision: 0 } },
              y: { position: "right", grid: { display: false }, border: { display: false }, ticks: { color: INK } },
            }
          : {
              x: { grid: { display: false }, border: { display: false }, ticks: { color: INK } },
              y: { beginAtZero: true, grid: { color: GRID }, border: { display: false }, ticks: { color: INK, precision: 0 } },
            },
      },
    },
    JSON.stringify(data) + horizontal,
  );
  return <div style={{ position: "relative", height }}><canvas ref={ref} /></div>;
}

// إضافة تكتب النسبة المئوية فوق كل شريحة في الدونات
const arcPercent: Plugin<"doughnut"> = {
  id: "arcPercent",
  afterDatasetsDraw(chart) {
    const ds = (chart.data.datasets[0]?.data as number[]) || [];
    const sum = ds.reduce((a, b) => a + (b || 0), 0) || 1;
    const meta = chart.getDatasetMeta(0);
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "700 12px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    meta.data.forEach((arc, i) => {
      const pct = ((ds[i] || 0) / sum) * 100;
      if (pct < 7) return; // نتجاهل الشرائح الصغيرة جدًا (تظهر نِسبتها في الليجند)
      const p = (arc as unknown as { tooltipPosition: () => { x: number; y: number } }).tooltipPosition();
      ctx.fillText(`${Math.round(pct)}%`, p.x, p.y);
    });
    ctx.restore();
  },
};

/** دونات لنِسب قليلة العناصر (جهاز/قناة/جنس/مستوى) — تعرض النِسب المئوية. */
export function DonutChart({ data, height = 220 }: { data: Datum[]; height?: number }) {
  const ref = useChart(
    {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.label),
        datasets: [{ data: data.map((d) => d.count), backgroundColor: PALETTE, borderColor: "#fff", borderWidth: 2 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10, boxHeight: 10, padding: 10, color: "#33465e", font: { size: 11.5 },
              generateLabels: (chart) => {
                const ds = (chart.data.datasets[0]?.data as number[]) || [];
                const sum = ds.reduce((a, b) => a + (b || 0), 0) || 1;
                return (chart.data.labels as string[]).map((label, i) => ({
                  text: `${label} · ${Math.round(((ds[i] || 0) / sum) * 100)}%`,
                  fillStyle: PALETTE[i % PALETTE.length],
                  strokeStyle: PALETTE[i % PALETTE.length],
                  lineWidth: 0,
                  index: i,
                }));
              },
            },
          },
          tooltip: {
            backgroundColor: "#0F6C73", padding: 9, cornerRadius: 6,
            callbacks: {
              label: (ctx) => {
                const ds = (ctx.dataset.data as number[]) || [];
                const sum = ds.reduce((a, b) => a + (b || 0), 0) || 1;
                const v = ctx.parsed as number;
                return ` ${Math.round((v / sum) * 100)}% (${v})`;
              },
            },
          },
        },
      },
      plugins: [arcPercent],
    },
    JSON.stringify(data),
  );
  return <div style={{ position: "relative", height }}><canvas ref={ref} /></div>;
}
