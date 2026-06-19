import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection } from "@/lib/admin/collections";
import CollectionView from "@/components/admin/CollectionView";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.key }));
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const col = getCollection(collection);
  if (!col) notFound();
  return <CollectionView collection={col} />;
}
