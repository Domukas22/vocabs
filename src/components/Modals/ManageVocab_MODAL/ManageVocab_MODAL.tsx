//
//
//

import Btn from "../../Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectList_MODAL from "./components/modals/SelectList_MODAL/SelectList_MODAL";

import { Language_MODEL, List_MODEL, Vocab_MODEL } from "@/src/db/models";

import ManageVocab_FOOTER from "../../Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import VocabTranslation_INPUTS from "./components/inputs/VocabTranslation_INPUTS/VocabTranslation_INPUTS";
import TrText_MODAL from "./components/modals/TranslationText_MODAL/TranslationText_MODAL";
import TrHighlights_MODAL from "./components/modals/TranslationHighlights_MODAL/TranslationHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectLanguages_MODAL from "./components/modals/SelectLanguages_MODAL/SelectLanguages_MODAL";
import USE_manageVocabModal from "./hooks/USE_manageVocabModal";
import POPULATE_vocabModal from "./helpers/POPULATE_vocabModal";
import CLEAR_vocabModal from "./helpers/CLEAR_vocabModal";
import Difficulty_INPUTS from "./components/inputs/Difficulty_INPUTS";
import Image_INPUT from "./components/inputs/Image_INPUT";
import Description_INPUT from "./components/inputs/Description_INPUT";
import List_INPUT from "./components/inputs/List_INPUT";
import ChosenLangs_INPUTS from "./components/inputs/ChosenLangs_INPUTS";
import USE_modalToggles from "./hooks/USE_modalToggles";
import GET_handledLangs from "./helpers/SELECT_languages";
import GET_defaultTranslations from "./helpers/GET_defaultTranslations";

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | undefined;
  selected_LIST: List_MODEL;
}

export default function ManageVocab_MODAL(props: ManageVocabModal_PROPS) {
  const { open, TOGGLE_modal: TOGGLE_vocabModal, vocab, selected_LIST } = props;
  const { languages } = USE_langs();
  const { modal_STATES, TOGGLE_modal } = USE_modalToggles();

  const {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LIST,
    modal_DIFF,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    CREATE_vocab,
    UPDATE_vocab,
    IS_creatingVocab,
    IS_updatingVocab,
    CLEAR_modal,
    POPULATE_modal,
    REMOVE_lang,
    HANLDE_languages,
    activeLangIDs,
    target_LANG,
    SET_targetLang,
  } = USE_manageVocabModal({
    vocab: vocab,
    list: selected_LIST,
    TOGGLE_modal: TOGGLE_vocabModal,
  });

  useEffect(() => {
    open ? POPULATE_modal({ vocab, list: selected_LIST }) : CLEAR_modal();
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
          title={vocab ? "Edit vocab" : "Create a new vocab"}
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
          <Difficulty_INPUTS {...{ modal_DIFF, SET_modalDiff }} />
          <ChosenLangs_INPUTS
            {...{ modal_TRs, languages, REMOVE_lang, TOGGLE_modal }}
          />

          <VocabTranslation_INPUTS
            {...{
              languages,
              modal_TRs,
              modal_DIFF,
              SET_targetLang,
              TOGGLE_modal,
            }}
          />
          <Image_INPUT {...{ modal_IMG, SET_modalImg }} />
          <Description_INPUT {...{ modal_DESC, SET_modalDesc }} />
          <List_INPUT
            list_NAME={modal_LIST?.name}
            TOGGLE_modal={TOGGLE_modal}
          />
          {/* -------------------------------------------------------------------------  */}
          {/* When creating, the buttons are visible when scrolled to the bottom */}
          {!vocab && (
            <ManageVocab_FOOTER
              onCancelPress={TOGGLE_vocabModal}
              onActionPress={CREATE_vocab}
              loading={IS_creatingVocab}
              btnText={"Create vocab"}
            />
          )}
        </KeyboardAwareScrollView>

        {/* When editing, the buttons are sticky at the bottom*/}
        {vocab && (
          <ManageVocab_FOOTER
            onCancelPress={TOGGLE_vocabModal}
            loading={IS_updatingVocab}
            onActionPress={UPDATE_vocab}
            btnText={"Save vocab"}
          />
        )}

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectLanguages_MODAL
          open={modal_STATES.SHOW_selectLangModal}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          {...{ activeLangIDs, languages, HANLDE_languages }}
        />

        <SelectList_MODAL
          open={modal_STATES.SHOW_selectListModal}
          TOGGLE_open={() => TOGGLE_modal("selectedList")}
          current_LIST={modal_LIST}
          SET_modalList={SET_modalList}
        />

        <TrText_MODAL
          open={modal_STATES.SHOW_trTextModal}
          TOGGLE_open={() => TOGGLE_modal("trText")}
          {...{ target_LANG, modal_TRs, SET_modalTRs }}
        />

        <TrHighlights_MODAL
          open={modal_STATES.SHOW_trHighlightsModal}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          {...{ target_LANG, modal_DIFF, modal_TRs, SET_modalTRs }}
        />
      </SafeAreaView>
    </Modal>
  );
}
