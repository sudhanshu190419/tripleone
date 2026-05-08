"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { Trash2 } from "lucide-react";
import { db} from "@/lib/firebase";
import { CAROUSEL_IMAGES_COLLECTION, type CarouselImage } from "@/lib/carousel";


type FormState = {
 src: string;
  alt: string;
  order: string;
};

const DEFAULT_ORDER = 9999;

export default function CarouselManager() {
  const [items, setItems] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    src: "",
    alt: "",
    order: "",
  });

  

  const previewAlt = useMemo(() => {
    if (form.alt.trim()) return form.alt.trim();
    if (form.src.trim()) return "Carousel preview";
    return "";
  }, [form.alt, form.src]);

  useEffect(() => {
    const q = query(
      collection(db, CAROUSEL_IMAGES_COLLECTION),
      orderBy("order", "asc"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextItems = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const rawOrder = typeof data.order === "number" ? data.order : DEFAULT_ORDER;

          return {
            id: docSnap.id,
            src: String(data.src || ""),
            alt: String(data.alt || ""),
            order: rawOrder,
          };
        });

        setItems(nextItems.filter((item) => item.src));
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load carousel images.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };
const handleAdd = async (event: React.FormEvent) => {
  event.preventDefault();

  const src = form.src.trim();

  if (!src) {
    setError("Please enter an image URL.");
    return;
  }

  const alt = form.alt.trim();
  const orderNumber = Number(form.order);
  const order = Number.isFinite(orderNumber)
    ? orderNumber
    : DEFAULT_ORDER;

  setSubmitting(true);
  setError(null);

  try {
    await addDoc(
      collection(db, CAROUSEL_IMAGES_COLLECTION),
      {
        src,
        alt,
        order,
        createdAt: serverTimestamp(),
      }
    );

    setForm({
      src: "",
      alt: "",
      order: "",
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to add image.";

    setError(message);
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (id: string) => {
  const confirmed = confirm(
    "Remove this carousel image?"
  );

  if (!confirmed) return;

  try {
    await deleteDoc(
      doc(db, CAROUSEL_IMAGES_COLLECTION, id)
    );
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to delete image.";

    setError(message);
  }

};
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold mb-3">Carousel Gallery</h1>
      <p className="text-neutral-500 mb-8">
        Update the images shown in the “A glimpse into our spaces, stories & stays” carousel.
        Paste a Cloudinary, Google Drive, or direct image URL to update the carousel.
      </p>

      <form onSubmit={handleAdd} className="grid gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Image URL</label>
           <input
  value={form.src}
  onChange={handleChange("src")}
  placeholder="Paste image URL"
  className="w-full rounded-lg border px-3 py-2.5 text-sm"
/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Alt text (optional)</label>
            <input
              value={form.alt}
              onChange={handleChange("alt")}
              placeholder="Luxury suite interior"
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Order (optional)</label>
            <input
              value={form.order}
              onChange={handleChange("order")}
              placeholder="1"
              type="number"
              min="0"
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-neutral-500">
            {previewAlt && <span>Preview alt text: {previewAlt}</span>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Saving..." : "Add image"}
          </button>
        </div>
      </form>

      <div className="mt-10">
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="h-[140px] w-full overflow-hidden rounded-xl border bg-neutral-50 sm:w-[180px]">
                  <img
                    src={item.src}
                    alt={item.alt || "Carousel image"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 break-all">{item.src}</p>
                  <p className="text-sm text-neutral-500">Alt: {item.alt || "—"}</p>
                  <p className="text-xs text-neutral-400">Order: {item.order}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">No carousel images yet.</p>
        )}
      </div>
    </div>
  );
}
