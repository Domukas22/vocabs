//
//
//

import { Alert, Text, View } from "react-native";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { FETCH_listsWithPopulatedVocabs } from "@/src/db/lists/fetch";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import List_BTN from "@/src/components/List_BTN/List_BTN";
import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import Simple_MODAL from "@/src/components/Modals/Simple_MODAL/Simple_MODAL";
import CreateList_MODAL from "@/src/components/Modals/CreateList_MODAL";
import SUBSCRIBE_toLists from "@/src/db/lists/SUBSCRIBE_toLists";
import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";
import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";
import SUBSCRIBE_toVocabsForLists from "@/src/db/lists/SUBSCRIBE_toVocabsForLists";
import { useTranslation } from "react-i18next";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import { MyColors } from "@/src/constants/MyColors";

export default function MyLists_PAGE() {
  const { t } = useTranslation();
  const router = useRouter();
  const { SET_selectedList } = USE_selectedList();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const [loading, SET_loading] = useState(false);
  const { user } = USE_auth();

  const [search, SET_search] = useState("");
  const [totalListCount, SET_totalListCount] = useState<number | undefined>(
    undefined
  );

  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const GET_lists = async () => {
    SET_loading(true);
    const res = await FETCH_listsWithPopulatedVocabs({
      user_id: user.id,
      search,
    });
    SET_lists([...(res?.data || [])]);
    SET_loading(false);

    if (totalListCount === undefined) {
      // only happens after the first fetch
      SET_totalListCount([...(res?.data || [])].length);
    }
  };

  useEffect(() => {
    GET_lists();

    const subscription = SUBSCRIBE_toLists({ SET_lists });
    const vocabsSubscription = SUBSCRIBE_toVocabsForLists({ SET_lists });
    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(vocabsSubscription);
    };
  }, [search]);

  return (
    <Page_WRAP>
      <Header
        // title="My lists"
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

      {totalListCount && totalListCount !== 0 && (
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>
      )}

      {loading ? <List_SKELETONS /> : null}
      {!loading && lists.length > 0 ? (
        <Styled_FLATLIST
          data={lists}
          renderItem={({ item }: { item: List_MODEL }) => (
            <View>
              <List_BTN
                list={item}
                onPress={() => {
                  SET_selectedList(item);
                  router.push("/(main)/vocabs/list");
                }}
              />
            </View>
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
      ) : null}
      {!loading && totalListCount === 0 && (
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
              {t("label.youDontHaveAnyLists")}
            </Styled_TEXT>
          </View>
          <Btn
            text={t("btn.createList")}
            iconLeft={<ICON_X color="primary" />}
            type="seethrough_primary"
            onPress={TOGGLE_createListModal}
          />
        </View>
      )}
      {!loading &&
        totalListCount !== 0 &&
        lists.length === 0 &&
        search !== "" && (
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
                {t("label.noListsFound")}
              </Styled_TEXT>
            </View>
          </View>
        )}
      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Page_WRAP>
  );
}
