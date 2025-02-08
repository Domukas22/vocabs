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
} from "react-native";

import { useTranslation } from "react-i18next";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";

import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { t } from "i18next";
import List_MODEL from "@/src/db/models/List_MODEL";
import { CreateList_MODAL } from "../CreateList_MODAL/CreateList_MODAL";
import EmptyFlatlist_BOTTOM from "@/src/components/3_other/EmptyFlatlist_BOTTOM/EmptyFlatlist_BOTTOM";
import USE_observeMyList from "../../../functions/myLists/fetch/hooks/USE_observeMyLists/USE_observeMyLists";

interface SelectListModal_PROPS {
  open: boolean;
  title: string;
  selected_LIST?: List_MODEL | undefined;
  submit_ACTION: (list: List_MODEL) => void;
  cancel_ACTION: () => void;
  IS_inAction: boolean;
}

export function SelectMyList_MODAL({
  open,
  title = "INTERT MODAL TITLE",
  selected_LIST,
  submit_ACTION,
  cancel_ACTION,
  IS_inAction,
}: SelectListModal_PROPS) {
  const { t } = useTranslation();
  const { user } = USE_auth();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);

  const [selectedModal_LIST, SET_selectedModalList] = useState<
    List_MODEL | undefined
  >(selected_LIST);

  const [search, SET_search] = useState("");

  useEffect(() => {
    SET_selectedModalList(selected_LIST);
  }, [open]);

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

        <MyLists_FLATLIST
          user_id={user?.id || ""}
          {...{
            TOGGLE_createListModal,
            selectedModal_LIST,
            SET_selectedModalList,
          }}
        />

        <TwoBtn_BLOCK
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
        user={user}
        IS_open={SHOW_createListModal}
        currentList_NAMES={[]}
        CLOSE_modal={() => TOGGLE_createListModal()}
        onSuccess={(list: List_MODEL) => {
          SET_selectedModalList(list);
        }}
      />
    </Big_MODAL>
  );
}

export default function MyLists_FLATLIST({
  TOGGLE_createListModal,
  selectedModal_LIST,
  SET_selectedModalList,
}: {
  TOGGLE_createListModal: () => void;
  selectedModal_LIST: List_MODEL | undefined;
  SET_selectedModalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
}) {
  const { lists } = USE_observeMyList();

  if (lists && lists.length > 0) {
    return (
      <FlatList
        data={lists}
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
            type={item.id === selectedModal_LIST?.id ? "active" : "simple"}
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
