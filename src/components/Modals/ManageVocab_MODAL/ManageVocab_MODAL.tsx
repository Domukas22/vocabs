//
//
//

import Btn from "../../Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useState } from "react";
import { Modal, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectList_MODAL from "../SelectList_MODAL/SelectList_MODAL";

import { Language_MODEL, List_MODEL, Vocab_MODEL } from "@/src/db/models";

import { USE_toggle } from "@/src/hooks/USE_toggle";

import ManageVocab_FOOTER from "../../Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import VocabTranslation_INPUTS from "../../Block/Variations/VocabTranslation_INPUTS/VocabTranslation_INPUTS";
import TranslationText_MODAL from "../TranslationText_MODAL/TranslationText_MODAL";
import TranslationHighlights_MODAL from "../TranslationHighlights_MODAL/TranslationHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectLanguages_MODAL from "../SelectLanguages_MODAL/SelectLanguages_MODAL";
import USE_manageVocabForm from "./hooks/USE_manageVocabform";
import POPULATE_vocabModal from "./helpers/POPULATE_vocabModal";
import CLEAR_vocabModal from "./helpers/CLEAR_vocabModal";
import Difficulty_INPUTS from "./components/Difficulty_INPUTS";
import Image_INPUT from "./components/Image_INPUT";
import Description_INPUT from "./components/Description_INPUT";
import List_INPUT from "./components/List_INPUT";
import ChosenLangs_INPUTS from "./components/ChosenLangs_INPUTS";
import USE_modalToggles from "./hooks/USE_modalToggles";
import SELECT_languages from "./helpers/SELECT_languages";

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  toEdit_VOCAB: Vocab_MODEL | null;
  selected_LIST: List_MODEL;
}

export default function ManageVocab_MODAL(props: ManageVocabModal_PROPS) {
  const { open, TOGGLE_modal, toEdit_VOCAB, selected_LIST } = props;
  const [trInput_LANG, SET_trInputLang] = useState("");
  const { languages } = USE_langs();

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
  } = USE_manageVocabForm({
    vocab: toEdit_VOCAB,
    list: selected_LIST,
    TOGGLE_modal,
  });

  const {
    SHOW_selectListModal,
    SHOW_selectLangModal,
    SHOW_trTextModal,
    SHOW_trHighlightsModal,
    TOGGLE_selectListModal,
    TOGGLE_selectLangModal,
    TOGGLE_trTextModal,
    TOGGLE_trHighlightsModal,
  } = USE_modalToggles();

  function REMOVE_lang(lang_id: string) {
    const hasOnly2Translations = modal_TRs?.length === 2;
    if (hasOnly2Translations) return;
    SET_modalTRs((prev) => prev?.filter((tr) => tr.lang_id !== lang_id));
  }

  useEffect(() => {
    open
      ? POPULATE_vocabModal({
          vocab: toEdit_VOCAB,
          list: selected_LIST,
          set_FNs: {
            SET_modalList,
            SET_modalDiff,
            SET_modalImg,
            SET_modalDesc,
            SET_modalTRs,
          },
        })
      : CLEAR_vocabModal({
          SET_modalList,
          SET_modalDiff,
          SET_modalImg,
          SET_modalDesc,
          SET_modalTRs,
        });
  }, [open]);

  function HANLDE_languages(newLangSelection: Language_MODEL[]) {
    SELECT_languages({
      newLangSelection,
      modal_TRs,
      SET_modalTRs,
    });
  }

  return (
    <Modal animationType="slide" transparent={true} visible={open} style={{}}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,
          flex: 1,
        }}
      >
        <Header
          title={toEdit_VOCAB ? "Edit vocab" : "Create a new vocab"}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_modal}
              style={{ borderRadius: 100 }}
            />
          }
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
          <Difficulty_INPUTS {...{ modal_DIFF, SET_modalDiff }} />
          <ChosenLangs_INPUTS
            {...{ modal_TRs, languages, REMOVE_lang, TOGGLE_selectLangModal }}
          />

          <VocabTranslation_INPUTS
            {...{
              languages,
              modal_TRs,
              modal_DIFF,
              SET_trInputLang,
              TOGGLE_trTextModal,
              TOGGLE_trHighlightsModal,
            }}
          />
          <Image_INPUT {...{ modal_IMG, SET_modalImg }} />
          <Description_INPUT {...{ modal_DESC, SET_modalDesc }} />
          <List_INPUT
            list_NAME={modal_LIST?.name}
            TOGGLE_modal={TOGGLE_selectListModal}
          />

          {/* When creating, the buttons are visible when scrolled to the bottom */}
          {!toEdit_VOCAB && (
            <ManageVocab_FOOTER
              onCancelPress={TOGGLE_modal}
              onActionPress={CREATE_vocab}
              loading={IS_creatingVocab}
              btnText={"Create vocab"}
            />
          )}
        </KeyboardAwareScrollView>

        {/* When editing, the buttons are always*/}
        {toEdit_VOCAB && (
          <ManageVocab_FOOTER
            onCancelPress={TOGGLE_modal}
            loading={IS_updatingVocab}
            onActionPress={UPDATE_vocab}
            btnText={"Save vocab"}
          />
        )}

        <SelectLanguages_MODAL
          open={SHOW_selectLangModal}
          TOGGLE_modal={TOGGLE_selectLangModal}
          activeLangIDs={
            modal_TRs?.filter((t) => t.lang_id).map((t) => t.lang_id) || []
          }
          {...{ languages, HANLDE_languages }}
        />

        <SelectList_MODAL
          open={SHOW_selectListModal}
          TOGGLE_modal={TOGGLE_selectListModal}
          current_LIST={modal_LIST}
          SET_modalList={SET_modalList}
        />

        <TranslationText_MODAL
          text={
            modal_TRs?.find((tr) => tr.lang_id === trInput_LANG)?.text || ""
          }
          lang_id={trInput_LANG}
          IS_open={SHOW_trTextModal}
          TOGGLE_open={TOGGLE_trTextModal}
          modal_TRs={modal_TRs}
          SET_modalTRs={SET_modalTRs}
        />

        <TranslationHighlights_MODAL
          lang_id={trInput_LANG}
          open={SHOW_trHighlightsModal}
          TOGGLE_open={TOGGLE_trHighlightsModal}
          difficulty={modal_DIFF}
          languages={languages}
          modal_TRs={modal_TRs}
          SET_modalTRs={SET_modalTRs}
        />
      </SafeAreaView>
    </Modal>
  );
}
