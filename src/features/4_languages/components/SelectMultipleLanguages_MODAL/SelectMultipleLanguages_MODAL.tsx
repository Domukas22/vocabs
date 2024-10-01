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
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import languages from "@/src/constants/languages";

import Block from "@/src/components/Block/Block";
import { Language_MODEL } from "@/src/db/models";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  active_LANGS: Language_MODEL[];
  languages: Language_MODEL[];
  SUBMIT_langs: (newLangSelection: Language_MODEL[]) => void;
  IS_inAction?: boolean;
}

export default function SelectMultipleLanguages_MODAL(
  props: SelectLanguagesModal_PROPS
) {
  const { t } = useTranslation();
  const {
    open,
    TOGGLE_open,
    active_LANGS,
    languages,
    SUBMIT_langs,
    IS_inAction = false,
  } = props;
  const [search, SET_search] = useState("");

  const [modal_LANGS, SET_modalLangs] = useState(active_LANGS);

  const searchedLangs =
    search !== ""
      ? languages.filter((lang) =>
          lang.lang_in_en.toLowerCase().includes(search.toLowerCase())
        )
      : languages;

  function SELECT_lang(incomdingLang: Language_MODEL) {
    const alreadyHasLang = modal_LANGS?.some((l) => l.id === incomdingLang.id);

    const tooManyLangSelected = modal_LANGS?.length >= 10;
    const hasOnly2Translations = modal_LANGS?.length === 2;
    if (!alreadyHasLang) {
      if (tooManyLangSelected) return;

      // add new lang
      SET_modalLangs((prev) => [...prev, incomdingLang]);
    } else {
      if (hasOnly2Translations) return;

      SET_modalLangs((prev) =>
        prev.filter((lang) => lang.id !== incomdingLang.id)
      );
    }
  }

  useEffect(() => {
    SET_modalLangs(active_LANGS);
  }, [open]);

  const appLang = useMemo(() => i18next.language, []);

  return (
    <Big_MODAL {...{ open }}>
      <Header
        title={t("modal.selectLanguages.header")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={() => {
              if (!IS_inAction) TOGGLE_open();
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
                    modal_LANGS.some((l) => l.id === item.id)
                      ? "primary"
                      : "grey"
                  }
                  rotate={modal_LANGS.some((l) => l.id === item.id)}
                  big={true}
                />
              }
              text={appLang === "en" ? item.lang_in_en : item.lang_in_de}
              onPress={() => SELECT_lang(item)}
              type={
                modal_LANGS.some((l) => l.id === item.id) ? "active" : "simple"
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
          >
            {modal_LANGS.map((lang) => (
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
              if (!IS_inAction) TOGGLE_open();
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
                if (!IS_inAction) SUBMIT_langs(modal_LANGS);
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
    </Big_MODAL>
  );
}
