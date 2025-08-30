import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KpiChart = ({ data }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mt-6" style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Legend />
          <Line type="monotone" dataKey="stock" stroke="#8884d8" activeDot={{ r: 8 }} name="Stock" />
          <Line type="monotone" dataKey="demand" stroke="#82ca9d" name="Demand" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KpiChart;