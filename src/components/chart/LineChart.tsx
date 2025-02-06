import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ chartDataProp, yKey }) => {
  const [chartData, setChartData] = useState(chartDataProp);

  useEffect(() => {
    setChartData(chartDataProp);
  }, [chartDataProp]);

  // Process the data into two datasets: positive and negative
  const positiveDataset = chartData.map((item) =>
    item[yKey] >= 0 ? item[yKey] : null
  );
  const negativeDataset = chartData.map((item) =>
    item[yKey] < 0 ? item[yKey] : null
  );

  const data = {
    labels: chartData.map((item) => item.date), // Assuming 'date' field exists
    datasets: [
      {
        label: "Positive Values",
        data: positiveDataset,
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.5)", // Semi-transparent green fill
        fill: true,
      },
      {
        label: "Negative Values",
        data: negativeDataset,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)", // Semi-transparent red fill
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
