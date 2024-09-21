//
//
//

import Btn from "@/src/components/btn/btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import { Styled_TEXT } from "@/src/components/Styled_TEXT";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  View,
  ScrollView,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import { BlurView } from "expo-blur";
import languages from "@/src/constants/languages";

import Block from "@/src/components/Block/Block";

interface SelectLanguagesModal_PROPS {
  SHOW_selectLangModal: boolean;
  TOGGLE_selectLangModal: () => void;
  langIDs: string[];
  HANDLE_lang: (id: string) => void;
}

export default function SelectLanguages_MODAL(
  props: SelectLanguagesModal_PROPS
) {
  const { SHOW_selectLangModal, TOGGLE_selectLangModal, langIDs, HANDLE_lang } =
    props;

  const [search, SET_search] = useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={SHOW_selectLangModal}
      style={{}}
    >
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
              onPress={TOGGLE_selectLangModal}
              style={{ borderRadius: 100 }}
            />
          }
        />
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>

        <ScrollView style={{ flex: 1 }}>
          {search === "" && (
            <>
              <Block label="Selected languages">
                {Object.values(languages)
                  .filter((lang) => langIDs?.includes(lang.id))
                  .map((lang) => {
                    return (
                      <Btn
                        iconLeft={
                          <Image
                            style={{
                              width: 24,
                              height: 16,
                              borderRadius: 2,
                              marginRight: 4,
                            }}
                            source={lang.image}
                          />
                        }
                        iconRight={<ICON_X color="primary" rotate={true} />}
                        text={lang.lang.en}
                        onPress={() => HANDLE_lang(lang.id)}
                        type="active"
                        style={{ flex: 1 }}
                        text_STYLES={{ flex: 1 }}
                      />
                    );
                  })}
              </Block>
              <Block label="Other languages">
                {Object.values(languages)
                  .filter((lang) => !langIDs?.includes(lang.id))
                  .map((lang, index) => {
                    return (
                      <Btn
                        iconLeft={
                          <Image
                            style={{
                              width: 24,
                              height: 16,
                              borderRadius: 2,
                              marginRight: 4,
                            }}
                            source={lang.image}
                          />
                        }
                        iconRight={<ICON_X />}
                        text={lang.lang.en}
                        onPress={() => HANDLE_lang(lang.id)}
                        type="simple"
                        style={{ flex: 1 }}
                        text_STYLES={{ flex: 1 }}
                        key={lang?.id + index}
                      />
                    );
                  })}
              </Block>
            </>
          )}
          {search !== "" && (
            <Block label="Other languages">
              {Object.values(languages)
                .filter((lang) =>
                  lang.lang.en.toLowerCase().includes(search.toLowerCase())
                )
                .map((lang) => {
                  return (
                    <Btn
                      iconLeft={
                        <Image
                          style={{
                            width: 24,
                            height: 16,
                            borderRadius: 2,
                            marginRight: 4,
                          }}
                          source={lang.image}
                        />
                      }
                      iconRight={
                        <ICON_X
                          color={
                            langIDs?.includes(lang.id) ? "primary" : "grey"
                          }
                          rotate={langIDs?.includes(lang.id)}
                        />
                      }
                      text={lang?.lang.en}
                      onPress={() => HANDLE_lang(lang.id)}
                      type={langIDs?.includes(lang.id) ? "active" : "simple"}
                      style={{ flex: 1 }}
                      text_STYLES={{ flex: 1 }}
                    />
                  );
                })}
            </Block>
          )}
        </ScrollView>

        <Footer
          btnLeft={
            <Btn
              text="Done"
              onPress={TOGGLE_selectLangModal}
              type="simple"
              style={{ flex: 1 }}
            />
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

function Lang_BTN({ lang, langIDs, HANDLE_lang }) {
  return (
    <Btn
      iconLeft={
        <Image
          style={{
            width: 24,
            height: 16,
            borderRadius: 2,
            marginRight: 4,
          }}
          source={lang.image}
        />
      }
      iconRight={
        <ICON_X
          color={langIDs?.includes(lang.id) ? "primary" : "grey"}
          rotate={langIDs?.includes(lang.id)}
        />
      }
      text={lang?.lang.en}
      onPress={() => HANDLE_lang(lang.id)}
      type={langIDs?.includes(lang.id) ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
