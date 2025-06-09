"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { createClient } from "@/prismicio";
import { useThemeStore } from "@/app/stores/useThemeStore"; // Adjust path if needed

export default function FilterPageClient() {
    const params = useParams(); // ✅ Next.js hook
    const uid = params?.uid as string;
    const [filtroDoc, setFiltroDoc] = useState<any>(null);
    const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
    const setSecondaryColor = useThemeStore((state) => state.setSecondaryColor);

    useEffect(() => {
        if (!uid) return;

        const fetchData = async () => {
            const client = createClient();
            const doc = await client.getByUID("filtro", uid);
            setFiltroDoc(doc);

            // Optionally set theme colors from Prismic data
            if (doc?.data?.fundo == "Rosa") {
                setPrimaryColor("#FC3370");
                setSecondaryColor("#FAB617");
                document.documentElement.style.setProperty('--primary-color', "#FC3370");
                document.documentElement.style.setProperty('--secondary-color', "#FAB617");
            }
            else if (doc?.data?.fundo == "Laranja") {
                setPrimaryColor("#FF5A16");
                setSecondaryColor("#FAB617");
                document.documentElement.style.setProperty('--primary-color', "#FF5A16");
                document.documentElement.style.setProperty('--secondary-color', "#FAB617");

            }
            else if (doc?.data?.fundo == "Amarelo") {
                setPrimaryColor("#FAB617");
                setSecondaryColor("#FC3370");
                document.documentElement.style.setProperty('--primary-color', "#FAB617");
                document.documentElement.style.setProperty('--secondary-color', "#FC3370");
            }
            else {
                setPrimaryColor("#fff");
                setSecondaryColor("#808080");
                document.documentElement.style.setProperty('--primary-color', "#fff");
                document.documentElement.style.setProperty('--secondary-color', "#808080");
            }
        };

        fetchData();
    }, [uid]);

    if (filtroDoc) {
        return (
            <div className="h-full pr-[7px]">
                <div>
                    <h3 className="font-semibold text-[4rem] leading-[1.4] mb-[7px]">
                        {filtroDoc.data.titulo}
                    </h3>
                    <SliceZone slices={filtroDoc.data.slices} components={components} />
                </div>
            </div>
        );
    }
}
