const LineChart = ({ min, max, chartDataProp, yKey, events }) => {
  const [activeLineY, setActiveLineY] = useState(null);
  const [activeLineYVal, setActiveLineYVal] = useState(null);
  const [pointColors, setPointColors] = useState<string[] | string>(["transparent"]);
  const [pointEvents, setPointEvents] = useState<number[] | number>([0]);
  const chartRef = useRef();

  const [chartData, setChartData] = useState(chartDataProp);

  useEffect(() => {
    setChartData(chartDataProp);
  });

  useEffect(() => {
    if (events) {
      const colorsArr = [];
      const eventsArr = [];
      chartDataProp.forEach((item) => {
        if (item && item["trade"] != undefined) {
          if (item["trade"] == "Buy") {
            colorsArr.push("green");
          } else if (item["trade"] == "Sell") {
            colorsArr.push("red");
          }
          eventsArr.push(3);
        } else if (item && item["daily buy sell"]) {
          if (item["daily buy sell"] > 0) {
            colorsArr.push("green");
          } else if (item["daily buy sell"] < 0) {
            colorsArr.push("red");
          }
          eventsArr.push(3);
        } else {
          colorsArr.push("transparent");
          eventsArr.push(0);
        }
      });
      setPointColors(colorsArr);
      setPointEvents(eventsArr);
    } else {
      setPointColors("transparent");
    }
  }, [chartDataProp]);

  const data = {
    labels: chartData.map((item) => new Date(item["date"]).toLocaleDateString()),
    datasets: [
      {
        label: "Positive Values",
        data: chartData.map((item) => (item[yKey] >= 0 ? item[yKey] : null)),
        borderWidth: 2,
        borderColor: "#146EB0",
        pointRadius: pointEvents,
        pointBackgroundColor: chartData.map((item, index) =>
          item[yKey] >= 0 ? pointColors[index] : "transparent"
        ),
        pointBorderColor: "transparent",
        fill: true,
        backgroundColor: "rgba(0, 128, 0, 0.5)",
      },
      {
        label: "Negative Values",
        data: chartData.map((item) => (item[yKey] < 0 ? item[yKey] : null)),
        borderWidth: 2,
        borderColor: "#146EB0",
        pointRadius: pointEvents,
        pointBackgroundColor: chartData.map((item, index) =>
          item[yKey] < 0 ? pointColors[index] : "transparent"
        ),
        pointBorderColor: "transparent",
        fill: true,
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      },
    ],
  };

  const findMinMaxDay = (data) => {
    if (data[0]) {
      let min = new Date(data[0]["date"]).getTime();
      let max = new Date(data[0]["date"]).getTime();

      for (let i = 0; i < data.length; i++) {
        if (max < new Date(data[i]["date"]).getTime()) {
          max = new Date(data[i]["date"]).getTime();
        }
        if (min > new Date(data[i]["date"]).getTime()) {
          min = new Date(data[i]["date"]).getTime();
        }
      }
      return [min, max];
    }
    return [0, 0];
  };

  const options = {
    maintainAspectRatio: true,
    aspectRatio: 2.75,
    animation: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: events ? true : false },
      customPlugin: {
        activeLineY,
        activeLineYVal,
        chartData,
      },
    },
    scales: {
      x: {
        min: findMinMaxDay(chartData)[0],
        max: findMinMaxDay(chartData)[1],
        grid: { color: "transparent" },
        type: "linear",
        position: "bottom",
        border: { display: false },
        ticks: {
          color: "#146EB0",
          callback: (val) =>
            new Date(val).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            }),
        },
      },
      y: {
        min: min - max / 100,
        max: max + max / 100,
        grid: { color: "#1F4C69" },
        position: "right",
        type: "linear",
        border: { display: false },
        ticks: {
          color: "#146EB0",
          callback: (value) => Math.floor(value).toLocaleString("en-US"),
          font: { size: 12, family: "Proxima nova, sans-serif" },
        },
      },
    },
  };

  return <Line className="chart" ref={chartRef} data={data} options={options} />;
};

export default LineChart;
