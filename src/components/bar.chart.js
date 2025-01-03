import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// Register necessary Chart.js components and the zoom plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// Create a custom pattern effect function
const getPatternEffect = (ctx, patternImage) => {
  const pattern = ctx.createPattern(patternImage, 'repeat');
  return pattern;
};

const BarChart = () => {
  const chartRef = useRef(null);

  // Pattern image source (you can replace this with any pattern image)
  const patternImage = new Image();
  patternImage.src = 'https://www.somesite.com/pattern.png';  // Replace with your pattern image URL

  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "My Dataset",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Default background color
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options with zoom and pan
  const options = {
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    hover: {
      onHover: (event, chartElement) => {
        const chart = chartRef.current.chartInstance;

        if (chartElement.length > 0) {
          const datasetIndex = chartElement[0].datasetIndex;
          const dataIndex = chartElement[0].index;

          // Get the chart's context (canvas)
          const ctx = chart.ctx;

          // Apply custom pattern on hover
          chart.data.datasets[datasetIndex].backgroundColor = (context) => {
            if (context.dataIndex === dataIndex) {
              // Draw the pattern on hover
              return getPatternEffect(ctx, patternImage);
            }
            return chart.data.datasets[datasetIndex].backgroundColor;
          };

          chart.update();
        }
      },
    },
  };

  return (
    <div>
      <div style={{ width: "80%", height: "400px" }}>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
