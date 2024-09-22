//
//
//

import Btn from "../../Btn/Btn";

import Header from "@/src/components/Header/Header";
import {
  ICON_dropdownArrow,
  ICON_flag,
  ICON_image,
  ICON_X,
} from "@/src/components/icons/icons";
import Block from "@/src/components/Block/Block";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useState } from "react";
import { Modal, SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectList_MODAL from "../SelectList_MODAL/SelectList_MODAL";

import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";

import CREATE_vocab from "@/src/db/vocabs/CREATE_vocab";

import { USE_toggle } from "@/src/hooks/USE_toggle";

import ManageVocab_FOOTER from "../../Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import VocabTranslation_INPUTS from "../../Block/Variations/VocabTranslation_INPUTS/VocabTranslation_INPUTS";
import TranslationText_MODAL from "../TranslationText_MODAL/TranslationText_MODAL";
import TranslationHighlights_MODAL from "../TranslationHighlights_MODAL/TranslationHighlights_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_createVocab from "@/src/db/vocabs/CREATE_vocab";
import Label from "../../Label/Label";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectLanguages_MODAL from "../SelectLanguages_MODAL/SelectLanguages_MODAL";
import USE_updateVocab from "@/src/db/vocabs/UPDATE_vocab";

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  toEdit_VOCAB: Vocab_MODEL | null;
  toEdit_TRANSLATIONS: TranslationCreation_PROPS[] | null;
  selected_LIST: List_MODEL;
}

export default function ManageVocab_MODAL(props: ManageVocabModal_PROPS) {
  const {
    open,
    TOGGLE_modal,
    toEdit_VOCAB,
    toEdit_TRANSLATIONS,
    selected_LIST,
  } = props;

  const [vocab_ID, SET_VocabId] = useState<string | null>(null);
  const [modal_LIST, SET_list] = useState<List_MODEL>(selected_LIST);
  const [difficulty, SET_difficulty] = useState<1 | 2 | 3>(3);
  const [image, SET_image] = useState("");
  const [description, SET_description] = useState("");
  const [translations, SET_translations] = useState<
    TranslationCreation_PROPS[] | null
  >(null);

  const { user } = USE_auth();
  const { CREATE_newVocab, IS_creatingVocab } = USE_createVocab();
  const { UPDATE_existingVocab, IS_updatingVocab } = USE_updateVocab();

  async function update() {
    if (!IS_updatingVocab) {
      await UPDATE_existingVocab({
        vocab_id: vocab_ID,
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty,
        image,
        description,
        translations,
        toggleFn: TOGGLE_modal,
      });
    }
  }
  async function create() {
    if (!IS_creatingVocab) {
      await CREATE_newVocab({
        user_id: user.id,
        list_id: modal_LIST.id,
        difficulty,
        image,
        description,
        translations,
        toggleFn: TOGGLE_modal,
      });
    }
  }
  // list_id, user_id, difficulty, description, image
  function EDIT_trText({
    lang_id,
    newText,
  }: {
    lang_id: string;
    newText: string;
  }) {
    if (!translations) return;
    const newTRs = translations.map((tr) => {
      if (tr.lang_id === lang_id) {
        tr.text = newText;

        const adjustedHighlights = tr.highlights

          .map((index) => Number(index))
          .filter((h) => h <= newText.length - 1); // delete highlights which don't fit into the text

        tr.highlights = adjustedHighlights;
      }

      return tr;
    });
    SET_translations(newTRs);
  }
  function EDIT_trHighlights({
    lang_id,
    newHighlights,
  }: {
    lang_id: string;
    newHighlights: string;
  }) {
    if (!translations) return;
    const newTRs = translations.map((tr) => {
      if (tr.lang_id === lang_id) tr.highlights = newHighlights;
      return tr;
    });
    SET_translations(newTRs);
  }

  function REMOVE_lang(lang_id: string) {
    const hasOnly2Translations = translations?.length === 2;
    if (hasOnly2Translations) return;
    SET_translations((prev) => prev?.filter((tr) => tr.lang_id !== lang_id));
  }

  const [SHOW_selectListModal, TOGGLE_selectListModal] = USE_toggle(false);
  const [SHOW_selectLangModal, TOGGLE_selectLangModal] = USE_toggle(false);

  function CLEAR_form() {
    SET_VocabId(null);
    SET_list(selected_LIST);
    SET_difficulty(3);
    SET_image("");
    SET_description("");
  }

  async function POPULATE_form() {
    SET_VocabId(toEdit_VOCAB ? toEdit_VOCAB.id : null);
    SET_list(selected_LIST);
    SET_difficulty(toEdit_VOCAB?.difficulty ? toEdit_VOCAB.difficulty : 3);
    SET_image(toEdit_VOCAB?.image ? toEdit_VOCAB.image : "");
    SET_description(toEdit_VOCAB?.description ? toEdit_VOCAB.description : "");
    SET_translations(
      toEdit_TRANSLATIONS
        ? toEdit_TRANSLATIONS
        : [
            { lang_id: "en", text: "", highlights: [] },
            { lang_id: "de", text: "", highlights: [] },
          ]
    );
  }

  useEffect(() => {
    open ? POPULATE_form() : CLEAR_form();
  }, [open]);

  function SELECT_list(list: List_MODEL) {
    SET_list(list);
  }

  const [trModalLangId, SET_trModalLangId] = useState("");
  const [SHOW_trTextModal, TOGGLE_trTextModal] = USE_toggle(false);
  const [SHOW_trHighlightsModal, TOGGLE_trHighlightsModal] = USE_toggle(false);
  function HANLDE_trTextModal({
    open,
    lang_id,
  }: {
    open: boolean;
    lang_id: string;
  }) {
    SET_trModalLangId(open ? lang_id : "");
    TOGGLE_trTextModal();
  }
  function HANLDE_trhighlightsModal({
    open,
    lang_id,
  }: {
    open: boolean;
    lang_id: string;
  }) {
    SET_trModalLangId(open ? lang_id : "");
    TOGGLE_trHighlightsModal();
  }

  const { languages, ARE_languagesLoading, languages_ERROR } = USE_langs();

  function HANLDE_languages(newLangSelection: Language_MODEL[]) {
    // if a tr doesn't have a lang included in the newSelection, delete it
    let newTranslations = translations?.filter((tr) =>
      newLangSelection.some((lang) => lang.id === tr.lang_id)
    );

    // add missing languages to the translations
    newLangSelection.forEach((lang) => {
      if (!newTranslations?.some((tr) => tr.lang_id === lang.id)) {
        newTranslations?.push({ lang_id: lang.id, text: "", highlights: [] });
      }
    });

    SET_translations(newTranslations);
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
          <Block>
            <Label>Vocab difficulty</Label>
            <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
              <Btn
                text="Easy"
                onPress={() => {
                  SET_difficulty(1);
                }}
                type={difficulty === 1 ? "difficulty_1_active" : "simple"}
                style={{ flex: 1 }}
                text_STYLES={{ textAlign: "center" }}
              />
              <Btn
                text="Medium"
                onPress={() => {
                  SET_difficulty(2);
                }}
                type={difficulty === 2 ? "difficulty_2_active" : "simple"}
                style={{ flex: 1 }}
                text_STYLES={{ textAlign: "center" }}
              />
              <Btn
                text="Hard"
                onPress={() => {
                  SET_difficulty(3);
                }}
                type={difficulty === 3 ? "difficulty_3_active" : "simple"}
                style={{ flex: 1 }}
                text_STYLES={{ textAlign: "center" }}
              />
            </View>
          </Block>
          <Block>
            <Label>Chosen languages</Label>
            {translations &&
              translations.map((tr) => {
                const lang: Language_MODEL = languages.find(
                  (l) => l.id === tr.lang_id
                );
                return (
                  <Btn
                    key={"chosen lang" + tr.text + tr.lang_id}
                    type="active"
                    iconLeft={
                      <View style={{ marginRight: 4 }}>
                        <ICON_flag lang={lang?.id} big={true} />
                      </View>
                    }
                    text={lang?.lang_in_en}
                    iconRight={
                      <ICON_X rotate={true} color="primary" big={true} />
                    }
                    text_STYLES={{ flex: 1 }}
                    onPress={() => REMOVE_lang(lang.id)}
                  />
                );
              })}
            <Btn
              iconLeft={<ICON_X color="primary" />}
              text="Select languages"
              type="seethrough_primary"
              onPress={TOGGLE_selectLangModal}
            />
          </Block>

          <VocabTranslation_INPUTS
            HANLDE_trTextModal={HANLDE_trTextModal}
            HANLDE_trhighlightsModal={HANLDE_trhighlightsModal}
            {...{ languages, translations, EDIT_tr: EDIT_trText, difficulty }}
          />

          {/* <Btn
            text="Edit language selection"
            onPress={TOGGLE_selectLangModal}
            type="seethrough_primary"
            style={{ flex: 1, marginHorizontal: 12, marginTop: 16 }}
          /> */}

          <Block row={false}>
            <Label>Image (optional)</Label>

            <Btn
              iconLeft={<ICON_image />}
              text="Tap to upload image"
              onPress={() => {}}
              type="seethrough"
              style={{
                flex: 1,
                height: 140,
                flexDirection: "column",
                gap: 8,
              }}
              text_STYLES={{
                color: MyColors.text_white_06,
                fontFamily: "Nunito-Light",
              }}
            />
          </Block>
          <Block>
            <Label>Description (optional)</Label>
            <StyledTextInput
              multiline={true}
              value={description || ""}
              SET_value={(value: string) => SET_description(value)}
              placeholder="Note down the place / movie / book so that you remember better..."
            />
          </Block>

          <Block>
            <Label>Vocab list</Label>
            <Btn
              text={modal_LIST?.name}
              iconRight={<ICON_dropdownArrow />}
              onPress={TOGGLE_selectListModal}
              type="simple"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
          </Block>

          {!toEdit_VOCAB && (
            <ManageVocab_FOOTER
              onCancelPress={TOGGLE_modal}
              onActionPress={create}
              loading={IS_creatingVocab}
              // loading={true}
              btnText={"Create vocab"}
            />
          )}
        </KeyboardAwareScrollView>
        {toEdit_VOCAB && (
          <ManageVocab_FOOTER
            onCancelPress={TOGGLE_modal}
            loading={IS_updatingVocab}
            onActionPress={update}
            btnText={"Save vocab"}
          />
        )}
        <SelectList_MODAL
          open={SHOW_selectListModal}
          TOGGLE_modal={TOGGLE_selectListModal}
          current_LIST={modal_LIST}
          SELECT_list={SELECT_list}
        />
        <SelectLanguages_MODAL
          open={SHOW_selectLangModal}
          TOGGLE_modal={TOGGLE_selectLangModal}
          activeLangIDs={
            translations?.filter((t) => t.lang_id).map((t) => t.lang_id) || []
          }
          HANLDE_languages={HANLDE_languages}
          languages={languages}
        />

        <TranslationText_MODAL
          text={
            translations?.find((tr) => tr.lang_id === trModalLangId)?.text || ""
          }
          lang_id={trModalLangId}
          IS_open={SHOW_trTextModal}
          TOGGLE_open={TOGGLE_trTextModal}
          EDIT_tr={EDIT_trText}
        />

        <TranslationHighlights_MODAL
          text={
            translations?.find((tr) => tr.lang_id === trModalLangId)?.text || ""
          }
          highlights={
            translations?.find((tr) => tr.lang_id === trModalLangId)
              ?.highlights || []
          }
          lang_id={trModalLangId}
          IS_open={SHOW_trHighlightsModal}
          TOGGLE_open={TOGGLE_trHighlightsModal}
          EDIT_trHighlights={EDIT_trHighlights}
          difficulty={difficulty}
          languages={languages}
        />
      </SafeAreaView>
    </Modal>
  );
}
