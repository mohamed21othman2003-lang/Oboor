"use client";

import { useParams } from "next/navigation";
import CollectionEditor from "@/components/cms/CollectionEditor";

export default function ContentEditPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  return <CollectionEditor type={type} id={id} />;
}
