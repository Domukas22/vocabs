//
//
//

import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { Language_PROPS, DisplaySettings_PROPS } from "@/src/db/props";
import Vocab_DUMMY from "@/src/features/2_vocabs/components/Vocab/Components/Vocab_DUMMY";
import i18next, { t } from "i18next";
import { ScrollView, View } from "react-native";
import VocabFrontLang_BLOCK from "../../VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import { ICON_checkMark, ICON_flag } from "@/src/components/icons/icons";
import { useEffect, useMemo, useState } from "react";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import USE_zustand from "@/src/zustand";
import { Language_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import languages from "@/src/constants/languages";
import { Vocabs_DB } from "@/src/db";
import GET_uniqueLanguagesInAList from "@/src/features/4_languages/utils/GET_uniqueLanguagesInAList/GET_uniqueLanguagesInAList";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

function _MyVocabPreview_BLOCKS({ vocabs }: { vocabs: Vocab_MODEL[] }) {
  const { z_display_SETTINGS, z_SET_displaySettings } = USE_zustand();
  const appLang = useMemo(() => i18next.language, [i18next.language]);

  const { languages: allLanguages } = USE_langs();
  const [list_LANGS, SET_list_LANGS] = useState<Language_MODEL[]>([]);

  useEffect(() => {
    // Define an async function to call GET_uniqueLanguagesInAList
    const fetchLanguages = async () => {
      // Assuming you have access to a proper list of Language_MODEL instances

      const lang_IDs = vocabs.reduce((acc, vocab) => {
        vocab.trs?.forEach((translation) => {
          if (!acc.includes(translation.lang_id)) {
            acc.push(translation.lang_id);
          }
        });
        return acc;
      }, [] as string[]);

      // Filter languages based on the unique language IDs
      const uniqueLanguages = allLanguages.filter((lang) =>
        lang_IDs.includes(lang.id)
      );

      SET_list_LANGS(uniqueLanguages);
    };

    // Call the async function
    fetchLanguages();
  }, [vocabs]);

  return (
    <>
      <Block>
        <Label>{t("label.vocabPreview")}</Label>

        <View style={{ gap: 12, marginTop: 4 }}>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: MyColors.border_white_005,
              overflow: "hidden",
            }}
          >
            <Settings_TOGGLE
              text={t("toggle.showDescription")}
              active={z_display_SETTINGS?.SHOW_description}
              onPress={() => {
                z_SET_displaySettings({
                  SHOW_description: !z_display_SETTINGS.SHOW_description,
                });
              }}
            />
            <Settings_TOGGLE
              text={t("toggle.showFlags")}
              active={z_display_SETTINGS?.SHOW_flags}
              onPress={() => {
                z_SET_displaySettings({
                  SHOW_flags: !z_display_SETTINGS.SHOW_flags,
                });
              }}
            />
            <Settings_TOGGLE
              text={t("toggle.showDifficulty")}
              active={z_display_SETTINGS?.SHOW_difficulty}
              onPress={() => {
                z_SET_displaySettings({
                  SHOW_difficulty: !z_display_SETTINGS.SHOW_difficulty,
                });
              }}
              last
            />
          </View>
        </View>
      </Block>

      {list_LANGS && list_LANGS?.length > 0 && (
        <Block>
          <Label>{t("label.vocabFrontLang")}</Label>
          <ScrollView>
            {list_LANGS?.map((lang, index) => (
              <Btn
                key={"Select lang" + lang.id + lang.lang_in_en}
                iconLeft={
                  <View style={{ marginRight: 4 }}>
                    <ICON_flag lang={lang?.id} big={true} />
                  </View>
                }
                text={appLang === "en" ? lang.lang_in_en : lang.lang_in_de}
                iconRight={
                  z_display_SETTINGS.frontTrLang_ID === lang.id && (
                    <ICON_checkMark color="primary" />
                  )
                }
                onPress={() => {
                  z_SET_displaySettings({ frontTrLang_ID: lang.id });
                }}
                type={
                  z_display_SETTINGS.frontTrLang_ID === lang.id
                    ? "active"
                    : "simple"
                }
                style={[
                  { flex: 1, marginBottom: 8 },
                  index === list_LANGS.length - 1 && { marginBottom: 24 },
                ]}
                text_STYLES={{ flex: 1 }}
              />
            ))}
          </ScrollView>
        </Block>
      )}
    </>
  );
}
//

const enhance = withObservables(
  ["list_id"],
  ({ list_id }: { list_id: string }) => ({
    // vocabs: Vocabs_DB.query(Q.where("list_id", list_id)),
    vocabs: Vocabs_DB.query(Q.where("list_id", list_id)),
  })
);

export const MyVocabPreview_BLOCKS = enhance(_MyVocabPreview_BLOCKS);
