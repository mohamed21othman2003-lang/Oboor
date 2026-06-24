"use client";

import { useParams } from "next/navigation";
import SubmissionsList from "@/components/cms/SubmissionsList";

export default function SubmissionsPage() {
  const { type } = useParams<{ type: string }>();
  return <SubmissionsList type={type} />;
}
