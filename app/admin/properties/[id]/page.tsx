"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import {
  PROPERTY_CATEGORY_COLLECTION,
  PROPERTY_LOCATION_COLLECTION,
  TaxonomyItem,
} from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

const fieldConfigs = [
  { name: "title", type: "text" },
  { name: "price", type: "number" },
  { name: "rating", type: "number" },
  { name: "reviews", type: "number" },
  { name: "phone", type: "text" },
  { name: "email", type: "email" },
  { name: "address", type: "text" },
  { name: "checkIn", type: "date" },
  { name: "checkOut", type: "date" },
] as const;

const createInitialForm = () => ({
  title: "",
  location: "",
  category: "",
  price: "",
  rating: "",
  reviews: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  checkIn: "",
  checkOut: "",
});

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [form, setForm] = useState(createInitialForm());
  const [propertyLoading, setPropertyLoading] = useState(true);
  const {
    items: locations,
    loading: locationsLoading,
    error: locationsError,
  } = usePropertyTaxonomy(PROPERTY_LOCATION_COLLECTION);
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = usePropertyTaxonomy(PROPERTY_CATEGORY_COLLECTION);

  const loadingTaxonomy = locationsLoading || categoriesLoading;
  const taxonomyError = locationsError || categoriesError;

  const buildOptions = (items: TaxonomyItem[], currentValue: string) => {
    const values = items.map((item) => item.name);

    if (currentValue.trim()) {
      values.push(currentValue.trim());
    }

    return Array.from(new Set(values));
  };

  if (propertyLoading || loadingTaxonomy) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6">
        <FormSkeleton />
      </div>
    );
  }

  useEffect(() => {
    const fetchProperty = async () => {
      const docRef = doc(db, "properties", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setExistingImages(data.images || []);

        setForm({
          title: data.title || "",
          location: data.location || "",
          category: data.category || "",
          price: data.price?.toString() || "",
          rating: data.rating?.toString() || "",
          reviews: data.reviews?.toString() || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          checkIn: data.checkIn || "",
          checkOut: data.checkOut || "",
        });
      }

      setPropertyLoading(false);
    };

    fetchProperty();
  }, [id]);
  const uploadImages = async () => {
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      if (!file) continue;
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = await uploadImages();
    try {
      await updateDoc(doc(db, "properties", id as string), {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        images: imageUrls.length ? imageUrls : existingImages,
      });

      alert("Property updated successfully");
      router.push("/admin/properties");
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        {taxonomyError && (
          <p className="text-sm text-red-600">{taxonomyError}</p>
        )}

        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          disabled={loadingTaxonomy}
        >
          <option value="">Select City</option>
          {buildOptions(locations, form.location).map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          disabled={loadingTaxonomy}
        >
          <option value="">Select Category</option>
          {buildOptions(categories, form.category).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {fieldConfigs.map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            value={form[field.name as keyof typeof form] as string}
            onChange={handleChange}
            placeholder={field.name}
            className="w-full border p-3 rounded-lg"
          />
        ))}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
        />
        {["Main Image", "Side Image 1", "Side Image 2"].map((label, index) => (
          <div key={index}>
            <label className="block mb-2 text-sm font-medium">{label}</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const updatedFiles = [...imageFiles];
                  updatedFiles[index] = e.target.files[0];
                  setImageFiles(updatedFiles);
                }
              }}
              className="w-full border p-3 rounded-lg"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Update Property
        </button>
      </form>
    </div>
  );
}