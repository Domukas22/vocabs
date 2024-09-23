//
//
//

import Btn from "../../Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import { Styled_TEXT } from "../../StyledText/StyledText";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import { BlurView } from "expo-blur";
import { List_MODEL } from "@/src/db/models";
import { FETCH_lists } from "@/src/db/lists/fetch";
import SUBSCRIBE_toLists from "@/src/db/lists/SUBSCRIBE_toLists";
import { supabase } from "@/src/lib/supabase";

interface SelectListModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  current_LIST: List_MODEL;
  SET_modalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
}

export default function SelectList_MODAL(props: SelectListModal_PROPS) {
  const { open, TOGGLE_modal, current_LIST, SET_modalList } = props;

  const [search, SET_search] = useState("");
  const [SHOW_createListModal, SET_createListModal] = useState(false);

  const [newListName, SET_newListName] = useState("");
  const [selectedModal_LIST, SET_selectedModalList] =
    useState<List_MODEL>(current_LIST);

  function TOGGLE_createListModal() {
    SET_newListName("");
    SET_createListModal((prev) => !prev);
  }

  const [loading, SET_loading] = useState(false);

  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const GET_lists = async () => {
    SET_loading(true);
    const res = await FETCH_lists();
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

  const submit = () => {
    if (current_LIST.id !== selectedModal_LIST.id) {
      SET_modalList(selectedModal_LIST);
    }
    TOGGLE_modal();
  };

  useEffect(() => {
    SET_selectedModalList(current_LIST);
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
          title="Select a list"
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

        {!loading && lists ? (
          <FlatList
            data={
              search === ""
                ? lists
                : lists.filter((list) =>
                    list.name.toLowerCase().includes(search.toLowerCase())
                  )
            }
            ListHeaderComponent={
              <Styled_TEXT type="label" style={{ paddingBottom: 8 }}>
                {search
                  ? `5 results for '${search}'`
                  : "Select a list for your vocab"}
              </Styled_TEXT>
            }
            ListFooterComponent={
              <Btn
                iconLeft={<ICON_X color="primary" />}
                text="Create a new list"
                onPress={TOGGLE_createListModal}
                type="seethrough_primary"
                style={{ flex: 1 }}
              />
            }
            renderItem={({ item }: { item: List_MODEL }) => (
              <Btn
                key={item.id + "list btn" + item.name}
                text={item.name}
                onPress={() => {
                  SET_selectedModalList(item);
                  SET_search("");
                }}
                type={item.id === selectedModal_LIST?.id ? "active" : "simple"}
                style={{ flex: 1, marginBottom: 8 }}
                text_STYLES={{ flex: 1 }}
              />
            )}
            keyExtractor={(item) => item.id + "list btn" + item.name}
            style={{ padding: 12, flex: 1 }}
          />
        ) : (
          <Styled_TEXT>Loading</Styled_TEXT>
        )}

        <Footer
          btnLeft={<Btn text="Cancel" onPress={TOGGLE_modal} type="simple" />}
          btnRight={
            <Btn
              text="Select list"
              onPress={submit}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
            />
          }
        />
      </SafeAreaView>
      <Simple_MODAL
        {...{
          title: "Create a list",

          IS_open: SHOW_createListModal,
          toggle: TOGGLE_createListModal,
          btnLeft: (
            <Btn text="Cancel" onPress={TOGGLE_createListModal} type="simple" />
          ),
          btnRight: (
            <Btn
              text="Create list"
              onPress={() => {}}
              type="action"
              style={{ flex: 1 }}
            />
          ),
        }}
      >
        <Styled_TEXT type="label">How will the new list be called?</Styled_TEXT>
        <StyledTextInput
          value={newListName}
          SET_value={SET_newListName}
          placeholder="F.e. German school vocabs..."
        />
        <View style={{ flexDirection: "row", gap: 8 }}></View>
      </Simple_MODAL>
    </Modal>
  );
}
