//
//
//

import Btn from "@/src/components/Basic/Btn/Btn";
import Footer from "@/src/components/Compound/Footer/Footer";
import Header from "@/src/components/Compound/Header/Header";
import { ICON_flag, ICON_X } from "@/src/components/Basic/icons/icons";

import SearchBar from "@/src/components/Compound/SearchBar/SearchBar";
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
} from "react-native";
import languages from "@/src/constants/languages";

import Block from "@/src/components/Basic/Block/Block";
import { Language_MODEL } from "@/src/db/models";
import Styled_FLATLIST from "@/src/components/Basic/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  activeLangIDs: string[] | [];
  languages: Language_MODEL[];
  HANLDE_langs: (newLangSelection: Language_MODEL[]) => void;
}

export default function SelectLanguages_MODAL(
  props: SelectLanguagesModal_PROPS
) {
  const { t } = useTranslation();
  const { open, TOGGLE_open, activeLangIDs, languages, HANLDE_langs } = props;
  const [search, SET_search] = useState("");

  const [modal_LANGS, SET_modalLangs] = useState(
    languages.filter((l) => activeLangIDs.includes(l.id))
  );

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
      console.log("fire");
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

  const submit = () => {
    HANLDE_langs(modal_LANGS);
    TOGGLE_open();
  };

  useEffect(() => {
    SET_modalLangs(languages.filter((l) => activeLangIDs.includes(l.id)));
  }, [open]);

  const appLang = useMemo(() => i18next.language, []);

  return (
    <Modal animationType="slide" transparent={true} visible={open} style={{}}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,

          flex: 1,
        }}
      >
        <Header
          title={t("modal.selectLanguages.header")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_open}
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
                  modal_LANGS.some((l) => l.id === item.id)
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
                gap: 8,
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
          btnLeft={<Btn text={t("btn.cancel")} onPress={TOGGLE_open} />}
          btnRight={
            appLang === "en" ? (
              <Btn
                text={`Select ${modal_LANGS?.length} languages`}
                onPress={submit}
                type="action"
                style={{ flex: 1 }}
              />
            ) : (
              <Btn
                text={`${modal_LANGS?.length} Sprachen wählen`}
                onPress={submit}
                type="action"
                style={{ flex: 1 }}
              />
            )
          }
        />
      </SafeAreaView>
    </Modal>
  );
}