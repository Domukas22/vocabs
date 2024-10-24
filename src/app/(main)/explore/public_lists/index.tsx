//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useMemo, useRef, useState } from "react";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

import { useTranslation } from "react-i18next";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";

import { MyColors } from "@/src/constants/MyColors";
import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { ICON_arrow, ICON_flag } from "@/src/components/icons/icons";
import USE_fetchSupabaseLists from "@/src/features/2_vocabs/hooks/USE_fetchPublicSupabaseLists";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import {
  _DisplaySettings_PROPS,
  GET_displaySettings,
  SET_localStorageDisplaySettings,
} from "@/src/utils/DisplaySettings";
import USE_displaySettings from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import PublicVocabs_SUBNAV from "@/src/components/PublicVocabs_SUBNAV";
import USE_fetchPublicSupabaseLists from "@/src/features/2_vocabs/hooks/USE_fetchPublicSupabaseLists";
import USE_zustand from "@/src/zustand";
import PublicLists_SUBNAV from "@/src/features/1_lists/components/PublicLists_SUBNAV";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";

function Hooss(delay: number) {
  const [search, SET_search] = useState("");
  const [debouncedSearch, SET_debouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      SET_debouncedSearch(search);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [search, delay]);

  return { search, SET_search, debouncedSearch };
}

export default function PublicLists_PAGE() {
  const router = useRouter();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_listDisplay_SETTINGS } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const {
    publicLists,
    ARE_listsFetching,
    publicLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_fetchPublicSupabaseLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    paginateBy: 2,
  });

  // const collectedLangIds = useMemo(() => {
  //   // infinite loop occurs if not defined
  //   return list?.collected_lang_ids || [];
  // }, [list?.collected_lang_ids]);

  return (
    <Page_WRAP>
      <Header
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow direction="left" />}
            style={{ borderRadius: 100 }}
            onPress={() => router.back()}
          />
        }
        btnRight={
          <Btn
            iconLeft={<ICON_arrow direction="left" />}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
        title="📁 Public lists"
      />

      <PublicLists_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        {...{ search, SET_search }}
      />
      <Styled_FLATLIST
        data={publicLists}
        ListHeaderComponent={
          <Styled_TEXT
            type="text_22_bold"
            style={{ marginTop: 4, marginBottom: 16 }}
          >
            Explore all public lists
          </Styled_TEXT>
        }
        renderItem={({ item }) => {
          return (
            <Transition_BTN
              onPress={() =>
                router.push(`/(main)/explore/public_lists/${item.id}`)
              }
            >
              {item.name && (
                <Styled_TEXT type="text_18_bold">{item.name}</Styled_TEXT>
              )}
              {/* {item.description && (
                <Styled_TEXT type="label_small">{item.description}</Styled_TEXT>
              )} */}
              {item.vocab_COUNT && (
                <Styled_TEXT
                  type="label_small"
                  // style={{ color: MyColors.text_primary }}
                >
                  {item.vocab_COUNT} vocabs
                </Styled_TEXT>
              )}
              {item.collected_lang_ids &&
                item.collected_lang_ids.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,

                      justifyContent: "flex-end",
                    }}
                  >
                    {item.collected_lang_ids?.map(
                      (lang_id: string, index: number) => (
                        <ICON_flag
                          lang={lang_id}
                          key={item.id + lang_id + index}
                        />
                      )
                    )}
                  </View>
                )}
            </Transition_BTN>
          );
        }}
        keyExtractor={(item) => "PublicVocab" + item.id}
        ListFooterComponent={
          !HAS_reachedEnd && !ARE_listsFetching ? (
            <Btn
              text={!IS_loadingMore ? "Load more" : ""}
              iconRight={
                IS_loadingMore ? <ActivityIndicator color="white" /> : null
              }
              onPress={LOAD_more}
            />
          ) : HAS_reachedEnd ? (
            <Styled_TEXT>The end</Styled_TEXT>
          ) : null
        }
      />

      {/* ------------------------ MODALS --------------------------------- */}

      <ListDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
      />
    </Page_WRAP>
  );
}
