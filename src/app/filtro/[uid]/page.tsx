"use client";

import dynamic from "next/dynamic";

const FilterPageClient = dynamic(() => import("./FilterPageClient"), { ssr: false });

export default function FilterPage() {
  return <FilterPageClient />;
}
