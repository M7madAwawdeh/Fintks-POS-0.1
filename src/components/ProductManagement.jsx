import React, { useState, useEffect } from 'react';
    import {
      createProduct,
      getProducts,
      updateProduct,
      deleteProduct,
    } from '../services/productService';
    import { useTranslation } from '../hooks/useTranslation';
    import './ProductManagement.css';
    import { useLanguage } from '../contexts/LanguageContext';

    function ProductManagement() {
      const [products, setProducts] = useState([]);
      const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        category: 'all',
      });
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editMode, setEditMode] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const productsPerPage = 12;
      const { t } = useTranslation();
      const [imageFile, setImageFile] = useState(null);
      const { language } = useLanguage();

      useEffect(() => {
        fetchProducts();
      }, []);

      const fetchProducts = async () => {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      };

      const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
      };

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewProduct({ ...newProduct, imageUrl: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };

      const handleCreateProduct = async () => {
        await createProduct(newProduct);
        fetchProducts();
        setNewProduct({ name: '', price: 0, stock: 0, imageUrl: '', category: 'all' });
        setIsModalOpen(false);
        setImageFile(null);
      };

      const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setNewProduct({
          name: product.name,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl || '',
          category: product.category || 'all',
        });
        setIsModalOpen(true);
        setEditMode(true);
      };

      const handleUpdateProduct = async () => {
        if (selectedProduct) {
          await updateProduct(selectedProduct.id, {
            ...newProduct,
            id: selectedProduct.id,
          });
          fetchProducts();
          setNewProduct({ name: '', price: 0, stock: 0, imageUrl: '', category: 'all' });
          setSelectedProduct(null);
          setIsModalOpen(false);
          setEditMode(false);
          setImageFile(null);
        }
      };

      const handleDeleteProduct = async (id) => {
        await deleteProduct(id);
        fetchProducts();
      };

      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
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

      const openModal = () => {
        setIsModalOpen(true);
        setEditMode(false);
        setNewProduct({ name: '', price: 0, stock: 0, imageUrl: '', category: 'all' });
        setImageFile(null);
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setEditMode(false);
        setNewProduct({ name: '', price: 0, stock: 0, imageUrl: '', category: 'all' });
        setImageFile(null);
      };

      return (
        <div className="product-management">
          <h2>{t('productManagement')}</h2>
          <div className="search-and-add">
            <div className="form-group">
              <input
                type="text"
                placeholder={t('searchByProductName')}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button onClick={openModal}>{t('addNewProduct')}</button>
          </div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h3>{editMode ? t('updateProduct') : t('addNewProduct')}</h3>
                <div className="form-group">
                  <label>{t('name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('price')}</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('stock')}</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('category')}</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                  >
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
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {newProduct.imageUrl && (
                  <img
                    src={newProduct.imageUrl}
                    alt="Product Preview"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
                <div className="modal-actions">
                  {editMode ? (
                    <button
                      onClick={handleUpdateProduct}
                      style={{ float: language === 'ar' ? 'left' : 'right' }}
                    >
                      {t('updateProduct')}
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateProduct}
                      style={{ float: language === 'ar' ? 'left' : 'right' }}
                    >
                      {t('createProduct')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="product-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <h4>{product.name}</h4>
                <p>
                  {t('price')}: ${product.price}
                </p>
                <p>
                  {t('stock')}: {product.stock}
                </p>
                <div className="product-actions">
                  <button onClick={() => handleEditProduct(product)}>{t('edit')}</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    {t('delete')}
                  </button>
                </div>
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
      );
    }

    export default ProductManagement;
