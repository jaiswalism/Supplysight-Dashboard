const KpiCard = ({ title, value }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg text-white shadow-md">
      <h2 className="text-sm text-slate-400">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};
export default KpiCard;