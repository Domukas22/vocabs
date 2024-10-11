//
//
//

import Block from "@/src/components/Block/Block";
import ChosenLangs_BLOCK from "@/src/components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { Language_PROPS, List_PROPS } from "@/src/db/props";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import GET_langs from "@/src/features/4_languages/utils/GET_langs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import USE_myListActions from "../../hooks/USE_myListActions";
import RenameList_MODAL from "../RenameList_MODAL/RenameList_MODAL";
import Footer from "@/src/components/Footer/Footer";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import DeleteList_MODAL from "../DeleteList_MODAL";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import UpdateList_MODAL from "../UpdateList_MODAL";
import { MyColors } from "@/src/constants/MyColors";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import USE_updateListDefaultLangs from "../../hooks/USE_updateListDefaultLangs";

interface ListSettingsModal_PROPS {
  list: List_MODEL;
  open: boolean;
  TOGGLE_open: () => void;
  backToIndex: () => void;
  user_id: string;
  HIGHLIGHT_listName: () => void;
}

export default function ListSettings_MODAL({
  open = false,
  TOGGLE_open = () => {},
  backToIndex = () => {},
  list,
  HIGHLIGHT_listName,
}: ListSettingsModal_PROPS) {
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user } = USE_auth();
  const { z_lists, z_DELETE_privateList, z_RENAME_privateList } = USE_zustand();
  const toast = useToast();
  const router = useRouter();

  const [
    SHOW_langSeletionModal,
    TOGGLE_langSelectionModal,
    SET_langSelectionModal,
  ] = USE_toggle(false);
  const [SHOW_deleteModal, TOGGLE_deleteModal, SET_deleteModal] =
    USE_toggle(false);
  const [SHOW_renameListModal, TOGGLE_renameListModal, SET_updateListModal] =
    USE_toggle(false);

  const langs = useMemo(
    () => GET_langs({ languages, target: list?.default_LANGS }),
    [list?.default_LANGS]
  );

  const {
    RENAME_privateList,
    UPDATE_privateListDefaultTRs,
    DELETE_privateList,
    IS_renamingList,
    IS_updatingDefaultListTRs,
    IS_deletingList,
  } = USE_myListActions({
    afterDelete_ACTION: () => {
      TOGGLE_deleteModal();
      TOGGLE_open();
      backToIndex();
    },
    afterRename_ACTION: () => {
      TOGGLE_renameListModal();
      TOGGLE_open();
      HIGHLIGHT_listName();
    },
    afterDefaultTrEdit_ACTION: () => {
      SET_langSelectionModal(false);
    },
  });

  const [IS_listNameHighlighted, SET_isListNameHighlighted] = useState(false);
  const HIGHLIGHT_modalListName = () => {
    if (!IS_listNameHighlighted) {
      SET_isListNameHighlighted(true);
      setTimeout(() => {
        SET_isListNameHighlighted(false);
      }, 3000);
    }
  };

  const {
    UPDATE_defaultLangs,
    IS_updatingDefaultLangs,
    updateDefaultLangs_ERROR,
    RESET_error,
  } = USE_updateListDefaultLangs();

  const UPDATE_langs = (new_LANGS: string[]) => {
    if (!new_LANGS) return;
    UPDATE_defaultLangs({
      user_id: user?.id || "",
      list_id: list?.id,
      new_LANGS,
    });
  };

  return (
    <Big_MODAL open={open}>
      <Header
        title={t("header.listSettings")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={TOGGLE_open}
            style={{ borderRadius: 100 }}
          />
        }
      />
      <Block
        row={true}
        styles={{ position: "relative", alignItems: "flex-start" }}
      >
        <View style={{ flex: 1 }}>
          <Styled_TEXT type="text_18_bold">{t("label.listName")}</Styled_TEXT>
          <Styled_TEXT
            style={{
              color: IS_listNameHighlighted
                ? MyColors.text_green
                : MyColors.text_white,
            }}
          >
            {list?.name || "NO LIST NAME PROVIDED"}
          </Styled_TEXT>
          {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
        </View>
        <Btn text="Edit" onPress={TOGGLE_renameListModal} />
      </Block>

      <ChosenLangs_BLOCK
        label={t("label.defaultVocabLangs")}
        langs={langs}
        toggle={TOGGLE_langSelectionModal}
        REMOVE_lang={(targetLang_ID) => {
          UPDATE_langs(
            langs.filter((l) => l.id !== targetLang_ID)?.map((x) => x.id)
          );
        }}
      />
      <Dropdown_BLOCK toggleBtn_TEXT={t("btn.dangerZone")}>
        <Btn
          type="delete"
          text={t("btn.deleteList")}
          onPress={TOGGLE_deleteModal}
        />
      </Dropdown_BLOCK>

      <Footer
        btnLeft={
          <Btn
            text={t("btn.done")}
            onPress={TOGGLE_open}
            type="simple"
            style={{ flex: 1 }}
          />
        }
      />

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectMultipleLanguages_MODAL
        open={SHOW_langSeletionModal}
        TOGGLE_open={TOGGLE_langSelectionModal}
        langs={langs}
        SUBMIT_langs={(langs: Language_PROPS[]) => {
          UPDATE_langs(langs.map((l) => l.id));
        }}
        languages={languages}
        IS_inAction={IS_updatingDefaultListTRs}
      />

      <RenameList_MODAL
        list_id={list?.id}
        user_id={user?.id}
        current_NAME={list?.name}
        IS_open={SHOW_renameListModal}
        CLOSE_modal={() => TOGGLE_renameListModal()}
        onSuccess={(updated_LIST?: List_PROPS) => {
          if (updated_LIST) {
            z_RENAME_privateList(updated_LIST);
            HIGHLIGHT_modalListName();
          }
        }}
      />

      <DeleteList_MODAL
        user_id={user?.id}
        IS_open={SHOW_deleteModal}
        list_id={list?.id}
        CLOSE_modal={() => SET_deleteModal(false)}
        onSuccess={(deleted_LIST?: List_PROPS) => {
          if (!deleted_LIST) return;
          SET_deleteModal(false);
          z_DELETE_privateList(deleted_LIST?.id);
          toast.show(
            t("notifications.listDeletedPre") +
              `"${deleted_LIST?.name}"` +
              t("notifications.listDeletedPost"),
            {
              type: "green",
              duration: 5000,
            }
          );
          router.back();
        }}
      />
    </Big_MODAL>
  );
}
