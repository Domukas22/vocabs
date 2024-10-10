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
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/props";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import {
  DEFAULT_TAG_SUGGESTIONS,
  maxVocabTranslations,
  minVocabTranslations,
} from "@/src/constants/globalVars";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  tags: string[];
  TOGGLE_open: () => void;
  SUBMIT_tags: (tags: string[]) => void;
  list_TAGS: string[] | undefined;
}

export default function SelectTags_MODAL({
  open,
  TOGGLE_open,
  SUBMIT_tags,
  tags,
  list_TAGS = [],
}: SelectLanguagesModal_PROPS) {
  const { t } = useTranslation();
  const [search, SET_search] = useState("");

  const [modal_TAGS, SET_modalTags] = useState<string[]>(tags);
  const [available_TAGS, SET_availableTags] = useState<string[]>([
    ...tags,
    ...list_TAGS,
  ]);

  const cancel = () => {
    SET_modalTags(tags);
    SET_availableTags(list_TAGS || []);
    TOGGLE_open();
    SET_search("");
  };

  const submit = () => {
    SUBMIT_tags(modal_TAGS);
    SET_modalTags(tags);
    SET_availableTags(list_TAGS || []);
    TOGGLE_open();
    SET_search("");
  };

  const searched_TAGS =
    search !== ""
      ? available_TAGS?.filter((tag) =>
          tag.toLowerCase().includes(search.toLowerCase().trim())
        )
      : available_TAGS;

  function SELECT_tag(incoming_TAG: string) {
    const alreadyHasTag = modal_TAGS?.some(
      (tag) => tag.toLowerCase().trim() === incoming_TAG.toLowerCase().trim()
    );

    if (!alreadyHasTag) {
      SET_modalTags((prev) => [incoming_TAG, ...prev]);
      if (!available_TAGS.includes(incoming_TAG)) {
        SET_availableTags((prev) => [incoming_TAG, ...prev]);
      }
    } else {
      SET_modalTags((prev) =>
        prev.filter(
          (tag) =>
            tag.toLowerCase().trim() !== incoming_TAG.toLowerCase().trim()
        )
      );
    }
    SET_search("");
  }
  const appLang = useMemo(() => i18next.language, []);

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title={t("header.selectTags")}
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

        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>
        {/* 
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 12 }}>
            {modal_TAGS?.map((tag) => (
              <Btn
                key={"KeyForTagsToChoose" + tag}
                iconRight={
                  <ICON_X
                    color={
                      modal_TAGS?.some((t) => t === tag) ? "primary" : "grey"
                    }
                    rotate={modal_TAGS?.some((t) => t === tag)}
                  />
                }
                text={tag}
                onPress={() => SELECT_tag(tag)}
                type={modal_TAGS?.some((t) => t === tag) ? "active" : "simple"}
                tiny
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            ))}
          </View>
        </ScrollView> */}

        <Styled_FLATLIST
          gap={8}
          data={searched_TAGS}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => {
            return (
              <Btn
                key={"KeyForTagsToChoose" + item}
                iconRight={
                  <ICON_X
                    color={
                      modal_TAGS?.some((tag) => tag === item)
                        ? "primary"
                        : "grey"
                    }
                    rotate={modal_TAGS?.some((tag) => tag === item)}
                    big
                  />
                }
                text={item}
                onPress={() => SELECT_tag(item)}
                type={
                  modal_TAGS?.some((tag) => tag === item) ? "active" : "simple"
                }
                // tiny
                style={{ flex: 1 }}
                text_STYLES={{ flex: 1 }}
              />
            );
          }}
          ListFooterComponent={
            search !== "" && searched_TAGS.length === 0 ? (
              <Btn
                text={`${t("btn.createTagPre")} "${search}" ${t(
                  "btn.createTagPost"
                )}`}
                type="action"
                onPress={() => SELECT_tag(search)}
              />
            ) : null
          }
        />

        <Footer
          contentAbove={
            <ScrollView
              style={{
                flexDirection: "row",
                width: "100%",
                paddingLeft: 12,
                paddingVertical: 12,
              }}
              horizontal={true}
              keyboardShouldPersistTaps="always"
            >
              {modal_TAGS?.map((tag) => (
                <Btn
                  key={"KeyForSelectedTags" + tag}
                  text={tag}
                  iconRight={<ICON_X color="primary" rotate={true} />}
                  onPress={() => SELECT_tag(tag)}
                  type="active"
                  tiny={true}
                  style={{ marginRight: 8 }}
                />
              ))}
            </ScrollView>
          }
          btnLeft={<Btn text={t("btn.cancel")} onPress={cancel} />}
          btnRight={
            appLang === "en" ? (
              <Btn
                text={`Select ${modal_TAGS?.length} tags`}
                onPress={() => {
                  modal_TAGS;
                }}
                type="action"
                style={{ flex: 1 }}
              />
            ) : (
              <Btn
                text={`${modal_TAGS?.length} Tags wählen`}
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
