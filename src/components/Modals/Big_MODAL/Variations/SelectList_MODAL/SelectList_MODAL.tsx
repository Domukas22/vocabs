//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, SafeAreaView, View } from "react-native";
import { List_MODEL } from "@/src/db/models";
import { FETCH_lists } from "@/src/db/lists/fetch";
import { useTranslation } from "react-i18next";
import CreateList_MODAL from "@/src/features/1_lists/components/CreateList_MODAL/CreateList_MODAL";
import USE_zustand from "@/src/zustand";
import FILTER_lists from "@/src/features/1_lists/utils/FILTER_lists";
import { USE_toggle } from "@/src/hooks/USE_toggle";
interface SelectListModal_PROPS {
  open: boolean;
  title: string;
  current_LIST?: List_MODEL | undefined;
  submit_ACTION: (list: List_MODEL) => void;
  cancel_ACTION: () => void;
  IS_inAction: boolean;
}

export default function SelectPrivateList_MODAL({
  open,
  title = "INTERT MODAL TITLE",
  current_LIST,
  submit_ACTION,
  cancel_ACTION,
  IS_inAction,
}: SelectListModal_PROPS) {
  const { t } = useTranslation();

  const [search, SET_search] = useState("");
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);

  const [selectedModal_LIST, SET_selectedModalList] = useState<
    List_MODEL | undefined
  >(current_LIST);

  const { z_lists, z_ARE_listsLoading } = USE_zustand();

  const filtered_LISTS = useMemo(
    () => FILTER_lists({ search, lists: z_lists }),
    [search, z_lists]
  );

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
          title={title}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={cancel_ACTION}
              style={{ borderRadius: 100 }}
            />
          }
        />
        <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>

        {!z_ARE_listsLoading && z_lists.length > 0 ? (
          <FlatList
            data={
              search === ""
                ? z_lists
                : filtered_LISTS.filter((list) =>
                    list.name.toLowerCase().includes(search.toLowerCase())
                  )
            }
            ListFooterComponent={
              <Btn
                iconLeft={<ICON_X color="primary" />}
                text={t("btn.createList")}
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
          btnLeft={
            <Btn text={t("btn.cancel")} onPress={cancel_ACTION} type="simple" />
          }
          btnRight={
            <Btn
              text={t("btn.confirmListSelection")}
              onPress={() => {
                if (!IS_inAction && selectedModal_LIST)
                  submit_ACTION(selectedModal_LIST);
              }}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
              stayPressed={IS_inAction}
            />
          }
        />
      </SafeAreaView>
      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Modal>
  );
}
