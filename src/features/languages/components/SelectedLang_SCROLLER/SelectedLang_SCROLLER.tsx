//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import TinyBtnScroll_BLOCK from "@/src/components/1_grouped/blocks/TinyBtnScroll_BLOCK/TinyBtnScroll_BLOCK";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { Lang_TYPE } from "@/src/features_new/languages/types";

export function SelectedLang_SCROLLER({
  selected_LANGS,
  REMOVE_lang,
}: {
  selected_LANGS: Lang_TYPE[] | undefined;
  REMOVE_lang: (lang_id: string) => void;
}) {
  return (
    <TinyBtnScroll_BLOCK>
      {selected_LANGS?.map((lang, i) => {
        return (
          <Btn
            key={lang?.lang_id + "tiny selected lang buttons"}
            iconLeft={<ICON_flag lang={lang?.lang_id} />}
            text={lang?.lang_id?.toUpperCase()}
            iconRight={<ICON_X color="primary" rotate={true} />}
            onPress={() => REMOVE_lang(lang.lang_id)}
            type="active"
            tiny={true}
            style={[
              { marginRight: 8 },
              i === selected_LANGS?.length - 1 && {
                marginRight: 24,
              },
            ]}
          />
        );
      })}
    </TinyBtnScroll_BLOCK>
  );
}
