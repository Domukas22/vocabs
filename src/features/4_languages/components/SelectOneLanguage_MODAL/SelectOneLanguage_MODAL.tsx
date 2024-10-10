//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import {
  ICON_checkMark,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";

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
import { Language_MODEL } from "@/src/db/props";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import { USE_searchedLangs } from "../../hooks/USE_searchedLangs/USE_searchedLangs";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import Label from "@/src/components/Label/Label";
import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";

interface SelectOneLanguage_MODAL {
  open: boolean;
  TOGGLE_open: () => void;
  chosenLang_ID: string | undefined;
  SELECT_lang: (lang_ID: string) => void;
  list_LANGS: Language_MODEL[] | undefined;
}

export default function SelectOneLanguage_MODAL(
  props: SelectOneLanguage_MODAL
) {
  const { t } = useTranslation();
  const { open, TOGGLE_open, chosenLang_ID, SELECT_lang, list_LANGS } = props;
  const [modal_LANG, SET_modalLang] = useState<Language_MODEL | undefined>(
    list_LANGS?.find((lang) => lang.id === chosenLang_ID)
  );

  const appLang = useMemo(() => i18next.language, [i18next.language]);

  const submit = useCallback(() => {
    if (modal_LANG) SELECT_lang(modal_LANG.id);
    TOGGLE_open();
  }, [modal_LANG?.id]);

  const cancel = useCallback(() => {
    SET_modalLang(list_LANGS?.find((lang) => lang.id === chosenLang_ID));
    TOGGLE_open();
  }, []);

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title={t("header.selectOneLanguage")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={cancel}
              style={{ borderRadius: 100 }}
            />
          }
        />

        {list_LANGS?.length && list_LANGS?.length > 0 ? (
          <Styled_FLATLIST
            gap={8}
            data={list_LANGS}
            ListHeaderComponent={
              <Label styles={{ marginBottom: 8 }}>
                {t("label.langaugesOfThisList")}
              </Label>
            }
            renderItem={({ item }) => {
              return (
                <Btn
                  key={"Select lang" + item.id + item.lang_in_en}
                  iconLeft={
                    <View style={{ marginRight: 4 }}>
                      <ICON_flag lang={item?.id} big={true} />
                    </View>
                  }
                  text={appLang === "en" ? item.lang_in_en : item.lang_in_de}
                  iconRight={
                    modal_LANG?.id === item.id && (
                      <ICON_checkMark color="primary" />
                    )
                  }
                  onPress={() => SET_modalLang(item)}
                  type={modal_LANG?.id === item.id ? "active" : "simple"}
                  style={{ flex: 1 }}
                  text_STYLES={{ flex: 1 }}
                />
              );
            }}
            keyExtractor={(item) => "Select lang" + item?.id + item?.lang_in_en}
          />
        ) : list_LANGS?.length === 0 ? (
          <EmptyFlatList_BOTTM emptyBox_TEXT={t("label.noLanguagesFound")} />
        ) : null}

        <Footer
          btnLeft={<Btn text={t("btn.cancel")} onPress={cancel} />}
          btnRight={
            appLang && (
              <Btn
                text={`${appLang === "en" ? t("word.select") + " " : ""}${
                  modal_LANG?.[`lang_in_${appLang}`]
                }${appLang === "de" ? " " + t("word.select") : ""}`}
                onPress={submit}
                type="action"
                style={{ flex: 1 }}
              />
            )
          }
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
