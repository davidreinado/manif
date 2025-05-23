// app/components/ClientLayoutWrapper.tsx
"use client";

import Cerebro from "@/app/components/Cerebro";
import React from "react"; // optional but useful for typing
import { Suspense } from 'react';

export default function ClientLayoutWrapper({
  home,
  filteredLocalidades,
  filteredAgentes,
  existingLocalidadeDocs,
  children
}: {
  home: any;
  filteredLocalidades: any[];
  filteredAgentes: any[];
  existingLocalidadeDocs: any[];
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <Cerebro
        home={home}
        filteredLocalidades={filteredLocalidades}
        filteredAgentes={filteredAgentes}
        existingLocalidadeDocs={existingLocalidadeDocs}
      >
        {children}
      </Cerebro>
    </Suspense>
  );
}
