import { Bar } from "react-chartjs-2";
import { IQuestTasksCompletion } from "@models";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useRef } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box } from "@mui/material";

interface IProps {
  data: IQuestTasksCompletion["tasksCompletion"];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels,
);

export const QuestTasksCompletionChartAnalytics = ({ data }: IProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current as any;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
      gradient.addColorStop(0, "#00FFFF");
      gradient.addColorStop(1, "#0F7A7A");

      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [data]);

  const labels = useMemo(() => {
    return data.map(item => item.title);
  }, [data]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Percentage",
        data: data.map(item => item.percentage),
        backgroundColor: "rgba(0, 255, 255, 1)",
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: function (context) {
          return context.dataset.data[context.dataIndex] > 10
            ? "black"
            : "white";
        },
        font: {
          weight: "bold",
          size: 10,
        },
        formatter: function (value) {
          return value + "%";
        },
        anchor: "end",
        align: "start",
        offset: 0,
        display: function (context) {
          return context.dataset.data[context.dataIndex] !== 0;
        },
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          font: {
            size: 7,
          },
          callback: (_, index) => {
            if (labels.length > 15 && index % 2 !== 0) {
              return "";
            }

            return labels[index]
              .split(" ")
              .map(item => (item.length <= 10 ? item : item.slice(0, 10)));
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        ticks: {
          color: "#FFF",
          font: {
            size: 16,
            style: "normal",
            weight: 500,
          },
          stepSize: 25,
          callback: function (value) {
            return value + "%";
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.5)",
          tickLength: 0.9,
        },
      },
    },
    animation: {
      onComplete: () => {
        const chart = chartRef.current as any;
        if (chart) {
          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, "#00FFFF"); // equivalent to #0FF
          gradient.addColorStop(1, "#0F7A7A");

          chart.data.datasets[0].backgroundColor = gradient;
          chart.update();
        }
      },
    },
  };

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Bar
        style={{ minHeight: 500, minWidth: 1100 }}
        ref={chartRef}
        data={chartData as any}
        options={options as any}
        plugins={[ChartDataLabels]}
      />
    </Box>
  );
};
