//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_dropdownArrow, ICON_X } from "@/src/components/icons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Language_MODEL, List_MODEL, Vocab_MODEL } from "@/src/db/models";

import TrInput_BLOCK from "./components/TrInput_BLOCK/TrInput_BLOCK";
import TrText_MODAL from "./components/TrText_MODAL/TrText_MODAL";
import TrHighlights_MODAL from "./components/TrHighlights_MODAL/TrHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";

import USE_myVocabActions from "../../hooks/USE_myVocabActions";

import DifficultyInput_BLOCK from "./components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";
import ImageInput_BLOCK from "./components/ImageInput_BLOCK/ImageInput_BLOCK";
import DescriptionInput_BLOCK from "./components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";

import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import HANLDE_modalLangsAndTrs from "@/src/utils/HANLDE_modalLangsAndTrs";
import POPULATE_vocabValues from "../Vocab/utils/POPULATE_vocabValues";
import REMOVE_modalLangAndTr from "@/src/utils/REMOVE_modalLangAndTr";
import USE_myVocabValues from "../../hooks/USE_myVocabValues";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Label from "@/src/components/Label/Label";

import CLEAR_vocabValues from "../Vocab/utils/CLEAR_vocabValues";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Footer from "@/src/components/Footer/Footer";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | undefined;
  selected_LIST: List_MODEL | null | undefined;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  HIGHLIGHT_vocab: (id: string) => void;
  is_public?: boolean;
}

export default function Vocab_MODAL(props: ManageVocabModal_PROPS) {
  const {
    open,
    TOGGLE_modal: TOGGLE_vocabModal,
    vocab,
    selected_LIST,
    SET_vocabs,
    HIGHLIGHT_vocab,
    is_public = false,
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
  } = USE_myVocabValues(selected_LIST);

  const {
    create,
    update,

    delete_V,
    IS_creatingVocab,
    IS_updatingVocab,

    IS_deletingVocab,
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
    SET_vocabs,
    HIGHLIGHT_vocab,
    is_public,
  });

  const POPULATE_modal = useCallback(() => {
    POPULATE_vocabValues({
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
    CLEAR_vocabValues({
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
    if (open) {
      POPULATE_modal();
    } else {
      CLEAR_modal();
      TOGGLE_modal("selectedLangs", false);
      TOGGLE_modal("selectedList", false);
      TOGGLE_modal("trText", false);
      TOGGLE_modal("trHighlights", false);
      TOGGLE_modal("delete", false);
    }
    // TODO ==> Close every other modal inside when this triggers
    // in irder to do that, we need to chagen teh TOGGLE_modal("xx"), to SET method in order to define false
  }, [open]);

  return (
    <Big_MODAL {...{ open }}>
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
              !IS_deletingVocab &&
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
        {!is_public && (
          <DifficultyInput_BLOCK {...{ modal_DIFF, SET_modalDiff }} />
        )}
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

        {!is_public && (
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
        )}
        {vocab && (
          <Dropdown_BLOCK toggleBtn_TEXT={t("btn.dangerZone")}>
            <Btn
              type="delete"
              text={t("btn.deleteVocab")}
              onPress={() => TOGGLE_modal("delete")}
            />
          </Dropdown_BLOCK>
        )}
        {/* -------------------------------------------------------------------------  */}
        {/* When creating, the buttons are visible when scrolled to the bottom */}
        {!vocab && (
          <Footer
            btnLeft={
              <Btn
                text={t("btn.cancel")}
                onPress={TOGGLE_vocabModal}
                type="simple"
              />
            }
            btnRight={
              <Btn
                text={!IS_creatingVocab ? t("btn.createButtonAction") : ""}
                iconRight={
                  IS_creatingVocab && <ActivityIndicator color={"black"} />
                }
                onPress={() => {
                  if (!IS_creatingVocab) create();
                }}
                stayPressed={IS_creatingVocab}
                type="action"
                style={{ flex: 1 }}
              />
            }
          />
        )}
      </KeyboardAwareScrollView>

      {/* When editing, the buttons are sticky at the bottom*/}
      {vocab && (
        <Footer
          btnLeft={
            <Btn
              text={t("btn.cancel")}
              onPress={TOGGLE_vocabModal}
              type="simple"
            />
          }
          btnRight={
            <Btn
              text={!IS_updatingVocab ? t("btn.updateButtonAction") : ""}
              iconRight={
                IS_updatingVocab && <ActivityIndicator color={"black"} />
              }
              onPress={() => {
                if (!IS_updatingVocab) update();
              }}
              stayPressed={IS_updatingVocab}
              type="action"
              style={{ flex: 1 }}
            />
          }
        />
      )}

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectMultipleLanguages_MODAL
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
        TOGGLE_highlightModal={() => TOGGLE_modal("trHighlights")}
        {...{ target_LANG, modal_TRs, SET_modalTRs }}
      />

      <TrHighlights_MODAL
        open={modal_STATES.trHighlights}
        TOGGLE_open={() => TOGGLE_modal("trHighlights")}
        {...{ target_LANG, modal_DIFF, modal_TRs, SET_modalTRs }}
      />

      <Confirmation_MODAL
        open={modal_STATES.delete && !!vocab}
        toggle={() => !IS_deletingVocab && TOGGLE_modal("delete")}
        title={t("modal.deleteVocabConfirmation.header")}
        action={delete_V}
        IS_inAction={IS_deletingVocab}
        actionBtnText={t("btn.confirmDelete")}
      />

      {!is_public && (
        <SelectMyList_MODAL
          open={modal_STATES.selectedList}
          title="Saved vocab to list"
          submit_ACTION={(target_LIST: List_MODEL) => {
            SET_modalList(target_LIST);
            TOGGLE_modal("selectedList");
          }}
          cancel_ACTION={() => {
            TOGGLE_modal("selectedList");
          }}
          IS_inAction={IS_creatingVocab}
          current_LIST={modal_LIST}
        />
      )}
    </Big_MODAL>
  );
}
