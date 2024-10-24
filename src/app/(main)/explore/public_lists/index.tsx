//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useRef, useState } from "react";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

import { useTranslation } from "react-i18next";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import { FlatList, View } from "react-native";
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
import { DisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/DisplaySettings_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import PublicVocabs_SUBNAV from "@/src/features/1_lists/components/PublicVocabs_SUBNAV";

export default function PublicLists_PAGE() {
  const router = useRouter();
  const [search, SET_search] = useState("");

  const { FETCH_publicLists, ARE_publicListsFetching, publicLists_ERROR } =
    USE_fetchSupabaseLists();

  const [lists, SET_lists] = useState<List_MODEL[]>([]);

  const GET_lists = async () => {
    const lists = await FETCH_publicLists();
    if (lists?.success && lists.data) {
      SET_lists(lists.data);
    }
  };

  useEffect(() => {
    GET_lists();
  }, []);

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

      <Styled_FLATLIST
        data={lists}
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
                    {item.collected_lang_ids.map((lang_id, index) => (
                      <ICON_flag
                        lang={lang_id}
                        key={item.id + lang_id + index}
                      />
                    ))}
                  </View>
                )}
            </Transition_BTN>
          );
        }}
        keyExtractor={(item) => "PublicVocab" + item.id}
      />
    </Page_WRAP>
  );
}
