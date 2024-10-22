//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

export default function MyVocabs_HEADER({
  list_NAME,
  undertextGreen,
  btnBack_ACTION,
  btnDots_ACTION,
}: {
  list_NAME: string | undefined;
  undertextGreen: string | undefined;
  btnBack_ACTION: () => void;
  btnDots_ACTION: () => void;
}) {
  return (
    <Header
      title={list_NAME || "INSERT LIST NAME"}
      {...{ undertextGreen }}
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
    />
  );
}
