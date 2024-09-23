//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { View } from "react-native";

interface ChosenLangsInputs_PROPS {
  modal_TRs: TranslationCreation_PROPS[];
  languages: Language_MODEL[];
  REMOVE_lang: (lang_id: string) => void;
  TOGGLE_selectLangModal: () => void;
}

export default function ChosenLangs_INPUTS({
  modal_TRs,
  languages,
  REMOVE_lang,
  TOGGLE_selectLangModal,
}: ChosenLangsInputs_PROPS) {
  return (
    <Block>
      <Label>Chosen languages</Label>
      {modal_TRs &&
        modal_TRs.map((tr) => {
          const lang = languages.find(
            (l: Language_MODEL) => l.id === tr.lang_id
          );
          return (
            <Btn
              key={"chosen lang" + tr.text + tr.lang_id}
              type="active"
              iconLeft={
                <View style={{ marginRight: 4 }}>
                  <ICON_flag lang={lang?.id} big={true} />
                </View>
              }
              text={lang?.lang_in_en}
              iconRight={<ICON_X rotate={true} color="primary" big={true} />}
              text_STYLES={{ flex: 1 }}
              onPress={() => REMOVE_lang(lang?.id || "")}
            />
          );
        })}
      <Btn
        iconLeft={<ICON_X color="primary" />}
        text="Select languages"
        type="seethrough_primary"
        onPress={TOGGLE_selectLangModal}
      />
    </Block>
  );
}
