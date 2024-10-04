import DataGrid from "@/components/home/data-grid";
import DataCharts from "@/components/home/data-charts";

export default function Home() {
  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24 z-10">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
