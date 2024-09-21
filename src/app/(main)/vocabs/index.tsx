//
//
//

import { Alert, Text, View } from "react-native";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import FETCH_userLists from "@/src/db/lists/FETCH_userLists";
import Styled_FLATLIST from "@/src/components/Flatlists/Styled_FLATLIST/Styled_FLATLIST";
import MyList_BTN from "@/src/components/MyList_BTN/MyList_BTN";
import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import Simple_MODAL from "@/src/components/Modals/Simple_MODAL/Simple_MODAL";
import CreateList_MODAL from "@/src/components/Modals/CreateList_MODAL";
import SUBSCRIBE_toLists from "@/src/db/lists/SUBSCRIBE_toLists";
import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";

export default function MyLists_PAGE() {
  const router = useRouter();
  const { SET_selectedList } = USE_selectedList();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const [loading, SET_loading] = useState(false);

  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const GET_lists = async () => {
    SET_loading(true);
    const res = await FETCH_userLists();
    SET_lists([...(res?.data || [])]);
    SET_loading(false);
  };

  useEffect(() => {
    GET_lists();

    const subscription = SUBSCRIBE_toLists({ SET_lists });
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <Page_WRAP>
      <Header
        title="My lists"
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

      {loading ? <List_SKELETONS /> : null}
      {!loading ? (
        <Styled_FLATLIST
          data={lists}
          renderItem={({ item }: { item: List_MODEL }) => (
            <View>
              <MyList_BTN
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
              text="Create a new list"
              iconLeft={<ICON_X color="primary" />}
              type="seethrough_primary"
              onPress={TOGGLE_createListModal}
            />
          }
        />
      ) : null}
      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Page_WRAP>
  );
}
