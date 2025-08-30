const ProductsTable = ({ products = [], onRowClick }) => {
  const getStatus = (stock, demand) => {
    if (stock < demand) return { text: 'Critical', color: 'bg-red-500', row: 'bg-red-900 bg-opacity-30' };
    if (stock === demand) return { text: 'Low', color: 'bg-yellow-500', row: '' };
    return { text: 'Healthy', color: 'bg-green-500', row: '' };
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-slate-800 text-white">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-3 text-left font-semibold">Product</th>
            <th className="p-3 text-left font-semibold">SKU</th>
            <th className="p-3 text-left font-semibold">Warehouse</th>
            <th className="p-3 text-left font-semibold">Stock</th>
            <th className="p-3 text-left font-semibold">Demand</th>
            <th className="p-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = getStatus(product.stock, product.demand);
            return (
              <tr 
                key={product.id} 
                onClick={() => onRowClick(product)}
                className={`border-b border-slate-700 hover:bg-slate-700 cursor-pointer ${status.row}`}
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.warehouse}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.demand}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color} text-white`}>
                    {status.text}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;