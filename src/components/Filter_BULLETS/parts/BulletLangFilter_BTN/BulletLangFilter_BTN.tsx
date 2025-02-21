//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";

export function BulletLangFilter_BTN({
  lang_id = "",
  REMOVE_lang = () => {},
}: {
  lang_id: string;
  REMOVE_lang: () => void;
}) {
  return (
    <Btn
      iconLeft={<ICON_flag lang={lang_id} />}
      text={lang_id?.toUpperCase()}
      iconRight={<ICON_X color="primary" rotate={true} />}
      type="active"
      tiny={true}
      onPress={REMOVE_lang}
    />
  );
}
