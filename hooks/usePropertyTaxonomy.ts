"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addTaxonomyItem,
  deleteTaxonomyItem,
  fetchTaxonomyItems,
  TaxonomyCollectionName,
  TaxonomyItem,
} from "@/lib/propertyTaxonomy";

export function usePropertyTaxonomy(collectionName: TaxonomyCollectionName) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTaxonomyItems(collectionName);
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (name: string) => {
      await addTaxonomyItem(collectionName, name);
      await refresh();
    },
    [collectionName, refresh]
  );

  const removeItem = useCallback(
    async (id: string) => {
      await deleteTaxonomyItem(collectionName, id);
      await refresh();
    },
    [collectionName, refresh]
  );

  return {
    items,
    loading,
    error,
    refresh,
    addItem,
    removeItem,
  };
}
