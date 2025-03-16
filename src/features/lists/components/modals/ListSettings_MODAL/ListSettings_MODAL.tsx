//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import ChosenListLangs_BLOCK from "@/src/components/1_grouped/blocks/ChosenListLangs_BLOCK/ChosenListLangs_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import Dropdown_BLOCK from "@/src/components/1_grouped/blocks/Dropdown_BLOCK/Dropdown_BLOCK";

import { MyColors } from "@/src/constants/MyColors";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";

import { DeleteList_MODAL } from "../DeleteList_MODAL/DeleteList_MODAL";
import { SelectMultipleLanguages_MODAL } from "@/src/features/languages/components";
import { USE_modalToggles } from "@/src/hooks/index";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { RenameList_MODAL } from "../RenameList_MODAL/RenameList_MODAL";
import { ResetAllListVocabDifficulties_MODAL } from "../ResetAllListVocabDifficulties_MODAL/ResetAllListVocabDifficulties_MODAL";
import { USE_updateListDefaultLangIds } from "@/src/features_new/lists/hooks/actions/updateDefaultLangs/USE_updateListDefaultLangIds/USE_updateListDefaultLangIds";

interface ListSettingsModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
  refetch: () => void;
}

export function ListSettings_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
  refetch = () => {},
}: ListSettingsModal_PROPS) {
  const { t } = useTranslation();
  const { z_myOneList } = z_USE_myOneList();

  const { modals } = USE_modalToggles([
    "deleteList",
    "selectLangs",
    "renameList",
    "resetDifficulties",
  ]);

  const {
    highlight: HIGHLIGHT_listName,
    isHighlighted: IS_listNameHighlighted,
  } = USE_highlightBoolean(3000);

  return (
    <Big_MODAL open={IS_open}>
      <Header
        title={t("header.listSettings")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={CLOSE_modal}
            style={{ borderRadius: 100 }}
          />
        }
      />
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
      >
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
              {z_myOneList?.name || "NO LIST NAME PROVIDED"}
            </Styled_TEXT>
            {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
          </View>
          <Btn text="Edit" onPress={() => modals.renameList.set(true)} />
        </Block>

        <ChosenListLangs_BLOCK
          OPEN_selectLanguagesModal={() => modals.selectLangs.set(true)}
        />

        <Block>
          <Label>{t("label.resetVocabDifficultiesInAList")}</Label>
          <Btn
            text={t("btn.resetAllVocabDifficultiesOfAList")}
            onPress={() => modals.resetDifficulties.set(true)}
            iconRight={<ICON_difficultyDot difficulty={3} />}
            text_STYLES={{ flex: 1 }}
          />
        </Block>
        {/* -------------------------------------------------------------------------------------------------- */}

        <Dropdown_BLOCK
          toggleBtn_TEXT={t("btn.dangerZone")}
          label={t("btn.dangerZone")}
        >
          <Btn
            type="delete"
            text={t("btn.deleteList")}
            onPress={() => modals.deleteList.set(true)}
          />
        </Dropdown_BLOCK>
        <View style={{ height: 100 }} />
      </ScrollView>
      <TwoBtn_BLOCK
        btnLeft={
          <Btn
            text={t("btn.done")}
            onPress={CLOSE_modal}
            type="simple"
            style={{ flex: 1 }}
          />
        }
      />

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectListLangs_MODAL
        open={modals.selectLangs.IS_open}
        CLOSE_modal={() => modals.selectLangs.set(false)}
      />

      <RenameList_MODAL
        IS_open={modals.renameList.IS_open}
        CLOSE_modal={() => modals.renameList.set(false)}
        HIGHLIGHT_listName={HIGHLIGHT_listName}
      />
      <ResetAllListVocabDifficulties_MODAL
        IS_open={modals.resetDifficulties.IS_open}
        CLOSE_modal={() => modals.resetDifficulties.set(false)}
        refetch={refetch}
      />

      <DeleteList_MODAL
        IS_open={modals.deleteList.IS_open}
        CLOSE_modal={() => modals.deleteList.set(false)}
      />
    </Big_MODAL>
  );
}

function SelectListLangs_MODAL({
  open = false,
  CLOSE_modal = () => {},
}: {
  open: boolean;
  CLOSE_modal: () => void;
}) {
  const { UPDATE_listDefaultLangIds, loading, error } =
    USE_updateListDefaultLangIds();

  const { z_myOneList } = z_USE_myOneList();

  const SUBMIT_langIds = useCallback(
    async (lang_ids: string[]) => {
      await UPDATE_listDefaultLangIds(z_myOneList?.id || "", lang_ids, {
        onSuccess: CLOSE_modal,
      });
    },
    [UPDATE_listDefaultLangIds, z_myOneList, CLOSE_modal]
  );

  return (
    <SelectMultipleLanguages_MODAL
      open={open}
      CLOSE_modal={() => {
        if (!loading) CLOSE_modal();
      }}
      initialLang_IDS={z_myOneList?.default_lang_ids || []}
      loading={loading}
      error={error}
      SUBMIT_langIds={SUBMIT_langIds}
    />
  );
}
