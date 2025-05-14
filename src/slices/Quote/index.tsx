import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Quote`.
 */
export type QuoteProps = SliceComponentProps<Content.QuoteSlice>;

/**
 * Component for "Quote" Slices.
 */
const Quote: FC<QuoteProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="my-[15px]"
    >
      {slice.primary.quote_text && (
        <blockquote className="italic text-[2.1rem] leading-[1.333]">
          <PrismicRichText field={slice.primary.quote_text} />
        </blockquote>
      )}
    </section>
  );
};

export default Quote;
