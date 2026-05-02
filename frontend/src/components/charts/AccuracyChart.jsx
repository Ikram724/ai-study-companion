import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

export default function AccuracyChart({ data }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Accuracy Trend</p>
        <p className="text-xs text-white/50">Last sessions</p>
      </div>

      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "rgba(10,12,18,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Area type="monotone" dataKey="accuracy" strokeWidth={2} stroke="#3b82f6" fill="rgba(59,130,246,0.20)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
