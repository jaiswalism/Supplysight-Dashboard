import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server';
import express from 'express';
import cors from 'cors'; // Import cors

const getStatus = (stock, demand) => {
  if (stock > demand) return 'Healthy';
  if (stock === demand) return 'Low';
  return 'Critical';
};

const typeDefs = `#graphql
  type Warehouse { code: ID! name: String! city: String! country: String! }
  type Product { id: ID! name: String! sku: String! warehouse: String! stock: Int! demand: Int! }
  type KPI { date: String! stock: Int! demand: Int! }
  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }
  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

const productsData = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 },
  { "id": "P-1005", "name": "Spring L", "sku": "SPG-L-10", "warehouse": "BLR-A", "stock": 150, "demand": 100 },
  { "id": "P-1006", "name": "Rubber Gasket", "sku": "GSK-R-20", "warehouse": "DEL-B", "stock": 75, "demand": 150 },
  { "id": "P-1007", "name": "Copper Wire 1m", "sku": "WIR-CU-1", "warehouse": "PNQ-C", "stock": 300, "demand": 300 },
];
const warehousesData = [
    { code: 'BLR-A', name: 'Bengaluru A', city: 'Bengaluru', country: 'India' },
    { code: 'PNQ-C', name: 'Pune C', city: 'Pune', country: 'India' },
    { code: 'DEL-B', name: 'Delhi B', city: 'Delhi', country: 'India' },
];
const kpisData = {
    '7d': [ { date: 'Day 1', stock: 400, demand: 320 }, { date: 'Day 7', stock: 550, demand: 480 } ],
    '14d': [ { date: 'Day 1', stock: 500, demand: 400 }, { date: 'Day 14', stock: 650, demand: 550 } ],
    '30d': [ { date: 'Day 1', stock: 600, demand: 500 }, { date: 'Day 30', stock: 750, demand: 650 } ],
};

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filteredProducts = productsData;
      if (warehouse) filteredProducts = filteredProducts.filter(p => p.warehouse === warehouse);
      if (status) filteredProducts = filteredProducts.filter(p => getStatus(p.stock, p.demand) === status);
      if (search) {
        const term = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
      }
      return filteredProducts;
    },
    warehouses: () => warehousesData,
    kpis: (_, { range }) => kpisData[range] || kpisData['7d'],
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = productsData.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      product.demand = demand;
      return product;
    },
    transferStock: (_, { id, from, to, qty }) => {
        const product = productsData.find(p => p.id === id && p.warehouse === from);
        if (!product) throw new Error('Product not found at the source warehouse');
        if (product.stock < qty) throw new Error('Insufficient stock for transfer');
        product.stock -= qty;
        console.log(`Transferred ${qty} of ${product.name} from ${from} to ${to}`);
        return product;
    },
  },
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// We must await server.start() before calling expressMiddleware
await server.start();

app.use(cors(), express.json(), expressMiddleware(server));

// This is the Vercel-compatible serverless function handler
export default app;