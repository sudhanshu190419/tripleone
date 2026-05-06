"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  PROPERTY_CATEGORY_COLLECTION,
  PROPERTY_LOCATION_COLLECTION,
  TaxonomyCollectionName,
} from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";

type TaxonomyManagerProps = {
  collectionName: TaxonomyCollectionName;
  title: string;
  description: string;
  placeholder: string;
};

export default function TaxonomyManager({
  collectionName,
  title,
  description,
  placeholder,
}: TaxonomyManagerProps) {
  const { items, loading, error, addItem, removeItem } =
    usePropertyTaxonomy(collectionName);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setActionError("Value cannot be empty");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      await addItem(trimmed);
      setName("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item";
      setActionError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(`Delete this ${title.toLowerCase().replace(/s$/, "")}?`);

    if (!confirmed) return;

    try {
      await removeItem(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete item";
      setActionError(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <p className="text-neutral-500 mb-8">{description}</p>

      <form onSubmit={handleAdd} className="space-y-4 mb-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="w-full border p-3 rounded-lg"
        />

        {(actionError || error) && (
          <p className="text-sm text-red-600">
            {actionError || error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-black text-white rounded-lg disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Add"}
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{item.name}</h2>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg inline-flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-neutral-500">No items yet.</p>
        )}
      </div>
    </div>
  );
}

export const TAXONOMY_ROUTE_LABELS = {
  locations: PROPERTY_LOCATION_COLLECTION,
  categories: PROPERTY_CATEGORY_COLLECTION,
};
