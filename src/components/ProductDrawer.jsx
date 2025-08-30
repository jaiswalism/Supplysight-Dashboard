import { useState, useEffect } from 'react';
import { useMutation } from 'urql';

const UPDATE_DEMAND_MUTATION = `
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
    }
  }
`;

const TRANSFER_STOCK_MUTATION = `
  mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) {
      id
      stock
    }
  }
`;

const ProductDrawer = ({ product, onClose, onMutationSuccess }) => {
  const [newDemand, setNewDemand] = useState('');
  const [transferQty, setTransferQty] = useState('');

  useEffect(() => {
    if (product) {
      setNewDemand(product.demand);
      setTransferQty('');
    }
  }, [product]);
  
  const [updateDemandResult, updateDemand] = useMutation(UPDATE_DEMAND_MUTATION);
  const [transferStockResult, transferStock] = useMutation(TRANSFER_STOCK_MUTATION);

  if (!product) {
    return null;
  }

  const handleUpdateDemand = (e) => {
    e.preventDefault();
    const demand = parseInt(newDemand, 10);
    if (!isNaN(demand)) {
      updateDemand({ id: product.id, demand }).then((result) => {
        if (!result.error) {
          onMutationSuccess();
          onClose();
        }
      });
    }
  };
  
  const handleTransferStock = (e) => {
    e.preventDefault();
    const qty = parseInt(transferQty, 10);
    if (!isNaN(qty) && qty > 0) {
      transferStock({ id: product.id, from: product.warehouse, to: "OTHER-WH", qty }).then((result) => {
        if (!result.error) {
          onMutationSuccess(); 
          onClose();
        }
      });
    }
  };


  return (
    <aside className="w-96 bg-slate-800 p-6 text-white shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">Product Details</h3>
        <div className="space-y-2 text-slate-300">
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Warehouse:</strong> {product.warehouse}</p>
          <p><strong>Stock:</strong> {product.stock} units</p>
          <p><strong>Demand:</strong> {product.demand} units</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">Update Demand</h3>
        <form onSubmit={handleUpdateDemand}>
          <input
            type="number"
            value={newDemand}
            onChange={(e) => setNewDemand(e.target.value)}
            placeholder="New demand value"
            className="w-full p-2 bg-slate-700 rounded-md border border-slate-600"
          />
          <button type="submit" className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-md font-bold">
            {updateDemandResult.fetching ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">Transfer Stock</h3>
        <form onSubmit={handleTransferStock}>
          <input
            type="number"
            value={transferQty}
            onChange={(e) => setTransferQty(e.target.value)}
            placeholder="Quantity to transfer"
            className="w-full p-2 bg-slate-700 rounded-md border border-slate-600"
          />
          <button type="submit" className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-md font-bold">
            {transferStockResult.fetching ? 'Transferring...' : 'Transfer'}
          </button>
        </form>
      </div>
    </aside>
  );
};

export default ProductDrawer;