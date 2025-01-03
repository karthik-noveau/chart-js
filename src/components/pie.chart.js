import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import {
  getCustomAreaDefsPattern,
  getPatternEffect,
} from "./svgpattern.config";

// Register Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChartWithHoverPattern = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store chart instance to manage it

  useEffect(() => {
    const canvas = chartRef.current;
    const context = canvas.getContext("2d");

    // Destroy any previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create the new chart
    const chart = new Chart(context, {
      type: "pie",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green"],
        datasets: [
          {
            label: "Dataset 1",
            data: [300, 50, 100, 75],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"], // Base colors
            hoverBackgroundColor: [], // Will be dynamically set
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
        onHover: (event, chartElement) => {
          if (
            chartElement.length &&
            typeof chartElement[0].element.options.backgroundColor === "string"
          ) {
            const element = chartElement[0];
            const datasetIndex = element.datasetIndex;
            const dataIndex = element.index;
            let backgroundColor = element.element.options.backgroundColor;

            chart.data.datasets[datasetIndex].hoverBackgroundColor[dataIndex] =
              getPatternEffect(chart, backgroundColor);

            chart.update();
          }
        },

        onLeave: () => {
          // Reset hover styles
          const chart = chartRef.current;
          chart.data.datasets[0].hoverBackgroundColor = [];
          chart.update();
        },
      },
    });

    // Store chart instance in the ref
    chartInstanceRef.current = chart;

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <h3>Pie Chart with Hover Pattern</h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChartWithHoverPattern;
