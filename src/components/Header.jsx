const Header = ({ activeRange, setRange }) => {
  const getButtonClass = (range) => {
    return activeRange === range
      ? 'px-3 py-1 bg-blue-600 rounded-md'
      : 'px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600';
  };

  return (
    <header className="flex justify-between items-center p-4 text-white">
      <h1 className="text-2xl font-bold">SupplySight</h1>
      <div className="flex gap-2">
        <button onClick={() => setRange('7d')} className={getButtonClass('7d')}>7d</button>
        <button onClick={() => setRange('14d')} className={getButtonClass('14d')}>14d</button>
        <button onClick={() => setRange('30d')} className={getButtonClass('30d')}>30d</button>
      </div>
    </header>
  );
};

export default Header;