//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_X,
  ICON_difficultyDot,
  ICON_flag,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Language_MODEL, DisplaySettings_PROPS } from "@/src/db/models";
import i18next, { t } from "i18next";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

export default function VocabFilter_BLOCKS({
  displaySettings,
  SET_displaySettings,
  list_LANGS,
}: {
  displaySettings: DisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettings_PROPS>
  >;
  list_LANGS: Language_MODEL[] | [] | undefined;
}) {
  const appLang = useMemo(() => i18next.language, [i18next.language]);
  const SELECT_difficultyFilter = useCallback(
    (incoming_DIFF: 1 | 2 | 3) => {
      SET_displaySettings((p) => ({
        ...p,
        difficultyFilters: GET_handledDifficulties({
          difficultyFilters: p.difficultyFilters,
          incoming_DIFF,
        }),
      }));
    },
    [displaySettings]
  );
  const SELECT_langFilter = useCallback(
    (incoming_LANG: string) => {
      const newLangs = GET_handledLangs({
        langFilters: displaySettings.langFilters,
        incoming_LANG,
      });

      const correctedFrontLangId = GET_handledFrontLangId({
        frontLang_ID: displaySettings.frontTrLang_ID,
        newLang_IDS: newLangs,
      });

      SET_displaySettings((p) => ({
        ...p,
        langFilters: newLangs,
        frontTrLang_ID: correctedFrontLangId,
      }));
    },
    [displaySettings]
  );

  return (
    <>
      <Block>
        <Label>{t("label.filterByDifficulty")}</Label>
        <Btn
          text={t("difficulty.easy")}
          iconRight={
            displaySettings?.difficultyFilters.some((nr) => nr === 1) ? (
              <ICON_X big={true} rotate={true} color="difficulty_1" />
            ) : (
              <ICON_difficultyDot big={true} difficulty={1} />
            )
          }
          onPress={() => SELECT_difficultyFilter(1)}
          type={
            displaySettings?.difficultyFilters.some((nr) => nr === 1)
              ? "difficulty_1_active"
              : "simple"
          }
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
        <Btn
          text={t("difficulty.medium")}
          iconRight={
            displaySettings?.difficultyFilters.some((nr) => nr === 2) ? (
              <ICON_X big={true} rotate={true} color="difficulty_2" />
            ) : (
              <ICON_difficultyDot big={true} difficulty={2} />
            )
          }
          onPress={() => SELECT_difficultyFilter(2)}
          type={
            displaySettings?.difficultyFilters.some((nr) => nr === 2)
              ? "difficulty_2_active"
              : "simple"
          }
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
        <Btn
          text={t("difficulty.hard")}
          iconRight={
            displaySettings?.difficultyFilters.some((nr) => nr === 3) ? (
              <ICON_X big={true} rotate={true} color="difficulty_3" />
            ) : (
              <ICON_difficultyDot big={true} difficulty={3} />
            )
          }
          onPress={() => SELECT_difficultyFilter(3)}
          type={
            displaySettings?.difficultyFilters.some((nr) => nr === 3)
              ? "difficulty_3_active"
              : "simple"
          }
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
      </Block>
      <Block>
        <Label>{t("label.filterByLanguage")}</Label>
        {list_LANGS?.map((lang, index) => {
          return (
            <Btn
              key={`langFilterBtn ${lang.id}`}
              iconLeft={
                <View style={{ marginRight: 4 }}>
                  <ICON_flag lang={lang.id} big={true} />
                </View>
              }
              text={lang[`lang_in_${appLang || "en"}`]}
              iconRight={
                displaySettings?.langFilters.some(
                  (lang_ID) => lang_ID === lang.id
                ) ? (
                  <ICON_X big rotate color="primary" />
                ) : null
              }
              type={
                displaySettings?.langFilters.some(
                  (lang_ID) => lang_ID === lang.id
                )
                  ? "active"
                  : "simple"
              }
              style={[index === list_LANGS.length - 1 && { marginBottom: 24 }]}
              text_STYLES={{ flex: 1 }}
              onPress={() => SELECT_langFilter(lang.id)}
            />
          );
        })}
      </Block>
    </>
  );
}

function GET_handledDifficulties({
  difficultyFilters,
  incoming_DIFF,
}: {
  difficultyFilters: (1 | 2 | 3)[];
  incoming_DIFF: 1 | 2 | 3;
}) {
  if (difficultyFilters) {
    return difficultyFilters.some((d) => d === incoming_DIFF)
      ? difficultyFilters.filter((d) => d !== incoming_DIFF)
      : [...difficultyFilters, incoming_DIFF];
  }

  return difficultyFilters;
}
function GET_handledLangs({
  langFilters,
  incoming_LANG,
}: {
  langFilters: string[];
  incoming_LANG: string;
}) {
  if (langFilters) {
    return langFilters.some((d) => d === incoming_LANG)
      ? langFilters.filter((d) => d !== incoming_LANG)
      : [...langFilters, incoming_LANG];
  }

  return langFilters;
}
function GET_handledFrontLangId({
  frontLang_ID,
  newLang_IDS,
}: {
  frontLang_ID: string;
  newLang_IDS: string[];
}) {
  if (newLang_IDS.length === 0) return frontLang_ID;
  if (newLang_IDS.length === 1) return newLang_IDS[0];

  return frontLang_ID;
}
