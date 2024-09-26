//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Modal, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectList_MODAL from "../SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";

import {
  Language_MODEL,
  List_MODEL,
  PublicVocab_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";

import ManageVocab_FOOTER from "@/src/components/Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import TrInput_BLOCK from "../../../../../../../components/Block/Variations/TrInput_BLOCK/TrInput_BLOCK";
import TrText_MODAL from "../../../../../../../components/Modals/Small_MODAL/Variations/TrText_MODAL/TrText_MODAL";
import TrHighlights_MODAL from "../../../../../../../components/Modals/Big_MODAL/Variations/TrHighlights_MODAL/TrHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectLanguages_MODAL from "../../../../../../../components/Modals/Big_MODAL/SelectLanguages_MODAL/SelectLanguages_MODAL";

import ImageInput_BLOCK from "../../../../../../../components/Block/Variations/ImageInput_BLOCK/ImageInput_BLOCK";
import DescriptionInput_BLOCK from "../../../../../../../components/Block/Variations/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../../../../components/Block/Variations/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";

import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "../../../../../../../hooks/USE_modalToggles";
import GET_activeLangIDs from "../../../../../../../utils/GET_activeLangIDs";
import HANLDE_modalLangsAndTrs from "../../../../../../../utils/HANLDE_modalLangsAndTrs";
import REMOVE_modalLangAndTr from "../../../../../../../utils/REMOVE_modalLangAndTr";
import USE_publicVocabValues from "@/src/hooks/USE_publicVocabValues";
import USE_publicVocabActions from "@/src/hooks/USE_publicVocabActions";
import POPULATE_publicVocabValues from "@/src/utils/POPULATE_publicVocabValues";
import CLEAR_publicVocabValues from "../../../../../../../utils/CLEAR_publicVocabValues";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";

interface PublicVocabVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  vocab: PublicVocab_MODEL | undefined;
}

export default function PublicVocab_MODAL(props: PublicVocabVocabModal_PROPS) {
  const { open, TOGGLE_modal: TOGGLE_vocabModal, vocab } = props;
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user } = USE_auth();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "trText", initialValue: false },
    { name: "trHighlights", initialValue: false },
    { name: "delete", initialValue: false },
  ]);

  const {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LANGS,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalLangs,
  } = USE_publicVocabValues();

  const {
    CREATE_vocab,
    UPDATE_vocab,
    DELETE_vocab,
    IS_creatingPublicVocab,
    IS_updatingPublicVocab,
    IS_deletingPublicVocab,
  } = USE_publicVocabActions({
    user,
    vocab,
    modalValues: {
      modal_TRs,
      modal_IMG,
      modal_DESC,
      modal_LANGS,
    },
    TOGGLE_vocabModal,
  });

  const POPULATE_modal = useCallback(() => {
    POPULATE_publicVocabValues({
      vocab,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalLangs,
      },
      languages,
    });
  }, [vocab]);

  const CLEAR_modal = useCallback(() => {
    CLEAR_publicVocabValues({
      languages,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalLangs,
      },
    });
  }, [vocab]);

  const HANLDE_langs = useCallback(
    (new_LANGS: Language_MODEL[]) =>
      HANLDE_modalLangsAndTrs({
        new_LANGS,
        modal_TRs,
        SET_modalLangs,
        SET_modalTRs,
      }),
    [modal_LANGS]
  );
  const REMOVE_lang = useCallback(
    (targetLang_ID: string) =>
      REMOVE_modalLangAndTr({
        targetLang_ID,
        modal_LANGS,
        SET_modalLangs,
        SET_modalTRs,
      }),
    [modal_LANGS]
  );

  const activeLangIDs = useMemo(
    () => GET_activeLangIDs(modal_TRs),
    [modal_TRs]
  );

  const [target_LANG, SET_targetLang] = useState<Language_MODEL | undefined>(
    undefined
  );

  useEffect(() => {
    open ? POPULATE_modal() : CLEAR_modal();
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
          title={
            vocab ? t("modal.vocab.headerEdit") : t("modal.vocab.headerCreate")
          }
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_vocabModal}
              style={{ borderRadius: 100 }}
            />
          }
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
          {/* ------------------------------ INPUTS ------------------------------  */}
          <ChosenLangs_BLOCK {...{ modal_LANGS, REMOVE_lang, TOGGLE_modal }} />

          <TrInput_BLOCK
            {...{
              languages,
              modal_TRs,
              modal_DIFF: 0,
              SET_targetLang,
              TOGGLE_modal,
            }}
          />

          <ImageInput_BLOCK {...{ modal_IMG, SET_modalImg }} />
          <DescriptionInput_BLOCK {...{ modal_DESC, SET_modalDesc }} />

          {vocab && (
            <Block>
              <Btn
                type="delete"
                text={t("btn.deleteVocab")}
                onPress={() => TOGGLE_modal("delete")}
              />
            </Block>
          )}
          {/* -------------------------------------------------------------------------  */}
          {/* When creating, the buttons are visible when scrolled to the bottom */}
          {!vocab && (
            <ManageVocab_FOOTER
              onCancelPress={TOGGLE_vocabModal}
              onActionPress={CREATE_vocab}
              actionBtnText={t("btn.createButtonAction")}
              loading={IS_creatingPublicVocab}
            />
          )}
        </KeyboardAwareScrollView>

        {/* When editing, the buttons are sticky at the bottom*/}
        {vocab && (
          <ManageVocab_FOOTER
            onCancelPress={TOGGLE_vocabModal}
            loading={IS_updatingPublicVocab}
            actionBtnText={t("btn.updateButtonAction")}
            onActionPress={UPDATE_vocab}
          />
        )}

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectLanguages_MODAL
          open={modal_STATES.selectedLangs}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          {...{ activeLangIDs, languages, HANLDE_langs }}
        />

        <TrText_MODAL
          open={modal_STATES.trText}
          TOGGLE_open={() => TOGGLE_modal("trText")}
          {...{ target_LANG, modal_TRs, SET_modalTRs }}
        />

        <TrHighlights_MODAL
          open={modal_STATES.trHighlights}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          {...{ target_LANG, modal_DIFF: 0, modal_TRs, SET_modalTRs }}
        />

        {/* ----- DELETE confirmation ----- */}
        <Confirmation_MODAL
          open={modal_STATES.delete && !!vocab}
          toggle={() => !IS_deletingPublicVocab && TOGGLE_modal("delete")}
          title={t("modal.deleteVocabConfirmation.header")}
          action={DELETE_vocab}
          IS_inAction={IS_deletingPublicVocab}
          actionBtnText={t("btn.confirmDelete")}
        />
      </SafeAreaView>
    </Modal>
  );
}
