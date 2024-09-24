//
//
//

import { View } from "react-native";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Basic/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Compound/Header/Header";
import { ICON_arrow, ICON_X } from "@/src/components/Basic/icons/icons";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import USE_fetchUserLists, { FETCH_privateLists } from "@/src/db/lists/fetch";
import Styled_FLATLIST from "@/src/components/Basic/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import List_BTN from "@/src/components/Complex/List_BTN/List_BTN";
import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import CreateList_MODAL from "@/src/components/Modals/CreateList_MODAL/CreateList_MODAL";
import SUBSCRIBE_toLists from "@/src/db/lists/SUBSCRIBE_toLists";
import List_SKELETONS from "@/src/components/Basic/Skeletons/List_SKELETONS";
import SUBSCRIBE_toVocabsForLists from "@/src/db/lists/SUBSCRIBE_toVocabsForLists";
import { useTranslation } from "react-i18next";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/Compound/SearchBar/SearchBar";
import { MyColors } from "@/src/constants/MyColors";

export default function MyLists_PAGE() {
  const { t } = useTranslation();
  const router = useRouter();
  const { SET_selectedList } = USE_selectedList();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const { user } = USE_auth();

  const [search, SET_search] = useState("");
  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const [totalListCount, SET_totalListCount] = useState<number>(0);

  const { FETCH_userLists, ARE_userListsLoading, userLists_ERROR } =
    USE_fetchUserLists();

  const GET_lists = async () => {
    const result = await FETCH_userLists({ user_id: user.id, search });
    SET_lists([...(result?.data || [])]);
    if (!totalListCount) SET_totalListCount([...(result?.data || [])].length);
  };

  useEffect(() => {
    GET_lists();

    // Subscribe to lists and vocabs updates
    const unsubscribeLists = SUBSCRIBE_toLists({
      SET_lists,
      totalListCount,
      SET_totalListCount,
    });
    const unsubscribeVocabs = SUBSCRIBE_toVocabsForLists({ SET_lists });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLists();
      unsubscribeVocabs();
    };
  }, [search]);

  console.log(lists?.[0]?.vocabs);

  return (
    <Page_WRAP>
      <Header
        title={t("header.page_list")}
        big={true}
        btnRight={
          <Btn
            type="seethrough_primary"
            iconLeft={<ICON_X color="primary" big={true} />}
            onPress={TOGGLE_createListModal}
            style={{ borderRadius: 100 }}
          />
        }
      />

      {totalListCount > 6 && (
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>
      )}

      {ARE_userListsLoading ? <List_SKELETONS /> : null}

      {!ARE_userListsLoading && lists.length > 0 ? (
        <Styled_FLATLIST
          data={lists}
          renderItem={({ item }: { item: List_MODEL }) => (
            <List_BTN
              list={item}
              onPress={() => {
                SET_selectedList(item);
                router.push("/(main)/vocabs/list");
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <Btn
              text={t("btn.createList")}
              iconLeft={<ICON_X color="primary" />}
              type="seethrough_primary"
              onPress={TOGGLE_createListModal}
            />
          }
        />
      ) : !ARE_userListsLoading ? (
        <View style={{ padding: 12, gap: 12 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: MyColors.border_white_005,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 24,
              borderRadius: 12,
            }}
          >
            <Styled_TEXT style={{ color: MyColors.text_white_06 }}>
              {search === ""
                ? t("label.youDontHaveAnyLists")
                : t("label.noListsFound")}
            </Styled_TEXT>
          </View>
          {search === "" && (
            <Btn
              text={t("btn.createList")}
              iconLeft={<ICON_X color="primary" />}
              type="seethrough_primary"
              onPress={TOGGLE_createListModal}
            />
          )}
        </View>
      ) : null}

      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Page_WRAP>
  );
}
