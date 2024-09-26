//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_dropdownArrow, ICON_X } from "@/src/components/icons/icons";
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
import SelectList_MODAL from "../../../Public_VOCAB/components/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";

import { Language_MODEL, List_MODEL, Vocab_MODEL } from "@/src/db/models";

import ManageVocab_FOOTER from "@/src/components/Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import TrInput_BLOCK from "../../../../../../../components/Block/Variations/TrInput_BLOCK/TrInput_BLOCK";
import TrText_MODAL from "../../../../../../../components/Modals/Small_MODAL/Variations/TrText_MODAL/TrText_MODAL";
import TrHighlights_MODAL from "../../../components/TrHighlights_MODAL/TrHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectLanguages_MODAL from "../../../../../../../components/Modals/Big_MODAL/SelectLanguages_MODAL/SelectLanguages_MODAL";

import USE_myVocabActions from "../../hooks/USE_myVocabActions";

import DifficultyInput_BLOCK from "../../../../../../../components/Block/Variations/DifficultyInput_BLOCK/DifficultyInput_BLOCK";
import ImageInput_BLOCK from "../../../../../../../components/Block/Variations/ImageInput_BLOCK/ImageInput_BLOCK";
import DescriptionInput_BLOCK from "../../../../../../../components/Block/Variations/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../../../../components/Block/Variations/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";

import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "../../../../../../../hooks/USE_modalToggles";
import CLEAR_privateVocabValues from "../../../../../../../utils/CLEAR_privateVocabValues";
import GET_activeLangIDs from "../../../../../../../utils/GET_activeLangIDs";
import HANLDE_modalLangsAndTrs from "../../../../../../../utils/HANLDE_modalLangsAndTrs";
import POPULATE_privateVocabValues from "../../../../../../../utils/POPULATE_privateVocabValues";
import REMOVE_modalLangAndTr from "../../../../../../../utils/REMOVE_modalLangAndTr";
import USE_privateVocabValues from "../../../../../../../hooks/USE_privateVocabValues";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Label from "@/src/components/Label/Label";
import i18next from "i18next";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | undefined;
  selected_LIST: List_MODEL;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  HIGHLIGHT_vocab: (id: string) => void;
}

export default function MyVocab_MODAL(props: ManageVocabModal_PROPS) {
  const {
    open,
    TOGGLE_modal: TOGGLE_vocabModal,
    vocab,
    selected_LIST,
    SET_vocabs,
    HIGHLIGHT_vocab,
  } = props;
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user } = USE_auth();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "selectedList", initialValue: false },
    { name: "trText", initialValue: false },
    { name: "trHighlights", initialValue: false },
    { name: "delete", initialValue: false },
  ]);

  const {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LIST,
    modal_DIFF,
    modal_LANGS,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  } = USE_privateVocabValues(selected_LIST);

  const {
    CREATE_vocab,
    UPDATE_vocab,
    UPDATE_privateVocabDifficulty,
    DELETE_vocab,
    IS_creatingVocab,
    IS_updatingVocab,
    IS_updatingVocabDifficulty,
    IS_deleting,
  } = USE_myVocabActions({
    user,
    vocab,
    modalValues: {
      modal_TRs,
      modal_IMG,
      modal_DESC,
      modal_LIST,
      modal_DIFF,
      modal_LANGS,
    },
    TOGGLE_vocabModal,
    TOGGLE_modal,
    SET_vocabs,
    HIGHLIGHT_vocab,
  });

  const POPULATE_modal = useCallback(() => {
    POPULATE_privateVocabValues({
      vocab,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalList,
        SET_modalDiff,
        SET_modalLangs,
      },
      languages,
      selected_LIST,
    });
  }, [vocab, selected_LIST]);
  const CLEAR_modal = useCallback(() => {
    CLEAR_privateVocabValues({
      languages,
      selected_LIST,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalList,
        SET_modalDiff,
        SET_modalLangs,
      },
    });
  }, [vocab, selected_LIST]);

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
              onPress={() =>
                !IS_creatingVocab &&
                !IS_updatingVocab &&
                !IS_deleting &&
                TOGGLE_vocabModal()
              }
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
          <DifficultyInput_BLOCK {...{ modal_DIFF, SET_modalDiff }} />
          <ChosenLangs_BLOCK
            label={t("label.chosenLangs")}
            langs={modal_LANGS}
            toggle={() => TOGGLE_modal("selectedLangs")}
            {...{ REMOVE_lang }}
          />

          {modal_TRs?.map((tr) => (
            <TrInput_BLOCK
              key={`TrInputBlock/${tr.lang_id}`}
              {...{
                languages,
                tr,
                modal_DIFF,
                SET_targetLang,
                TOGGLE_modal,
              }}
            />
          ))}

          <ImageInput_BLOCK {...{ modal_IMG, SET_modalImg }} />
          <DescriptionInput_BLOCK {...{ modal_DESC, SET_modalDesc }} />

          <Block>
            <Label>{t("label.chosenList")}</Label>
            <Btn
              text={modal_LIST?.name || ""}
              iconRight={<ICON_dropdownArrow />}
              onPress={() => TOGGLE_modal("selectedList")}
              type="simple"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
          </Block>
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
              onCancelPress={() =>
                !IS_creatingVocab &&
                !IS_updatingVocab &&
                !IS_deleting &&
                TOGGLE_vocabModal()
              }
              onActionPress={CREATE_vocab}
              actionBtnText={t("btn.createButtonAction")}
              loading={IS_creatingVocab}
            />
          )}
        </KeyboardAwareScrollView>

        {/* When editing, the buttons are sticky at the bottom*/}
        {vocab && (
          <ManageVocab_FOOTER
            onCancelPress={() =>
              !IS_creatingVocab &&
              !IS_updatingVocab &&
              !IS_deleting &&
              TOGGLE_vocabModal()
            }
            loading={IS_updatingVocab}
            actionBtnText={t("btn.updateButtonAction")}
            onActionPress={UPDATE_vocab}
          />
        )}

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectLanguages_MODAL
          open={modal_STATES.selectedLangs}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          active_LANGS={modal_LANGS}
          SUBMIT_langs={(langs: Language_MODEL[]) => {
            HANLDE_langs(langs);
            TOGGLE_modal("selectedLangs");
          }}
          {...{ languages, HANLDE_langs }}
        />

        <TrText_MODAL
          open={modal_STATES.trText}
          TOGGLE_open={() => TOGGLE_modal("trText")}
          {...{ target_LANG, modal_TRs, SET_modalTRs }}
        />

        <TrHighlights_MODAL
          open={modal_STATES.trHighlights}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          {...{ target_LANG, modal_DIFF, modal_TRs, SET_modalTRs }}
        />

        {/* ----- DELETE confirmation ----- */}
        <Confirmation_MODAL
          open={modal_STATES.delete && !!vocab}
          toggle={() => !IS_deleting && TOGGLE_modal("delete")}
          title={t("modal.deleteVocabConfirmation.header")}
          action={DELETE_vocab}
          IS_inAction={IS_deleting}
          actionBtnText={t("btn.confirmDelete")}
        />
        <SelectList_MODAL
          open={modal_STATES.selectedList}
          TOGGLE_open={() => TOGGLE_modal("selectedList")}
          current_LIST={modal_LIST}
          SET_modalList={SET_modalList}
        />
      </SafeAreaView>
    </Modal>
  );
}
