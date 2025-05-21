'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices"; // <- Import your slice components

export default function FilterPage() {
  const router = useRouter();
  // const pathname = usePathname();
  // const uid = pathname.split('/')[2];
  const params = useParams();
const uid = params?.uid as string;
  const client = createClient();

  const [filtroDoc, setFiltroDoc] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const doc = await client.getByUID('filtro', uid);
        setFiltroDoc(doc);
      } catch (err) {
        console.error('Failed to fetch document:', err);
        setFiltroDoc(null);
      }
    };

    if (uid) {
      fetchDoc();
    }
  }, [uid]);


  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className='mr-[10px]'>
      {filtroDoc && (
        <>
          <h3 className="font-semibold mb-2 text-[4rem] leading-[1] my-[15px]">
            {filtroDoc?.data.titulo}
          </h3>

          <SliceZone slices={filtroDoc.data.slices} components={components} />
        </>
      )}

      {/* Optional button to go home
      <button
        onClick={handleClose}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4 leading-[1.5]"
      >
        Close & Go Home
      </button>
      */}
    </div>
  );
}
