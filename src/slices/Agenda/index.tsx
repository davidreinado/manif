import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Agenda`.
 */
export type AgendaProps = SliceComponentProps<Content.AgendaSlice>;

/**
 * Component for "Agenda" Slices.
 */
const Agenda = ({ slice }: AgendaProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for agenda (variation: {slice.variation}) Slices
    </section>
  );
};

export default Agenda;
