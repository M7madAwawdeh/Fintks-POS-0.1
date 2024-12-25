import React, { useState, useEffect } from 'react';
    import { getSales } from '../services/saleService';
    import { getProducts } from '../services/productService';

    function SalesHistory() {
      const [sales, setSales] = useState([]);
      const [products, setProducts] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [searchQuery, setSearchQuery] = useState('');
      const salesPerPage = 10;

      useEffect(() => {
        fetchSales();
        fetchProducts();
      }, []);

      const fetchSales = async () => {
        const fetchedSales = await getSales();
        // Sort sales by timestamp in descending order
        const sortedSales = fetchedSales.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setSales(sortedSales);
      };

      const fetchProducts = async () => {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      };

      const getProductName = (productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.name : 'Unknown';
      };

      const indexOfLastSale = currentPage * salesPerPage;
      const indexOfFirstSale = indexOfLastSale - salesPerPage;
      const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);

      const totalPages = Math.ceil(sales.length / salesPerPage);

      const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const filteredSales = sales.filter((sale) =>
        sale.items.some(item =>
          getProductName(item.productId).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      const indexOfLastFilteredSale = currentPage * salesPerPage;
      const indexOfFirstFilteredSale = indexOfLastFilteredSale - salesPerPage;
      const currentFilteredSales = filteredSales.slice(indexOfFirstFilteredSale, indexOfLastFilteredSale);
      const totalFilteredPages = Math.ceil(filteredSales.length / salesPerPage);

      return (
        <div>
          <h2>Sales History</h2>
          <div className="form-group">
            <label>Search Sales</label>
            <input
              type="text"
              placeholder="Search by product name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {searchQuery ? currentFilteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{new Date(sale.timestamp).toLocaleString()}</td>
                  <td>
                    <ul>
                      {sale.items.map((item) => (
                        <li key={item.productId}>
                          {getProductName(item.productId)}, Quantity: {item.quantity}, Price: {item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${sale.total.toFixed(2)}</td>
                </tr>
              )) : currentSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{new Date(sale.timestamp).toLocaleString()}</td>
                  <td>
                    <ul>
                      {sale.items.map((item) => (
                        <li key={item.productId}>
                          {getProductName(item.productId)}, Quantity: {item.quantity}, Price: {item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${sale.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {searchQuery ? totalFilteredPages : totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={searchQuery ? currentPage === totalFilteredPages : currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    export default SalesHistory;
