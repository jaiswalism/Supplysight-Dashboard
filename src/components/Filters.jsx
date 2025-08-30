import { useQuery } from 'urql';

const GetWarehousesQuery = `
  query {
    warehouses {
      code
      name
    }
  }
`;

const Filters = ({ filters, setFilters }) => {
  const [{ data: warehousesData, fetching, error }] = useQuery({ query: GetWarehousesQuery });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 my-4">
      <input
        type="text"
        name="search"
        placeholder="Search by name, SKU, or ID"
        value={filters.search}
        onChange={handleInputChange}
        className="flex-grow p-2 bg-slate-700 rounded-md text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="warehouse"
        value={filters.warehouse}
        onChange={handleInputChange}
        className="p-2 bg-slate-700 rounded-md text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Warehouses</option>
        {warehousesData && warehousesData.warehouses.map(w => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>
      <select
        name="status"
        value={filters.status}
        onChange={handleInputChange}
        className="p-2 bg-slate-700 rounded-md text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="Healthy">Healthy</option>
        <option value="Low">Low</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  );
};

export default Filters;