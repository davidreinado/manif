import { Metadata } from "next";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// This component renders your homepage.
//
// Use Next's generateMetadata function to render page metadata.
//
// Use the SliceZone to render the content of the page.

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: "MANIF",
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}

export default async function Index() {
  // The client queries content from the Prismic API
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return <>
    {/* <h1 className="font-cc ">MANIF</h1> */}
    <div>
      <div className="w-[14px] h-[14px] absolute left-[14px] top-[14px] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute right-[14px] top-[14px] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute right-[14px] top-[calc(50vh-7px)] bg-black"></div>

      <div className="w-[14px] h-[14px] absolute left-[14px] top-[calc(50vh-7px)] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute left-[14px] bottom-[14px] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute right-[14px] bottom-[14px] bg-black"></div>

      <div className="w-[14px] h-[14px] absolute left-[calc(50vw-7px)] top-[calc(50vh+7px)] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute left-[calc(50vw-7px)] bottom-[14px] bg-black"></div>
      <div className="w-[14px] h-[14px] absolute left-[calc(50vw-7px)] top-[14px] bg-black"></div>

    </div>
    <div className="px-[29px] pt-[40px]">
      <svg className="w-full h-auto" width="1224" height="335" viewBox="0 0 1224 335" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.556 335V0.539986H143.418L168.742 154.869H171.131L198.365 0.539986H336.927V335H243.756V233.229L247.101 117.123H243.756L204.099 335H134.818L93.727 117.123H90.3824L92.2936 233.229V335H0.556ZM351.328 335L401.497 0.539986H564.427L615.074 335H502.791L496.102 258.552H463.134L457.4 335H351.328ZM467.912 194.049H490.368L483.201 114.256L478.901 62.654H476.99L473.645 114.256L467.912 194.049ZM629.535 335V0.539986H742.296L787.687 152.003H791.031L790.076 82.2438V0.539986H885.636V335H775.742L727.006 162.036H724.139L725.095 234.662V335H629.535ZM904.83 335V0.539986H1011.86V335H904.83ZM1030.81 335V0.539986H1223.84V76.988H1137.84V133.846H1220.98V212.683H1137.84V335H1030.81Z" fill="black" />
      </svg>
    </div>
  </>


  // return <SliceZone slices={home.data.slices} components={components} />;
}
