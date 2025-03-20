//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_checkMark, ICON_X } from "@/src/components/1_grouped/icons/icons";

import SearchBar from "@/src/components/1_grouped/inputs/SearchBar/SearchBar";
import Subheader from "@/src/components/1_grouped/subheader/Subheader";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";

import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { t } from "i18next";
import List_MODEL from "@/src/db/models/List_MODEL";
import { CreateList_MODAL } from "../CreateList_MODAL/CreateList_MODAL";
import EmptyFlatlist_BOTTOM from "@/src/components/3_other/EmptyFlatlist_BOTTOM/EmptyFlatlist_BOTTOM";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import USE_controlMyTinyListsFetch from "@/src/features_new/lists/hooks/fetchControl/USE_controlMyListsFetch copy/USE_controlMyTinyListsFetch";
import { TinyList_TYPE } from "@/src/features_new/lists/types";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { USE_debounceSearch } from "@/src/hooks";
import { ListFlatlist_FOOTER } from "@/src/features_new/lists/components/flashlists/components/ListFlatlist_FOOTER/ListFlatlist_FOOTER";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

interface SelectListModal_PROPS {
  open: boolean;
  title: string;
  initial_LIST?: { id: string; name: string };
  submit_ACTION: (list: TinyList_TYPE) => void;
  cancel_ACTION: () => void;
  IS_inAction: boolean;
}

export function SelectMyList_MODAL({
  open,
  title = "INTERT MODAL TITLE",
  initial_LIST,
  submit_ACTION,
  cancel_ACTION,
  IS_inAction,
}: SelectListModal_PROPS) {
  const { t } = useTranslation();
  const { z_user } = z_USE_user();

  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const [selected_LIST, SET_selectedList] = useState<TinyList_TYPE | undefined>(
    initial_LIST
  );

  // ------------------------------------------------------

  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();
  useEffect(() => SET_selectedList(initial_LIST), [open]);

  const {
    LOAD_more,
    HAS_reachedEnd,
    error,
    loading_STATE,
    tiny_LISTS,
    unpaginated_COUNT,
  } = USE_controlMyTinyListsFetch({ search });

  return (
    <Big_MODAL open={open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
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
        <Subheader>
          <SearchBar
            value={search}
            SET_value={(val: string) => SET_search(val)}
          />
        </Subheader>
        <View style={{ flex: 1 }}>
          <MyLists_FLATLIST
            lists={tiny_LISTS}
            selected_LIST={selected_LIST}
            SELECT_list={(list) => SET_selectedList(list)}
            TOGGLE_createListModal={TOGGLE_createListModal}
            Header={
              <Flashlist_HEADER
                IS_debouncing={IS_debouncing}
                debouncedSearch={debouncedSearch}
                search={search}
                loading_STATE={loading_STATE}
                list_NAME={""}
                unpaginated_COUNT={unpaginated_COUNT}
                appliedFilter_COUNT={0}
                type="my-lists"
              />
            }
            Footer={
              <ListFlatlist_FOOTER
                LOAD_more={LOAD_more}
                OPEN_createVocabModal={TOGGLE_createListModal}
                RESET_search={RESET_search}
                unpaginated_COUNT={unpaginated_COUNT}
                HAS_reachedEnd={HAS_reachedEnd}
                IS_debouncing={IS_debouncing}
                loading_STATE={loading_STATE}
                debouncedSearch={debouncedSearch}
                error={error}
              />
            }
            IS_debouncing={IS_debouncing}
            error={error}
            loading_STATE={loading_STATE}
          />
        </View>
        <TwoBtn_BLOCK
          btnLeft={
            <Btn
              text={t("btn.cancel")}
              onPress={() => {
                RESET_search();
                cancel_ACTION();
              }}
              type="simple"
            />
          }
          btnRight={
            <Btn
              text={!IS_inAction ? t("btn.confirmListSelection") : ""}
              iconRight={
                IS_inAction ? <ActivityIndicator color="black" /> : null
              }
              onPress={() => {
                if (!IS_inAction && selected_LIST) {
                  submit_ACTION(selected_LIST);
                  RESET_search();
                }
              }}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
              stayPressed={IS_inAction}
            />
          }
        />
      </KeyboardAvoidingView>
      <CreateList_MODAL
        IS_open={SHOW_createListModal}
        CLOSE_modal={() => TOGGLE_createListModal()}
      />
    </Big_MODAL>
  );
}

export default function MyLists_FLATLIST({
  TOGGLE_createListModal,
  selected_LIST,
  SELECT_list = () => {},
  lists = [],
  Header,
  Footer,
  IS_debouncing,
  error,
  loading_STATE,
}: {
  lists: TinyList_TYPE[];
  selected_LIST: TinyList_TYPE | undefined;
  SELECT_list: (list: TinyList_TYPE) => void;
  TOGGLE_createListModal: () => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  IS_debouncing: boolean;
  error: General_ERROR | undefined;
  loading_STATE: loadingState_TYPES;
}) {
  if (lists && lists.length > 0) {
    return (
      <Styled_FLASHLIST
        data={
          IS_debouncing ||
          error ||
          (loading_STATE !== "none" &&
            loading_STATE !== "error" &&
            loading_STATE !== "loading_more")
            ? []
            : lists || []
        }
        gap={8}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        // ListFooterComponent={
        //   <Btn
        //     iconLeft={<ICON_X color="primary" />}
        //     text={t("btn.createList")}
        //     onPress={TOGGLE_createListModal}
        //     type="seethrough_primary"
        //     style={{ flex: 1 }}
        //   />
        // }
        renderItem={({ item: list }: { item: TinyList_TYPE }) => {
          const IS_selected = selected_LIST?.id === list.id;
          return (
            <Btn
              key={list.id + "list btn" + list.name}
              text={list.name}
              iconRight={IS_selected && <ICON_checkMark color="primary" />}
              onPress={() => SELECT_list(list)}
              type={IS_selected ? "active" : "simple"}
              style={[IS_selected && { paddingRight: 40 }]}
              text_STYLES={{ flex: 1 }}
            />
          );
        }}
        keyExtractor={(item) => item.id + "list btn" + item.name}
        extraData={[lists]}
      />
    );
  }

  if (!lists || lists.length === 0) {
    return (
      <EmptyFlatlist_BOTTOM
        emptyBox_TEXT={t("label.youDontHaveAnyLists")}
        btn_TEXT={t("btn.createList")}
        btn_ACTION={TOGGLE_createListModal}
      />
    );
  }
}
