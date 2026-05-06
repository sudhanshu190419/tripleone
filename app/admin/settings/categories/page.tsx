import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { PROPERTY_CATEGORY_COLLECTION } from "@/lib/propertyTaxonomy";

export default function AdminCategoriesPage() {
  return (
    <TaxonomyManager
      collectionName={PROPERTY_CATEGORY_COLLECTION}
      title="Manage Categories"
      description="Add or remove property categories used in property forms. Existing properties are not modified when a category is deleted from settings."
      placeholder="Enter category name"
    />
  );
}