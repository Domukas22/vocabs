//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import languages from "@/src/constants/languages";

import Block from "@/src/components/Block/Block";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import {
  maxVocabTranslations,
  minVocabTranslations,
} from "@/src/constants/globalVars";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import GET_langsFromTranslations from "@/src/features/4_languages/utils/GET_langsFromTranslations";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  IS_inAction?: boolean;
  TOGGLE_open: () => void;
  SUBMIT_langs: (newLangSelection: Language_MODEL[]) => void;
  trs: TranslationCreation_PROPS[];
}

export default function SelectMultipleLanguages_MODAL({
  open,
  IS_inAction = false,
  TOGGLE_open,
  SUBMIT_langs,
  trs,
}: SelectLanguagesModal_PROPS) {
  const { t } = useTranslation();

  const [search, SET_search] = useState("");
  const { languages } = USE_langs();

  const [modal_LANGS, SET_modalLangs] = useState<Language_MODEL[]>(
    GET_langsFromTranslations(trs, languages) || []
  );

  const cancel = () => {
    SET_modalLangs(GET_langsFromTranslations(trs, languages) || []);
    TOGGLE_open();
    SET_search("");
  };

  const submit = () => {
    SUBMIT_langs(modal_LANGS);
    SET_modalLangs(GET_langsFromTranslations(trs, languages) || []);
    TOGGLE_open();
  };

  const searchedLangs =
    search !== ""
      ? languages.filter(
          (lang) =>
            lang.lang_in_en
              .toLowerCase()
              .includes(search.toLowerCase().trim()) ||
            lang.lang_in_de
              .toLowerCase()
              .includes(search.toLowerCase().trim()) ||
            lang.country_in_en
              .toLowerCase()
              .includes(search.toLowerCase().trim()) ||
            lang.country_in_de
              .toLowerCase()
              .includes(search.toLowerCase().trim())
        )
      : languages;

  useEffect(() => {
    SET_modalLangs(GET_langsFromTranslations(trs, languages) || []);
  }, [trs]);

  function SELECT_lang(incomdingLang: Language_MODEL) {
    const alreadyHasLang = modal_LANGS?.some((l) => l.id === incomdingLang.id);

    if (!alreadyHasLang) {
      // add new lang
      SET_modalLangs((prev) => [incomdingLang, ...prev]);
    } else {
      SET_modalLangs((prev) =>
        prev.filter((lang) => lang.id !== incomdingLang.id)
      );
    }
  }
  const appLang = useMemo(() => i18next.language, []);

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title={t("modal.selectLanguages.header")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={() => {
                if (!IS_inAction) cancel();
              }}
              style={{ borderRadius: 100 }}
            />
          }
        />

        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>

        <Styled_FLATLIST
          gap={8}
          data={searchedLangs}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => {
            return (
              <Btn
                key={"Select lang" + item.id + item.lang_in_en}
                iconLeft={
                  <View style={{ marginRight: 4 }}>
                    <ICON_flag lang={item?.id} big={true} />
                  </View>
                }
                iconRight={
                  <ICON_X
                    color={
                      modal_LANGS?.some((l) => l.id === item.id)
                        ? "primary"
                        : "grey"
                    }
                    rotate={modal_LANGS?.some((l) => l.id === item.id)}
                    big={true}
                  />
                }
                text={appLang === "en" ? item.lang_in_en : item.lang_in_de}
                onPress={() => SELECT_lang(item)}
                type={
                  modal_LANGS?.some((l) => l.id === item.id)
                    ? "active"
                    : "simple"
                }
                style={{ flex: 1 }}
                text_STYLES={{ flex: 1 }}
              />
            );
          }}
          keyExtractor={(item) => "Select lang" + item.id + item.lang_in_en}
        />

        <Footer
          contentAbove={
            <ScrollView
              style={{
                flexDirection: "row",
                width: "100%",
                paddingLeft: 12,
                paddingTop: 12,
              }}
              horizontal={true}
              keyboardShouldPersistTaps="always"
            >
              {modal_LANGS?.map((lang) => (
                <Btn
                  key={lang.id + "tiny selected lang buttons"}
                  iconLeft={<ICON_flag lang={lang.id} />}
                  text={lang?.id?.toUpperCase()}
                  iconRight={<ICON_X color="primary" rotate={true} />}
                  onPress={() => SELECT_lang(lang)}
                  type="active"
                  tiny={true}
                  style={{ marginRight: 8 }}
                />
              ))}
            </ScrollView>
          }
          btnLeft={
            <Btn
              text={t("btn.cancel")}
              onPress={() => {
                if (!IS_inAction) cancel();
              }}
            />
          }
          btnRight={
            appLang === "en" ? (
              <Btn
                text={
                  !IS_inAction ? `Select ${modal_LANGS?.length} languages` : ""
                }
                onPress={() => {
                  if (!IS_inAction) SUBMIT_langs(modal_LANGS);
                }}
                iconRight={
                  IS_inAction ? <ActivityIndicator color="black" /> : null
                }
                type="action"
                style={{ flex: 1 }}
              />
            ) : (
              <Btn
                text={
                  !IS_inAction ? `${modal_LANGS?.length} Sprachen wählen` : ""
                }
                onPress={() => {
                  if (!IS_inAction) submit();
                }}
                iconRight={
                  IS_inAction ? <ActivityIndicator color="black" /> : null
                }
                type="action"
                stayPressed={IS_inAction}
                style={{ flex: 1 }}
              />
            )
          }
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
