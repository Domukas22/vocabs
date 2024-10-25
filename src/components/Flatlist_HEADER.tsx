//
//

import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";

//
export default function Flatlist_HEADER({ title }: { title: string }) {
  return (
    <Styled_TEXT type="text_22_bold" style={{ marginTop: 4, marginBottom: 16 }}>
      {title}
    </Styled_TEXT>
  );
}
