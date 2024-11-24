//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { ICON_checkMark, ICON_X } from "@/src/components/icons/icons";

import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useTranslation } from "react-i18next";
import CreateList_MODAL from "@/src/features/1_lists/components/CreateList_MODAL/CreateList_MODAL";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { EmptyFlatList_BOTTM } from "@/src/features/1_lists";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { Lists_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { t } from "i18next";
import List_MODEL from "@/src/db/models/List_MODEL";

interface SelectListModal_PROPS {
  open: boolean;
  title: string;
  current_LIST?: string | undefined;
  submit_ACTION: (list_id: string) => void;
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
  const { user } = USE_auth();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);

  const [selectedModal_LIST, SET_selectedModalList] = useState<
    string | undefined
  >(current_LIST);

  const [search, SET_search] = useState("");

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
          <SearchBar
            value={search}
            SET_value={(val: string) => SET_search(val)}
          />
        </Subnav>

        <MyLists_FLATLIST
          user_id={user?.id || ""}
          {...{
            TOGGLE_createListModal,
            selectedModal_LIST,
            SET_selectedModalList,
          }}
        />

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
        user={user}
        IS_open={SHOW_createListModal}
        currentList_NAMES={[]}
        CLOSE_modal={() => TOGGLE_createListModal()}
        onSuccess={(list_id: string) => {
          SET_selectedModalList(list_id);
        }}
      />
    </Big_MODAL>
  );
}

function _MyLists_FLATLIST({
  lists,
  TOGGLE_createListModal,
  selectedModal_LIST,
  SET_selectedModalList,
}: {
  lists: List_MODEL[];
  TOGGLE_createListModal: () => void;
  selectedModal_LIST: List_MODEL | undefined;
  SET_selectedModalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
}) {
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
      <EmptyFlatList_BOTTM
        emptyBox_TEXT={t("label.youDontHaveAnyLists")}
        btn_TEXT={t("btn.createList")}
        btn_ACTION={TOGGLE_createListModal}
      />
    );
  }
}

const enhance = withObservables(
  ["user_id"],
  ({ user_id }: { user_id: string }) => ({
    // vocabs: Vocabs_DB.query(Q.where("list_id", list_id)),
    lists: Lists_DB.query(Q.where("user_id", user_id)),
  })
);

export const MyLists_FLATLIST = enhance(_MyLists_FLATLIST);
