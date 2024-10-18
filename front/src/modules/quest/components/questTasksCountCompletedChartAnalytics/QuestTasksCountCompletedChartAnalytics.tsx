import { Bar } from "react-chartjs-2";
import { IQuestTasksCompletion } from "@models";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useRef } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box } from "@mui/material";

interface IProps {
  data: IQuestTasksCompletion["tasksCountCompletion"];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels,
);

export const QuestTasksCountCompletedChartAnalytics = ({ data }: IProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current as any;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
      gradient.addColorStop(0, "#87F696");
      gradient.addColorStop(1, "#3C7A44");

      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [data]);

  const chartData = {
    labels: data.map(item => `${item.tasksCount} Tasks`.split(" ")),
    datasets: [
      {
        label: "Completed Tasks",
        data: data.map(item => item.percentage),
        backgroundColor: "#87F696",
        barThickness: 40,
      },
    ],
  };

  const suggestedMax = Math.max(...data.map(item => +item.percentage));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      y: {
        beginAtZero: true,
        suggestedMax,
        ticks: {
          color: "#FFF",
          font: {
            size: 16,
            style: "normal",
            weight: 500,
          },
          stepSize: 10,
          callback: function (value) {
            return value + "%";
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.5)",
          tickLength: 0.9,
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
          tickMarkLength: 10,
          borderDash: [2, 2],
        },
      },
    },
    animation: {
      onComplete: () => {
        const chart = chartRef.current as any;
        if (chart) {
          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, "#87F696");
          gradient.addColorStop(1, "#3C7A44");

          chart.data.datasets[0].backgroundColor = gradient;
          chart.update();
        }
      },
    },
  };

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Bar
        style={{ minHeight: 500 }}
        ref={chartRef}
        data={chartData as any}
        options={options as any}
        plugins={[ChartDataLabels]}
      />
    </Box>
  );
};
