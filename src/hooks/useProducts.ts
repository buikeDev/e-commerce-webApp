import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchFeaturedProducts,
} from "@/lib/queries";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !isNaN(id),
  });

export const useCategoryProducts = (category: string) =>
  useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => fetchProductsByCategory(category),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
