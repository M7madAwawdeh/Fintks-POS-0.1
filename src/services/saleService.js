import localforage from 'localforage';
    import { v4 as uuidv4 } from 'uuid';
    import { getProducts, updateProduct } from './productService';

    const SALE_KEY = 'sales';

    export const processSale = async (sale) => {
      const sales = (await localforage.getItem(SALE_KEY)) || [];
      const newSale = { ...sale, id: uuidv4(), timestamp: new Date() };
      sales.push(newSale);
      await localforage.setItem(SALE_KEY, sales);

      // Update product stock
      const products = await getProducts();
      for (const item of sale.items) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const updatedStock = product.stock - item.quantity;
          await updateProduct(product.id, { ...product, stock: updatedStock });
        }
      }

      return newSale;
    };

    export const getSales = async () => {
      return (await localforage.getItem(SALE_KEY)) || [];
    };
