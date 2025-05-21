// app/layout.tsx
import "./globals.css";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import slugify from "@sindresorhus/slugify";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  const agenda = home?.data?.agenda ?? [];

  const usedLocalidadeUIDs = [...new Set(agenda.map((item) => slugify(item.localidade ?? "")))];
  const usedAgenteUIDs = [...new Set(agenda.map((item) => slugify(item.agente ?? "")).filter(Boolean))];

  const existingLocalidadeDocs = await Promise.all(
    usedLocalidadeUIDs.map(async (uid) => {
      try {
        return await client.getByUID("local", uid);
      } catch {
        return null;
      }
    })
  );

  const existingAgenteDocs = await Promise.all(
    usedAgenteUIDs.map(async (uid) => {
      try {
        return await client.getByUID("filtro", uid);
      } catch {
        return null;
      }
    })
  );

  const validLocalidadeUIDs = existingLocalidadeDocs.filter(Boolean).map((doc) => doc?.uid);
  const validAgenteUIDs = existingAgenteDocs.filter(Boolean).map((doc) => doc?.uid);

  const filteredLocalidades = agenda.filter((item) =>
    validLocalidadeUIDs.includes(slugify(item.localidade ?? ""))
  );
  const filteredAgentes = agenda.filter((item) =>
    validAgenteUIDs.includes(slugify(item.agente ?? ""))
  );

  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper
          home={home}
          filteredLocalidades={filteredLocalidades}
          filteredAgentes={filteredAgentes}
          existingLocalidadeDocs={existingLocalidadeDocs}
        >
          {children}
        </ClientLayoutWrapper>
        
        <PrismicPreview repositoryName={repositoryName} />
        {/* fake scroll buffer */}
        <div className="h-[20px] pointer-events-none" />
      </body>
    </html>

  );

  return(<></>)
}
