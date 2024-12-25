import React, { useState, useEffect } from 'react';
    import { getSales } from '../services/saleService';
    import { getProducts } from '../services/productService';
    import { getUsers } from '../services/userService';
    import { useTranslation } from '../hooks/useTranslation';
    import './Dashboard.css';

    function Dashboard() {
      const [totalSales, setTotalSales] = useState(0);
      const [lastOrder, setLastOrder] = useState(null);
      const [lowStockProducts, setLowStockProducts] = useState([]);
      const [onlineUsers, setOnlineUsers] = useState(0);
      const [favoriteProducts, setFavoriteProducts] = useState([]);
      const { t } = useTranslation();

      useEffect(() => {
        fetchDashboardData();
        const intervalId = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(intervalId);
      }, []);

      const fetchDashboardData = async () => {
        try {
          const sales = await getSales();
          const products = await getProducts();
          const users = await getUsers();

          // Calculate total sales
          const total = sales.reduce((acc, sale) => acc + (isNaN(sale.total) ? 0 : sale.total), 0);
          setTotalSales(total);

          // Get last order
          const last = sales.length > 0 ? sales[sales.length - 1] : null;
          setLastOrder(last);

          // Get low stock products
          const lowStock = products.filter((product) => product.stock < 20);
          setLowStockProducts(lowStock);

          // Get online users (for simplicity, we'll just count all users)
          setOnlineUsers(users.length);

          // Get favorite products (for simplicity, we'll just take the first 3)
          setFavoriteProducts(products.slice(0, 3));
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      return (
        <div className="dashboard">
          <h2>{t('welcome')}</h2>
          <div className="dashboard-grid">
            <div className="dashboard-item">
              <h3>{t('totalSales')}</h3>
              <p>${totalSales.toFixed(2)}</p>
            </div>
            <div className="dashboard-item">
              <h3>{t('lastOrder')}</h3>
              {lastOrder ? (
                <p>
                  ${isNaN(lastOrder.total) ? 0 : lastOrder.total.toFixed(2)} -{' '}
                  {new Date(lastOrder.timestamp).toLocaleString()}
                </p>
              ) : (
                <p>{t('noOrdersYet')}</p>
              )}
            </div>
            <div className="dashboard-item">
              <h3>{t('lowStockProducts')}</h3>
              {lowStockProducts.length > 0 ? (
                <ul>
                  {lowStockProducts.map((product) => (
                    <li key={product.id}>
                      {product.name} ({product.stock})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('noLowStockProducts')}</p>
              )}
            </div>
            <div className="dashboard-item">
              <h3>{t('onlineUsers')}</h3>
              <p>{onlineUsers}</p>
            </div>
            <div className="dashboard-item">
              <h3>{t('favoriteProducts')}</h3>
              {favoriteProducts.length > 0 ? (
                <ul>
                  {favoriteProducts.map((product) => (
                    <li key={product.id}>{product.name}</li>
                  ))}
                </ul>
              ) : (
                <p>{t('noFavoriteProducts')}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    export default Dashboard;
