//
//
//

import HANDLE_langRemoval from "@/src/features/2_vocabs/utils/HANLDE_langRemoval";

import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../../2_vocabs/components/Modal/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import TinyLang_SCROLLER from "@/src/features/4_languages/components/TinyLang_SCROLLER/TinyLang_SCROLLER";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { View } from "react-native";
import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import { useTranslation } from "react-i18next";

interface ChosenLangsController_PROPS {
  control: Control<CreateMyVocabData_PROPS, any>;
  TOGGLE_tagModal: () => void;
}

export default function Tags_CONTROLLER({
  control,
  TOGGLE_tagModal,
}: ChosenLangsController_PROPS) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name="tags"
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <Block>
            <Label>Tags</Label>

            <View
              style={{
                gap: 8,
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {value.map((tag) => (
                <Btn
                  key={"KeyOfFormTags" + tag}
                  text={tag}
                  tiny
                  type="active"
                  iconRight={<ICON_X color="primary" rotate />}
                />
              ))}
            </View>
            <Btn
              text={t("btn.selectTags")}
              iconLeft={<ICON_X />}
              onPress={TOGGLE_tagModal}
            />
          </Block>
        );
      }}
    />
  );
}
