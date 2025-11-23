import { SectionCards } from "@/components/ui/section-cards";
import { ChartAreaGradient } from "@/components/ui/chart-area-gradient";
import { ChartPieLegend } from "@/components/ui/chart-pie-legend";

export default function Panel() {
  return (
    <div className="min-h-screen flex flex-col gap-10 p-10">
      <h1 className="text-4xl font-bold text-koli-red-dark">Merhabalar!</h1>

      <div className="flex w-full gap-10">
        {/* left column: grows, can scroll, won't overflow */}
        <div className="flex w-2/3 flex-col gap-6 flex-1 min-h-0 overflow-auto">
          <SectionCards />
          <ChartAreaGradient />
        </div>

        {/* right column: fixed width sidebar */}
        <div className="w-1/3 flex-none">
          <ChartPieLegend />
        </div>
      </div>
    </div>
  );
}
