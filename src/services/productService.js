import localforage from 'localforage';
    import { v4 as uuidv4 } from 'uuid';

    const PRODUCT_KEY = 'products';

    export const createProduct = async (product) => {
      const products = (await localforage.getItem(PRODUCT_KEY)) || [];
      const newProduct = { ...product, id: uuidv4() };
      products.push(newProduct);
      await localforage.setItem(PRODUCT_KEY, products);
      return newProduct;
    };

    export const getProducts = async () => {
      return (await localforage.getItem(PRODUCT_KEY)) || [];
    };

    export const updateProduct = async (id, updatedProduct) => {
      const products = (await localforage.getItem(PRODUCT_KEY)) || [];
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      );
      await localforage.setItem(PRODUCT_KEY, updatedProducts);
      return updatedProduct;
    };

    export const deleteProduct = async (id) => {
      const products = (await localforage.getItem(PRODUCT_KEY)) || [];
      const filteredProducts = products.filter((product) => product.id !== id);
      await localforage.setItem(PRODUCT_KEY, filteredProducts);
    };
