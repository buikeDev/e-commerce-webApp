import { products } from "@/mockData/mockProducts";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const fetchProducts = async () => {
  await delay();
  return products;
};

export const fetchProductById = async (id: number) => {
  await delay();
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  return product;
};

export const fetchProductsByCategory = async (category: string) => {
  await delay();
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
};

export const fetchFeaturedProducts = async () => {
  await delay();
  return products.slice(0, 8);
};
