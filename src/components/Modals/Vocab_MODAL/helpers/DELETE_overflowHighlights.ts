//
//
//

export default function DELETE_overflowHighlights({
  text,
  highlights,
}: {
  text: string;
  highlights: number[];
}) {
  // delete highlights which don't fit into the text
  return highlights.filter((h: number) => h <= text.length - 1);
}
