"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { createClient } from "@/prismicio";

export default function FilterPageClient() {
    const params = useParams(); // ✅ Next.js hook
    const uid = params?.uid as string;
    const [filtroDoc, setFiltroDoc] = useState<any>(null);

    useEffect(() => {
        if (!uid) return;

        const fetchData = async () => {
            const client = createClient();
            const doc = await client.getByUID("filtro", uid);
            setFiltroDoc(doc);
        };

        fetchData();
    }, [uid]);

    if (filtroDoc) {
        return (
            <div className="mr-[7px] h-full">
                <div>
                    <h3 className="font-semibold text-[4rem] leading-[1.4] mb-[15px]">
                        {filtroDoc.data.titulo}
                    </h3>
                    <SliceZone slices={filtroDoc.data.slices} components={components} />
                </div>
            </div>
        );
    }
}
