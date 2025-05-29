import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TwoColumnText`.
 */
export type TwoColumnTextProps =
  SliceComponentProps<Content.TwoColumnTextSlice>;

/**
 * Component for "TwoColumnText" Slices.
 */
const TwoColumnText: FC<TwoColumnTextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex text-[1.2rem] leading-[1.5] gap-[14px] mb-[7px]">
      {slice.primary.left_column_content && (
        <blockquote className="w-[50%]">
          <PrismicRichText field={slice.primary.left_column_content} />
        </blockquote>
      )}
            {slice.primary.right_column_content && (
        <blockquote className="w-[50%]">
          <PrismicRichText field={slice.primary.right_column_content} />
        </blockquote>
      )}
      </div>
    </section>
  );
};

export default TwoColumnText;
