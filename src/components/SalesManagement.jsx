import React, { useState, useEffect, useRef } from 'react';
    import { getProducts } from '../services/productService';
    import { processSale } from '../services/saleService';
    import { useTranslation } from '../hooks/useTranslation';
    import './SalesManagement.css';

    function SalesManagement() {
      const [products, setProducts] = useState([]);
      const [cart, setCart] = useState([]);
      const [discount, setDiscount] = useState(0);
      const [taxRate, setTaxRate] = useState(0.05);
      const [paymentMethod, setPaymentMethod] = useState('cash');
      const [error, setError] = useState('');
      const [searchQuery, setSearchQuery] = useState('');
      const [categoryFilter, setCategoryFilter] = useState('all');
      const [currentPage, setCurrentPage] = useState(1);
      const productsPerPage = 12;
      const { t } = useTranslation();
      const printRef = useRef(null);

      useEffect(() => {
        fetchProducts();
      }, []);

      const fetchProducts = async () => {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      };

      const handleAddToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          setCart(
            cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          );
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      };

      const handleRemoveFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
      };

      const handleQuantityChange = (productId, newQuantity) => {
        setCart(
          cart.map((item) =>
            item.id === productId ? { ...item, quantity: parseInt(newQuantity, 10) } : item
          )
        );
      };

      const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscount(value === '' ? 0 : parseFloat(value));
      };

      const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
      };

      const calculateSubtotal = () => {
        return cart.reduce((acc, item) => acc + (isNaN(item.price * item.quantity) ? 0 : item.price * item.quantity), 0);
      };

      const calculateDiscountedTotal = () => {
        const subtotal = calculateSubtotal();
        const discountAmount = (subtotal * discount) / 100;
        return subtotal - discountAmount;
      };

      const calculateTax = () => {
        const discountedTotal = calculateDiscountedTotal();
        return discountedTotal * taxRate;
      };

      const calculateTotal = () => {
        return calculateDiscountedTotal() + calculateTax();
      };

      const handleProcessSale = async () => {
        setError('');
        if (cart.length === 0) {
          setError(t('cartEmpty'));
          return;
        }
        for (const item of cart) {
          const product = products.find((p) => p.id === item.id);
          if (product && item.quantity > product.stock) {
            setError(`${t('notEnoughStock')} ${product.name}`);
            return;
          }
        }

        const saleData = {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          discount,
          taxRate,
          paymentMethod,
          total: calculateTotal(),
        };
        try {
          await processSale(saleData);
          setCart([]);
          setDiscount(0);
          alert(t('saleProcessedSuccessfully'));
        } catch (err) {
          setError(`${t('failedToProcessSale')} ${err.message}`);
        }
      };

      const handleProcessSaleWithInvoice = async () => {
        setError('');
        if (cart.length === 0) {
          setError(t('cartEmpty'));
          return;
        }
        for (const item of cart) {
          const product = products.find((p) => p.id === item.id);
          if (product && item.quantity > product.stock) {
            setError(`${t('notEnoughStock')} ${product.name}`);
            return;
          }
        }

        const saleData = {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          discount,
          taxRate,
          paymentMethod,
          total: calculateTotal(),
        };
        try {
          await processSale(saleData);
          setCart([]);
          setDiscount(0);
          alert(t('saleProcessedSuccessfully'));
          if (printRef.current) {
            const originalContents = document.body.innerHTML;
            const printContents = printRef.current.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
          }
        } catch (err) {
          setError(`${t('failedToProcessSale')} ${err.message}`);
        }
      };

      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
      };

      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.stock > 0 &&
        (categoryFilter === 'all' || product.category === categoryFilter)
      );

      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );

      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

      const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

      return (
        <div className="sales-management">
          <h2>{t('pointOfSale')}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="sales-container">
            <div className="product-section">
              <div className="form-group">
                <input
                  type="text"
                  placeholder={t('searchByProductName')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="category-filter">
                <label>{t('category')}: </label>
                <select value={categoryFilter} onChange={handleCategoryFilterChange}>
                  <option value="all">{t('all')}</option>
                  <option value="electronics">{t('electronics')}</option>
                  <option value="food">{t('food')}</option>
                  <option value="books">{t('books')}</option>
                  <option value="clothing">{t('clothing')}</option>
                  <option value="home">{t('home')}</option>
                  <option value="beauty">{t('beauty')}</option>
                  <option value="toys">{t('toys')}</option>
                  <option value="sports">{t('sports')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                    <h4>{product.name}</h4>
                    <p className="product-price">
                      {t('price')}: ${product.price}
                    </p>
                    <p className="product-stock">
                      {t('stock')}: {product.stock}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="cart-section">
              <h3>{t('shoppingCart')}</h3>
              <table>
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('price')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('total')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="quantity-input"
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                      </td>
                      <td>${isNaN(item.price * item.quantity) ? 0 : (item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button onClick={() => handleRemoveFromCart(item.id)}>
                          {t('remove')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="form-group">
                <label>{t('discount')}</label>
                <input
                  type="number"
                  value={discount}
                  onChange={handleDiscountChange}
                />
              </div>
              <div className="form-group">
                <label>{t('paymentMethod')}</label>
                <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                  <option value="cash">{t('cash')}</option>
                  <option value="credit">{t('creditCard')}</option>
                  <option value="digital">{t('digitalWallet')}</option>
                </select>
              </div>
              <p>{t('subtotal')}: ${isNaN(calculateSubtotal()) ? 0 : calculateSubtotal().toFixed(2)}</p>
              <p>{t('discountedTotal')}: ${isNaN(calculateDiscountedTotal()) ? 0 : calculateDiscountedTotal().toFixed(2)}</p>
              <p>{t('tax')}: ${isNaN(calculateTax()) ? 0 : calculateTax().toFixed(2)}</p>
              <p>{t('total')}: ${isNaN(calculateTotal()) ? 0 : calculateTotal().toFixed(2)}</p>
              <div className="sale-buttons">
                <button onClick={handleProcessSaleWithInvoice}>{t('saleWithInvoice')}</button>
                <button onClick={handleProcessSale}>{t('saleWithoutInvoice')}</button>
              </div>
            </div>
          </div>
          <div style={{ display: 'none' }} ref={printRef}>
            <div className="invoice-container">
              <h2>{t('invoice')}</h2>
              <table>
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('price')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>{t('subtotal')}: ${isNaN(calculateSubtotal()) ? 0 : calculateSubtotal().toFixed(2)}</p>
              <p>{t('discountedTotal')}: ${isNaN(calculateDiscountedTotal()) ? 0 : calculateDiscountedTotal().toFixed(2)}</p>
              <p>{t('tax')}: ${isNaN(calculateTax()) ? 0 : calculateTax().toFixed(2)}</p>
              <p>{t('total')}: ${isNaN(calculateTotal()) ? 0 : calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>
      );
    }

    export default SalesManagement;
