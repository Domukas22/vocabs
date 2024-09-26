//
//
//

import Block from "@/src/components/Block/Block";
import ChosenLangs_BLOCK from "@/src/components/Block/Variations/ChosenLangs_BLOCK/ChosenLangs_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectLanguages_MODAL from "@/src/components/Modals/Big_MODAL/SelectLanguages_MODAL/SelectLanguages_MODAL";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { Language_MODEL, List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import GET_activeLangIDs from "@/src/utils/GET_activeLangIDs";
import GET_langs from "@/src/utils/GET_langs";
import REMOVE_lang from "@/src/utils/REMOVE_lang";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import USE_myListActions from "../../hooks/USE_myListActions";
import RenameList_MODAL from "../RenameList_MODAL/RenameList_MODAL";

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

  const [
    SHOW_langSeletionModal,
    TOGGLE_langSelectionModal,
    SET_langSelectionModal,
  ] = USE_toggle(false);
  const [SHOW_deleteModal, TOGGLE_deleteModal] = USE_toggle(false);
  const [SHOW_renameListModal, TOGGLE_renameListModal] = USE_toggle(false);

  const langs = useMemo(
    () => GET_langs({ languages, target: list.default_TRs }),
    [list.default_TRs]
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
          <Styled_TEXT>{list.name || "NO LIST NAME PROVIDED"}</Styled_TEXT>
          {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
        </View>
        <Btn text="Edit" onPress={TOGGLE_renameListModal} />
      </Block>

      <ChosenLangs_BLOCK
        label={t("label.defaultVocabLangs")}
        langs={langs}
        toggle={TOGGLE_langSelectionModal}
        REMOVE_lang={(targetLang_ID) => {
          UPDATE_privateListDefaultTRs(
            list.id,
            langs.filter((l) => l.id !== targetLang_ID).map((l) => l.id)
          );
        }}
      />
      <Block>
        <Btn
          type="delete"
          text={t("btn.deleteList")}
          onPress={TOGGLE_deleteModal}
        />
      </Block>

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectLanguages_MODAL
        open={SHOW_langSeletionModal}
        TOGGLE_open={TOGGLE_langSelectionModal}
        active_LANGS={langs}
        SUBMIT_langs={(langs: Language_MODEL[]) => {
          UPDATE_privateListDefaultTRs(
            list.id,
            langs.map((l) => l.id)
          );
        }}
        languages={languages}
        IS_inAction={IS_updatingDefaultListTRs}
      />

      {/* ----- DELETE confirmation ----- */}
      <RenameList_MODAL
        open={SHOW_renameListModal}
        toggle={TOGGLE_renameListModal}
        title={t("modal.listSettings.renameListModalTitle")}
        rename={(new_NAME: string) => RENAME_privateList(new_NAME, list.id)}
        IS_inAction={IS_renamingList}
        actionBtnText={t("btn.confirmListRename")}
        current_NAME={list.name}
      />
      {/* ----- DELETE confirmation ----- */}
      <Confirmation_MODAL
        open={SHOW_deleteModal}
        toggle={TOGGLE_deleteModal}
        title={t("modal.listSettings.deleteListconfirmation")}
        action={() => DELETE_privateList(list.id)}
        IS_inAction={IS_deletingList}
        actionBtnText={t("btn.confirmDelete")}
      />
    </Big_MODAL>
  );
}
