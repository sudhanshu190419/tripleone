import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const PROPERTY_LOCATION_COLLECTION = "property_locations";
export const PROPERTY_CATEGORY_COLLECTION = "property_categories";

export type TaxonomyCollectionName =
  | typeof PROPERTY_LOCATION_COLLECTION
  | typeof PROPERTY_CATEGORY_COLLECTION;

export type TaxonomyItem = {
  id: string;
  name: string;
  createdAt?: unknown;
};

export const normalizeTaxonomyName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const fetchTaxonomyItems = async (
  collectionName: TaxonomyCollectionName
): Promise<TaxonomyItem[]> => {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: String(data.name || "").trim(),
        // Convert Firestore Timestamp to a ISO string or null
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    })
    .filter((item) => item.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const addTaxonomyItem = async (
  collectionName: TaxonomyCollectionName,
  name: string
) => {
  const normalizedName = normalizeTaxonomyName(name);

  if (!normalizedName) {
    throw new Error("Name cannot be empty");
  }

  const existingItems = await fetchTaxonomyItems(collectionName);
  const duplicateExists = existingItems.some(
    (item) => item.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (duplicateExists) {
    throw new Error("This value already exists");
  }

  return addDoc(collection(db, collectionName), {
    name: normalizedName,
    createdAt: serverTimestamp(),
  });
};

export const deleteTaxonomyItem = async (
  collectionName: TaxonomyCollectionName,
  id: string
) => {
  await deleteDoc(doc(db, collectionName, id));
};
