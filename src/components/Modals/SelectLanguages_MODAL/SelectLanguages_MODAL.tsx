//
//
//

import Btn from "../../Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  FlatList,
} from "react-native";
import languages from "@/src/constants/languages";

import Block from "@/src/components/Block/Block";
import { Language_MODEL } from "@/src/db/models";
import Styled_FLATLIST from "../../Flatlists/Styled_FLATLIST/Styled_FLATLIST";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  activeLangIDs: string[] | [];
  languages: Language_MODEL[];
  HANLDE_languages: (newLangSelection: Language_MODEL[]) => void;
}

export default function SelectLanguages_MODAL(
  props: SelectLanguagesModal_PROPS
) {
  const { open, TOGGLE_modal, activeLangIDs, languages, HANLDE_languages } =
    props;
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
    HANLDE_languages(modal_LANGS);
    TOGGLE_modal();
  };

  useEffect(() => {
    SET_modalLangs(languages.filter((l) => activeLangIDs.includes(l.id)));
  }, [open]);

  return (
    <Modal animationType="slide" transparent={true} visible={open} style={{}}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,

          flex: 1,
        }}
      >
        <Header
          title="Select languages"
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_modal}
              style={{ borderRadius: 100 }}
            />
          }
        />
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>

        <Styled_FLATLIST
          data={searchedLangs}
          renderItem={({ item }) => {
            return (
              <Btn
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
                text={item.lang_in_en}
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
          keyExtractor={(item) => item.id}
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
          btnLeft={<Btn text="Cancel" onPress={TOGGLE_modal} />}
          btnRight={
            <Btn
              text={`Save ${modal_LANGS?.length} languages`}
              onPress={submit}
              type="action"
              style={{ flex: 1 }}
            />
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
