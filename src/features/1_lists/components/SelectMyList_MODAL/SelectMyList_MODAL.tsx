//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_checkMark, ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Subnav from "@/src/components/Subnav/Subnav";

import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { List_MODEL } from "@/src/db/models";

import { useTranslation } from "react-i18next";
import CreateList_MODAL from "@/src/features/1_lists/components/CreateList_MODAL/CreateList_MODAL";
import USE_zustand from "@/src/zustand";
import SEARCH_lists from "@/src/features/1_lists/utils/SEARCH_lists";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { EmptyFlatList_BOTTM } from "@/src/features/1_lists";
import { USE_searchedLists } from "../../hooks/USE_searchedLists/USE_searchedLists";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
interface SelectListModal_PROPS {
  open: boolean;
  title: string;
  current_LIST?: List_MODEL | undefined;
  submit_ACTION: (list: List_MODEL) => void;
  cancel_ACTION: () => void;
  IS_inAction: boolean;
}

export default function SelectMyList_MODAL({
  open,
  title = "INTERT MODAL TITLE",
  current_LIST,
  submit_ACTION,
  cancel_ACTION,
  IS_inAction,
}: SelectListModal_PROPS) {
  const { t } = useTranslation();

  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);

  const [selectedModal_LIST, SET_selectedModalList] = useState<
    List_MODEL | undefined
  >(current_LIST);

  const { z_lists, z_ARE_listsLoading } = USE_zustand();

  const { searched_LISTS, search, SEARCH_lists, ARE_listsSearching } =
    USE_searchedLists(z_lists);

  useEffect(() => {
    SET_selectedModalList(current_LIST);
  }, [open]);

  return (
    <Big_MODAL open={open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
          <SearchBar value={search} SET_value={SEARCH_lists} />
        </Subnav>

        {!ARE_listsSearching &&
          z_lists.length > 0 &&
          searched_LISTS.length > 0 && (
            <FlatList
              data={searched_LISTS}
              keyboardShouldPersistTaps="always"
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
                  iconRight={
                    item.id === selectedModal_LIST?.id && (
                      <ICON_checkMark color="primary" />
                    )
                  }
                  onPress={() => {
                    SET_selectedModalList(item);
                  }}
                  type={
                    item.id === selectedModal_LIST?.id ? "active" : "simple"
                  }
                  style={[
                    { flex: 1, marginBottom: 8 },
                    item.id !== selectedModal_LIST?.id && { paddingRight: 40 },
                  ]}
                  text_STYLES={{ flex: 1 }}
                />
              )}
              keyExtractor={(item) => item.id + "list btn" + item.name}
              style={{ padding: 12, flex: 1 }}
            />
          )}

        {z_ARE_listsLoading && <Styled_TEXT>Loading</Styled_TEXT>}
        {!z_ARE_listsLoading && z_lists.length === 0 && (
          <EmptyFlatList_BOTTM
            emptyBox_TEXT={
              search === ""
                ? t("label.youDontHaveAnyLists")
                : t("label.noListsFound")
            }
            {...{ search, TOGGLE_createListModal }}
            btn_TEXT={t("btn.createList")}
            btn_ACTION={TOGGLE_createListModal}
          />
        )}

        <Footer
          btnLeft={
            <Btn text={t("btn.cancel")} onPress={cancel_ACTION} type="simple" />
          }
          btnRight={
            <Btn
              text={!IS_inAction ? t("btn.confirmListSelection") : ""}
              iconRight={
                IS_inAction ? <ActivityIndicator color="black" /> : null
              }
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
      </KeyboardAvoidingView>
      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Big_MODAL>
  );
}
