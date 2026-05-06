import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { PROPERTY_LOCATION_COLLECTION } from "@/lib/propertyTaxonomy";

export default function AdminLocationsPage() {
  return (
    <TaxonomyManager
      collectionName={PROPERTY_LOCATION_COLLECTION}
      title="Manage Locations"
      description="Add or remove cities used in property forms. Existing properties are not modified when a city is deleted from settings."
      placeholder="Enter city name"
    />
  );
}