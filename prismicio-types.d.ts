// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

/**
 * Content for Carrossel documents
 */
interface CarrosselDocumentData {
  /**
   * Imagem field in *Carrossel*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: carrossel.imagem
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  imagem: prismic.ImageField<never>;
}

/**
 * Carrossel document from Prismic
 *
 * - **API ID**: `carrossel`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type CarrosselDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<
    Simplify<CarrosselDocumentData>,
    "carrossel",
    Lang
  >;

type FiltroDocumentDataSlicesSlice =
  | FullWidthImageSlice
  | TwoColumnTextSlice
  | QuoteSlice;

/**
 * Content for Filtro documents
 */
interface FiltroDocumentData {
  /**
   * Título field in *Filtro*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: filtro.titulo
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  titulo: prismic.KeyTextField;

  /**
   * Fundo field in *Filtro*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: filtro.fundo
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  fundo: prismic.SelectField<"Laranja" | "Amarelo" | "Rosa" | "Branco">;

  /**
   * Slice Zone field in *Filtro*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: filtro.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<FiltroDocumentDataSlicesSlice>;
}

/**
 * Filtro document from Prismic
 *
 * - **API ID**: `filtro`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FiltroDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<FiltroDocumentData>, "filtro", Lang>;

/**
 * Item in *Local → Logo*
 */
export interface LocalDocumentDataLogoItem {
  /**
   * Imagem field in *Local → Logo*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: local.logo[].imagem
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  imagem: prismic.ImageField<never>;
}

/**
 * Content for Local documents
 */
interface LocalDocumentData {
  /**
   * Título field in *Local*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: local.titulo
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  titulo: prismic.KeyTextField;

  /**
   * Logo field in *Local*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: local.logo[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  logo: prismic.GroupField<Simplify<LocalDocumentDataLogoItem>>;
}

/**
 * Local document from Prismic
 *
 * - **API ID**: `local`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type LocalDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<LocalDocumentData>, "local", Lang>;

/**
 * Item in *Home → Agenda*
 */
export interface PageDocumentDataAgendaItem {
  /**
   * Agente field in *Home → Agenda*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].agente
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  agente: prismic.KeyTextField;

  /**
   * Ano field in *Home → Agenda*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].ano
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  ano: prismic.SelectField<"2025" | "2026" | "2027" | "2024">;

  /**
   * Mês field in *Home → Agenda*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].mes
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  mes: prismic.SelectField<
    | "jan"
    | "fev"
    | "mar"
    | "abr"
    | "mai"
    | "jun"
    | "jul"
    | "ago"
    | "set"
    | "out"
    | "nov"
    | "dez"
  >;

  /**
   * Mês Fim field in *Home → Agenda*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].mes_fim
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  mes_fim: prismic.SelectField<
    | "jan"
    | "fev"
    | "mar"
    | "abr"
    | "mai"
    | "jun"
    | "jul"
    | "ago"
    | "set"
    | "out"
    | "nov"
    | "dez"
  >;

  /**
   * Data Inicial field in *Home → Agenda*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].data_inicial
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  data_inicial: prismic.SelectField<
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23"
    | "24"
    | "25"
    | "26"
    | "27"
    | "28"
    | "29"
    | "30"
    | "31"
    | "8"
  >;

  /**
   * Data Final field in *Home → Agenda*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].data_final
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  data_final: prismic.SelectField<
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23"
    | "24"
    | "25"
    | "26"
    | "27"
    | "28"
    | "29"
    | "30"
    | "31"
  >;

  /**
   * Horas field in *Home → Agenda*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].horas
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  horas: prismic.KeyTextField;

  /**
   * Distrito field in *Home → Agenda*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].distrito
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  distrito: prismic.KeyTextField;

  /**
   * Localidade field in *Home → Agenda*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].localidade
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  localidade: prismic.KeyTextField;

  /**
   * Residência field in *Home → Agenda*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: page.agenda[].residencia
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  residencia: prismic.BooleanField;

  /**
   * Exposição field in *Home → Agenda*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: page.agenda[].exposicao
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  exposicao: prismic.BooleanField;

  /**
   * Mediação field in *Home → Agenda*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: page.agenda[].mediacao
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  mediacao: prismic.BooleanField;

  /**
   * Título field in *Home → Agenda*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].titulo
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  titulo: prismic.RichTextField;

  /**
   * Subtítulo field in *Home → Agenda*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].subtitulo
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  subtitulo: prismic.RichTextField;

  /**
   * Local field in *Home → Agenda*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[].local
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  local: prismic.RichTextField;
}

type PageDocumentDataSlicesSlice = never;

/**
 * Content for Home documents
 */
interface PageDocumentData {
  /**
   * Title field in *Home*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField;

  /**
   * Bio field in *Home*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.bio
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  bio: prismic.RichTextField;

  /**
   * Agenda field in *Home*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: page.agenda[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  agenda: prismic.GroupField<Simplify<PageDocumentDataAgendaItem>>;

  /**
   * teste field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: page.teste
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  teste: prismic.KeyTextField;

  /**
   * Slice Zone field in *Home*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<PageDocumentDataSlicesSlice> /**
   * Meta Title field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Home*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Home*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * Home document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

interface UidDocumentData {}

/**
 * uid document from Prismic
 *
 * - **API ID**: `uid`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type UidDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<UidDocumentData>, "uid", Lang>;

export type AllDocumentTypes =
  | CarrosselDocument
  | FiltroDocument
  | LocalDocument
  | PageDocument
  | UidDocument;

/**
 * Item in *Carrossel → Default → Primary → Imagem*
 */
export interface FullWidthImageSliceDefaultPrimaryImagemItem {
  /**
   * Imagem field in *Carrossel → Default → Primary → Imagem*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: full_width_image.default.primary.imagem[].imagem
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  imagem: prismic.ImageField<never>;

  /**
   * Copyright field in *Carrossel → Default → Primary → Imagem*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: full_width_image.default.primary.imagem[].copyright
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  copyright: prismic.KeyTextField;
}

/**
 * Primary content in *Carrossel → Default → Primary*
 */
export interface FullWidthImageSliceDefaultPrimary {
  /**
   * Imagem field in *Carrossel → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: full_width_image.default.primary.imagem[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  imagem: prismic.GroupField<
    Simplify<FullWidthImageSliceDefaultPrimaryImagemItem>
  >;
}

/**
 * Default variation for Carrossel Slice
 *
 * - **API ID**: `default`
 * - **Description**: Displays one image spanning the content width.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type FullWidthImageSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<FullWidthImageSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Carrossel*
 */
type FullWidthImageSliceVariation = FullWidthImageSliceDefault;

/**
 * Carrossel Shared Slice
 *
 * - **API ID**: `full_width_image`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type FullWidthImageSlice = prismic.SharedSlice<
  "full_width_image",
  FullWidthImageSliceVariation
>;

/**
 * Primary content in *Quote → Default → Primary*
 */
export interface QuoteSliceDefaultPrimary {
  /**
   * Quote Text field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.quote_text
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  quote_text: prismic.RichTextField;
}

/**
 * Default variation for Quote Slice
 *
 * - **API ID**: `default`
 * - **Description**: Single quote text field, often styled in italic.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type QuoteSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<QuoteSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Quote*
 */
type QuoteSliceVariation = QuoteSliceDefault;

/**
 * Quote Shared Slice
 *
 * - **API ID**: `quote`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type QuoteSlice = prismic.SharedSlice<"quote", QuoteSliceVariation>;

/**
 * Primary content in *TwoColumnText → Default → Primary*
 */
export interface TwoColumnTextSliceDefaultPrimary {
  /**
   * Left Column Content field in *TwoColumnText → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: two_column_text.default.primary.left_column_content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  left_column_content: prismic.RichTextField;

  /**
   * Right Column Content field in *TwoColumnText → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: two_column_text.default.primary.right_column_content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  right_column_content: prismic.RichTextField;
}

/**
 * Default variation for TwoColumnText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Standard two-column text layout, each with its own rich text content area.
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TwoColumnTextSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<TwoColumnTextSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *TwoColumnText*
 */
type TwoColumnTextSliceVariation = TwoColumnTextSliceDefault;

/**
 * TwoColumnText Shared Slice
 *
 * - **API ID**: `two_column_text`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type TwoColumnTextSlice = prismic.SharedSlice<
  "two_column_text",
  TwoColumnTextSliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>;
  }

  interface CreateWriteClient {
    (
      repositoryNameOrEndpoint: string,
      options: prismic.WriteClientConfig,
    ): prismic.WriteClient<AllDocumentTypes>;
  }

  interface CreateMigration {
    (): prismic.Migration<AllDocumentTypes>;
  }

  namespace Content {
    export type {
      CarrosselDocument,
      CarrosselDocumentData,
      FiltroDocument,
      FiltroDocumentData,
      FiltroDocumentDataSlicesSlice,
      LocalDocument,
      LocalDocumentData,
      LocalDocumentDataLogoItem,
      PageDocument,
      PageDocumentData,
      PageDocumentDataAgendaItem,
      PageDocumentDataSlicesSlice,
      UidDocument,
      UidDocumentData,
      AllDocumentTypes,
      FullWidthImageSlice,
      FullWidthImageSliceDefaultPrimaryImagemItem,
      FullWidthImageSliceDefaultPrimary,
      FullWidthImageSliceVariation,
      FullWidthImageSliceDefault,
      QuoteSlice,
      QuoteSliceDefaultPrimary,
      QuoteSliceVariation,
      QuoteSliceDefault,
      TwoColumnTextSlice,
      TwoColumnTextSliceDefaultPrimary,
      TwoColumnTextSliceVariation,
      TwoColumnTextSliceDefault,
    };
  }
}
