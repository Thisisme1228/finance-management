import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useMeasure } from "react-use";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadarVariant = ({ data }: Props) => {
  const [ref, { width, height }] = useMeasure();
  return (
    <ResponsiveContainer width="100%" height={350} ref={ref}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="60%"
        data={data}
        width={width}
        height={height}
      >
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
        <PolarRadiusAxis style={{ fontSize: "12px" }} />
        <Radar
          dataKey="value"
          stroke="#3d82f6"
          fill="#3d82f6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
