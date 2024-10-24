//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import TinyButton_SCROLLER from "@/src/components/TinyButton_SCROLLER/TinyButton_SCROLLER";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";

export default function SelectedLang_SCROLLER({
  selected_LANGS,
  REMOVE_lang,
}: {
  selected_LANGS: Language_MODEL[] | undefined;
  REMOVE_lang: (l: Language_MODEL) => void;
}) {
  return (
    <TinyButton_SCROLLER>
      {selected_LANGS?.map((lang, i) => {
        return (
          <Btn
            key={lang?.lang_id + "tiny selected lang buttons"}
            iconLeft={<ICON_flag lang={lang?.lang_id} />}
            text={lang?.lang_id?.toUpperCase()}
            iconRight={<ICON_X color="primary" rotate={true} />}
            onPress={() => REMOVE_lang(lang)}
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
    </TinyButton_SCROLLER>
  );
}
