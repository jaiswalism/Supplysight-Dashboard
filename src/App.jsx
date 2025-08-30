import React, { useState, useMemo } from 'react';
import { useQuery } from 'urql';
import Header from './components/Header';
import KpiCard from './components/KpiCard';
import KpiChart from './components/KpiChart';
import Filters from './components/Filters';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';
import Pagination from './components/Pagination';

const GetProductsQuery = `
  query($search: String, $warehouse: String, $status: String) {
    products(search: $search, warehouse: $warehouse, status: $status) {
      id name sku warehouse stock demand
    }
  }
`;

const GetKpisQuery = `
  query($range: String!) {
    kpis(range: $range) {
      date stock demand
    }
  }
`;

const ITEMS_PER_PAGE = 10;

function App() {
  const [filters, setFilters] = useState({ search: '', warehouse: '', status: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [kpiRange, setKpiRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);

  const [productsResult, reexecuteProductsQuery] = useQuery({ query: GetProductsQuery, variables: filters });
  const [kpiResult] = useQuery({ query: GetKpisQuery, variables: { range: kpiRange } });

  const { data: productsData, fetching: productsFetching, error: productsError } = productsResult;
  const { data: kpisData, fetching: kpisFetching, error: kpisError } = kpiResult;

  const kpis = useMemo(() => {
    if (!productsData || !productsData.products) return { totalStock: 0, totalDemand: 0, fillRate: '0.00%' };
    const totalStock = productsData.products.reduce((acc, p) => acc + p.stock, 0);
    const totalDemand = productsData.products.reduce((acc, p) => acc + p.demand, 0);
    const fillableStock = productsData.products.reduce((acc, p) => acc + Math.min(p.stock, p.demand), 0);
    const fillRate = totalDemand > 0 ? (fillableStock / totalDemand) * 100 : 0;
    return { totalStock, totalDemand, fillRate: `${fillRate.toFixed(2)}%` };
  }, [productsData]);

  const paginatedProducts = useMemo(() => {
    if (!productsData?.products) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return productsData.products.slice(startIndex, endIndex);
  }, [productsData, currentPage]);
  
  const totalPages = useMemo(() => {
    if (!productsData?.products) return 1;
    return Math.ceil(productsData.products.length / ITEMS_PER_PAGE);
  }, [productsData]);


  if (productsError || kpisError) return <p className="text-red-500 text-center mt-8">Error: {productsError?.message || kpisError?.message}</p>;

  return (
    <div className="bg-slate-900 min-h-screen p-4 md:p-8 flex">
      <main className="flex-1 transition-all duration-300">
        <Header activeRange={kpiRange} setRange={setKpiRange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <KpiCard title="Total Stock" value={productsFetching ? '...' : kpis.totalStock} />
          <KpiCard title="Total Demand" value={productsFetching ? '...' : kpis.totalDemand} />
          <KpiCard title="Fill Rate" value={productsFetching ? '...' : kpis.fillRate} />
        </div>

        {kpisFetching ? <p className="text-white text-center">Loading Chart...</p> : <KpiChart data={kpisData?.kpis} />}
        
        <Filters filters={filters} setFilters={setFilters} />
        
        {productsFetching && <p className="text-white text-center mt-8">Loading Products...</p>}
        {!productsFetching && productsData && (
          <>
            <ProductsTable 
              products={paginatedProducts} 
              onRowClick={setSelectedProduct} 
            />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
      
      <ProductDrawer 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onMutationSuccess={() => reexecuteProductsQuery({ requestPolicy: 'network-only' })}
      />
    </div>
  );
}

export default App;