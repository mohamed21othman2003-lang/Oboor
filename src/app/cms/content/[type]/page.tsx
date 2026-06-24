"use client";

import { useParams } from "next/navigation";
import CollectionList from "@/components/cms/CollectionList";

export default function ContentListPage() {
  const { type } = useParams<{ type: string }>();
  return <CollectionList type={type} />;
}
