//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

export default function Vocabs_HEADER({
  list_NAME,
  btnBack_ACTION,
  btnDots_ACTION,
  IS_listNameHighlighted,
}: {
  list_NAME: string | undefined;
  btnBack_ACTION: () => void;
  btnDots_ACTION: () => void;
  IS_listNameHighlighted: boolean;
}) {
  return (
    <Header
      title={list_NAME || "INSERT LIST NAME"}
      btnLeft={
        <Btn
          type="seethrough"
          iconLeft={<ICON_arrow />}
          onPress={btnBack_ACTION}
          style={{ borderRadius: 100 }}
        />
      }
      btnRight={
        <Btn
          type="seethrough"
          iconLeft={<ICON_3dots />}
          onPress={btnDots_ACTION}
          style={{ borderRadius: 100 }}
        />
      }
      IS_titleHighlighted={IS_listNameHighlighted}
    />
  );
}
