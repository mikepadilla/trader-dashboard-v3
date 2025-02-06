const LineChart = ({ min, max, chartDataProp, yKey }) => {
  const chartRef = useRef();

  // Process data into positive and negative datasets
  const processChartData = (chartData) => {
    const positiveData = chartData.map((item) =>
      item[yKey] >= 0 ? item[yKey] : null
    );
    const negativeData = chartData.map((item) =>
      item[yKey] < 0 ? item[yKey] : null
    );

    return {
      labels: chartData.map((item) => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: "Positive Values",
          data: positiveData,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.5)",
          fill: true,
        },
        {
          label: "Negative Values",
          data: negativeData,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          fill: true,
        },
      ],
    };
  };

  const data = processChartData(chartDataProp);

  const options = {
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "#146EB0",
        },
      },
      y: {
        ticks: {
          color: "#146EB0",
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <Line
      className="chart"
      ref={chartRef}
      data={data}
      options={options}
    />
  );
};

export default LineChart;
