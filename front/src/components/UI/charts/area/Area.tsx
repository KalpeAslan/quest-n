import { useRef } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxisInterval } from "recharts/types/util/types";

import { Loader } from "@components/UI/loader";
import { ChartData } from "@models";

import {
  ChartsStylesFix,
  ChartsStylesWrapper,
  ChartsStylesHeader,
  ChartsStylesTooltip,
} from "../charts.styles";

type Props = {
  isLoaded?: boolean;
  title?: string;
  value?: string;
  data: ChartData[];
  xDataKey: string;
  yDataKey: string;
  height: number;
  label: string;
  styled?: boolean;
  xAxisLine?: boolean;
  xTickLine?: boolean;
  yAxisLine?: boolean;
  yTickLine?: boolean;
  xAxisInterval?: AxisInterval;
  mirrorX?: boolean;
  mirrorY?: boolean;
};

const CustomAreaChart = ({
  isLoaded,
  title,
  value,
  data,
  xDataKey,
  yDataKey,
  height,
  label,
  xAxisLine,
  xTickLine,
  xAxisInterval,
  yAxisLine,
  yTickLine,
  mirrorX,
  mirrorY,
  styled,
}: Props) => {
  const chart = useRef<any>(null);

  return (
    <ChartsStylesFix>
      <ChartsStylesWrapper className={"select-none"}>
        {(title || value) && (
          <ChartsStylesHeader ref={chart}>
            {title && <p className="c-head-20-28 fw-600">{title}</p>}

            {isLoaded && value && (
              <p className="c-head-20-28 fw-600">{value}</p>
            )}
          </ChartsStylesHeader>
        )}

        <ResponsiveContainer height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#88f696" stopOpacity={0.3} />
                <stop offset="25%" stopColor="#88f696" stopOpacity={0.2} />
                <stop offset="45%" stopColor="#88f696" stopOpacity={0.1} />
                <stop offset="76%" stopColor="#88f696" stopOpacity={0.1} />
                <stop offset="96%" stopColor="#88f696" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              mirror={mirrorX}
              dataKey={xDataKey}
              tickLine={xTickLine}
              axisLine={xAxisLine}
              interval={0}
              tick={{ fill: "rgb(255 255 255 / 20%)", fontSize: "8px" }}
              stroke="rgb(255 255 255 / 20%)"
            />

            <YAxis
              width={15}
              mirror={mirrorY}
              dataKey={yDataKey}
              tickLine={yTickLine}
              axisLine={yAxisLine}
              interval={0}
              tick={{ fill: "rgb(255 255 255 / 20%)", fontSize: "8px" }}
              stroke="rgb(255 255 255 / 20%)"
            />

            <Tooltip
              content={<CustomTooltip customLabel={label} />}
              cursor={false}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dot={<CustomizedDot />}
              activeDot={false}
              dataKey={yDataKey}
              stroke="transparent"
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {!isLoaded && <Loader />}
      </ChartsStylesWrapper>
    </ChartsStylesFix>
  );
};

CustomAreaChart.defaultProps = {
  styled: true,
  mirrorX: false,
  mirrorY: false,
  xAxisLine: true,
  xTickLine: true,
  xAxisInterval: "preserveStartEnd",
  yAxisLine: true,
  yTickLine: true,
} as Partial<Props>;

const CustomTooltip: any = ({
  active,
  payload,
  label,
  customLabel,
}: {
  active: boolean;
  payload: any;
  label: string;
  customLabel: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <ChartsStylesTooltip>{`${payload[0].payload.name} - ${payload[0].value}${customLabel}`}</ChartsStylesTooltip>
    );
  }

  return null;
};

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;

  return (
    <svg
      x={cx - 3}
      y={cy - 3}
      width={6}
      height={6}
      fill="#5B9E64"
      viewBox="0 0 3 4"
    >
      <circle cx="1.5" cy="2" r="1.5" fill="#5B9E64" />
    </svg>
  );
};

export default CustomAreaChart;
