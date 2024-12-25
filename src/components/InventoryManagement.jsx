import React, { useState, useEffect } from 'react';
    import { getProducts } from '../services/productService';

    function InventoryManagement() {
      const [products, setProducts] = useState([]);

      useEffect(() => {
        fetchProducts();
      }, []);

      const fetchProducts = async () => {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      };

      return (
        <div>
          <h2>Inventory Management</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default InventoryManagement;
