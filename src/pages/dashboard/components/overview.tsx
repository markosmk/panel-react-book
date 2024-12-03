import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function Overview({
  data = {},
  isLoading
}: {
  data: Record<string, number>;
  isLoading: boolean;
}) {
  const formatData = Object.keys(data).map((month) => ({
    name: month,
    total: data[month]
  }));

  if (isLoading) {
    return <div className="p-5">CArcanfgo....</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formatData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
}
