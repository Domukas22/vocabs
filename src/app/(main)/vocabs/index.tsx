//
//
//

import { Button, View } from "react-native";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Basic/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Compound/Header/Header";
import {
  ICON_arrow,
  ICON_premiumCheckmark,
  ICON_toastNotification,
  ICON_X,
} from "@/src/components/Basic/icons/icons";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import USE_fetchUserLists from "@/src/db/lists/USE_fetchUserLists/USE_fetchUserLists";
import Styled_FLATLIST from "@/src/components/Basic/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import List_BTN from "@/src/components/Complex/List_BTN/List_BTN";
import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import CreateList_MODAL from "@/src/components/Modals/CreateList_MODAL/CreateList_MODAL";

import List_SKELETONS from "@/src/components/Basic/Skeletons/List_SKELETONS";

import { useTranslation } from "react-i18next";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/Compound/SearchBar/SearchBar";
import { MyColors } from "@/src/constants/MyColors";
import USE_zustandStore from "@/src/zustand_store";
import Toast from "@/src/components/Basic/Toast/Toast";
import { useToast } from "react-native-toast-notifications";

export default function MyLists_PAGE() {
  const { t } = useTranslation();
  const router = useRouter();
  const { SET_selectedList } = USE_selectedList();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const { user } = USE_auth();
  const { lists_z, SET_lists_z } = USE_zustandStore();

  const [search, SET_search] = useState("");
  const [totalListCount, SET_totalListCount] = useState<number>(0);

  const { FETCH_userLists, ARE_userListsLoading, userLists_ERROR } =
    USE_fetchUserLists();

  const GET_lists = async () => {
    const result = await FETCH_userLists({ user_id: user.id, search });
    if (result.success) {
      SET_lists_z(result.data);
      if (!totalListCount) SET_totalListCount(result.data.length);
    }
  };

  const [filtered_LISTS, SET_filteredLsits] = useState<List_MODEL[]>(lists_z);

  useEffect(() => {
    GET_lists();
  }, []);

  useEffect(() => {
    // When `search` changes, filter lists based on the search query
    if (search === "") {
      // If there's no search term, show all lists
      SET_filteredLsits(lists_z);
    } else {
      // Filter the lists based on the search term (case-insensitive)
      SET_filteredLsits(
        lists_z.filter((list) =>
          list.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, lists_z]);

  const toast = useToast();

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
      <Btn
        onPress={() =>
          toast.show("Hello World", {
            type: "custom_success",
            duration: 3000,
          })
        }
        text="Success"
        style={{ borderRadius: 100, marginBottom: 40 }}
      />
      <Btn
        onPress={() =>
          toast.show("Hello World", {
            type: "custom_error",
            duration: 3000,
          })
        }
        text="Error"
        style={{ borderRadius: 100, marginBottom: 40 }}
      />
      <Btn
        onPress={() =>
          toast.show("Hello World", {
            type: "custom_warning",
            duration: 3000,
          })
        }
        text="Warning"
        style={{ borderRadius: 100, marginBottom: 40 }}
      />

      {totalListCount > 6 && (
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>
      )}

      {ARE_userListsLoading ? <List_SKELETONS /> : null}

      {!ARE_userListsLoading && filtered_LISTS.length > 0 ? (
        <Styled_FLATLIST
          data={filtered_LISTS}
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
            search === "" ? (
              <Btn
                text={t("btn.createList")}
                iconLeft={<ICON_X color="primary" />}
                type="seethrough_primary"
                onPress={TOGGLE_createListModal}
              />
            ) : null
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
