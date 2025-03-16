//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Language_MODEL from "@/src/db/models/Language_MODEL";

import { ActivityIndicator, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { FETCH_langs } from "@/src/features/languages/functions/fetch/FETCH_langs/FETCH_langs";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import { USE_getTargetLangs } from "@/src/features_new/languages/hooks";
import { USE_removeOneDefaultListLangId } from "@/src/features_new/lists/hooks/actions/updateDefaultLangs/USE_removeOneDefaultListLangId/USE_removeOneDefaultListLangId";
import Error_TEXT from "../../texts/Error_TEXT/Error_TEXT";
import { MyColors } from "@/src/constants/MyColors";

interface ChosenLangsInputs_PROPS {
  OPEN_selectLanguagesModal: () => void;
}

export default function ChosenListLangs_BLOCK({
  OPEN_selectLanguagesModal = () => {},
}: ChosenLangsInputs_PROPS) {
  const { t } = useTranslation();
  const currentAppLanguage = useMemo(() => i18next.language, []);
  const { z_myOneList } = z_USE_myOneList();

  const { target_LANGS: selected_LANGS } = USE_getTargetLangs({
    targetLang_IDS: z_myOneList?.collected_lang_ids || [],
  });

  const {
    error,
    loading,
    currentlyBeingRemovedLang_ID,
    REMOVE_oneDefaultListLangId,
  } = USE_removeOneDefaultListLangId();

  return (
    <Block>
      <Label>{t("label.defaultVocabLangs")}</Label>
      {selected_LANGS?.map((lang) => {
        const IS_beingRemoved =
          loading && currentlyBeingRemovedLang_ID === lang.lang_id;
        return (
          <Btn
            key={"chosen lang" + lang?.lang_id}
            type="active"
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={
              currentAppLanguage === "en" ? lang?.lang_in_en : lang?.lang_in_de
            }
            iconRight={
              IS_beingRemoved ? (
                <ActivityIndicator color={MyColors.icon_primary} />
              ) : (
                <ICON_X rotate={true} color="primary" big={true} />
              )
            }
            text_STYLES={{ flex: 1 }}
            stayPressed={IS_beingRemoved}
            onPress={async () =>
              !loading
                ? await REMOVE_oneDefaultListLangId(
                    z_myOneList?.id || "",
                    lang?.lang_id || "",
                    {}
                  )
                : null
            }
          />
        );
      })}
      <Btn
        iconLeft={<ICON_X color="primary" />}
        text={t("btn.selectLangs")}
        type="seethrough_primary"
        onPress={() => (!loading ? OPEN_selectLanguagesModal() : null)}
      />

      {error && <Error_TEXT text={error.user_MSG} />}
    </Block>
  );
}
