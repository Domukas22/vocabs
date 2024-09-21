//
//
//

import Btn from "@/src/components/btn/btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import {
  ICON_calendar,
  ICON_difficultyDot,
  ICON_dropdownArrow,
  ICON_flag,
  ICON_image,
  ICON_shuffle,
  ICON_X,
} from "@/src/components/icons/icons";
import Block from "@/src/components/Block/Block";
import { Styled_TEXT } from "@/src/components/Styled_TEXT";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import { MyColors } from "@/src/constants/MyColors";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectList_MODAL from "../SelectList_MODAL/SelectList_MODAL";
import SelectLanguages_MODAL from "../SelectLanguages_MODAL/SelectLanguages_MODAL";
import languages, { languagesArr_PROPS } from "@/src/constants/languages";
import {
  List_MODEL,
  Translation_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import CREATE_vocab, {
  CreateVocab_PROPS,
} from "@/src/db/actions/vocabs/CREATE_vocab";
import GET_langs from "@/src/utils/GET_defaultLanguages/GET_defaultLanguages";
import { useToggle } from "@/src/hooks/useToggle/useToggle";
import { Lists_DB, Translations_DB } from "@/src/db";
import UPDATE_vocab, {
  UpdateVocab_PROPS,
} from "@/src/db/actions/vocabs/UPDATE_vocab";
import { Q } from "@nozbe/watermelondb";
import HighlightableTextInput from "../../TEST";
import Test2 from "../../TEST2";
import SimpleRichTextEditor from "../../TEST2";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import { preventAutoHideAsync } from "expo-splash-screen";
import { text } from "@nozbe/watermelondb/decorators";
import ManageVocab_FOOTER from "../../Footer/Variations/ManageVocab_FOOTER/ManageVocab_FOOTER";
import VocabTranslation_INPUTS from "../../Block/Variations/VocabTranslation_INPUTS/VocabTranslation_INPUTS";
import TranslationText_MODAL from "../TranslationText_MODAL/TranslationText_MODAL";
import TranslationHighlights_MODAL from "../TranslationHighlights_MODAL/TranslationHighlights_MODAL";

interface ManageVocabModal_PROPS {
  SHOW_modal: boolean;
  TOGGLE_modal: () => void;
  toEdit_VOCAB: Vocab_MODEL | null;
  toEdit_TRANSLATIONS: TranslationCreation_PROPS[] | null;
  selected_LIST: List_MODEL;
}

export default function ManageVocab_MODAL(props: ManageVocabModal_PROPS) {
  const {
    SHOW_modal,
    TOGGLE_modal,
    toEdit_VOCAB,
    toEdit_TRANSLATIONS,
    selected_LIST,
  } = props;

  const [vocab_ID, SET_VocabId] = useState<string | null>(null);
  const [list, SET_list] = useState<List_MODEL>(selected_LIST);
  const [difficulty, SET_difficulty] = useState<1 | 2 | 3>(3);
  const [image, SET_image] = useState("");
  const [description, SET_description] = useState("");
  const [translations, SET_translations] = useState<
    TranslationCreation_PROPS[] | null
  >(null);

  function update() {
    if (vocab_ID) {
      UPDATE_vocab({
        id: vocab_ID,
        list,
        difficulty,
        image,
        description,
        translations,
      });
    }
  }
  function create() {
    CREATE_vocab({
      list,
      difficulty,
      image,
      description,
      translations,
    });
  }

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
          .split(",")
          .filter(Boolean) // prevents [0] if the highlights string is empty
          .map((index) => Number(index))
          .filter((h) => h <= newText.length - 1) // delete highlights which don't fit into the text
          .join(",");
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

  // function ADD_REMOVE_lang(lang_id: string) {
  //   const alreadyHasLang = translations?.some((tr) => tr.lang_id === lang_id);

  //   if (!translations) return;

  //   const tooManyLangSelected = translations?.length >= 10;
  //   const hasOnly2Translations = translations?.length === 2;

  //   if (!alreadyHasLang) {
  //     if (tooManyLangSelected) return;

  //     // add new lang
  //     SET_translations((prev) => [
  //       ...prev,
  //       { vocab_id: "", lang_id, text: "" },
  //     ]);
  //   } else {
  //     if (hasOnly2Translations) return;
  //     SET_translations((prev) => prev.filter((tr) => tr.lang_id !== lang_id));
  //   }
  // }

  const [SHOW_selectListModal, TOGGLE_selectListModal] = useToggle(false);
  const [SHOW_selectLangModal, TOGGLE_selectLangModal] = useToggle(false);

  function CLEAR_form() {
    SET_VocabId(null);
    SET_list(selected_LIST);
    SET_difficulty(3);
    SET_image("");
    SET_description("");
  }

  function POPULATE_form() {
    SET_VocabId(toEdit_VOCAB ? toEdit_VOCAB.id : null);
    SET_list(selected_LIST);
    SET_difficulty(toEdit_VOCAB?.difficulty ? toEdit_VOCAB.difficulty : 3);
    SET_image(toEdit_VOCAB?.image ? toEdit_VOCAB.image : "");
    SET_description(toEdit_VOCAB?.description ? toEdit_VOCAB.description : "");
    SET_translations(
      toEdit_TRANSLATIONS
        ? toEdit_TRANSLATIONS
        : [
            { lang_id: "en", text: "", highlights: "" },
            { lang_id: "de", text: "", highlights: "" },
          ]
    );
  }

  useEffect(() => {
    SHOW_modal ? POPULATE_form() : CLEAR_form();
  }, [SHOW_modal]);

  function SELECT_list(list: List_MODEL) {
    SET_list(list);
  }

  const [trModalLangId, SET_trModalLangId] = useState("");
  const [SHOW_trTextModal, TOGGLE_trTextModal] = useToggle(false);
  const [SHOW_trHighlightsModal, TOGGLE_trHighlightsModal] = useToggle(false);
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={SHOW_modal}
      style={{}}
    >
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
          <VocabTranslation_INPUTS
            HANLDE_trTextModal={HANLDE_trTextModal}
            HANLDE_trhighlightsModal={HANLDE_trhighlightsModal}
            {...{ translations, EDIT_tr: EDIT_trText, difficulty }}
          />

          <Btn
            text="Edit language selection"
            onPress={TOGGLE_selectLangModal}
            type="seethrough_primary"
            style={{ flex: 1, marginHorizontal: 12, marginTop: 16 }}
          />

          <Block label="Choose difficulty level *" row={true}>
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
          </Block>
          <Block label="Select a list *">
            <Btn
              text={list?.name}
              iconRight={<ICON_dropdownArrow />}
              onPress={TOGGLE_selectListModal}
              type="simple"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
          </Block>
          <Block label="Take or upload an image (optional)" row={false}>
            {/* <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
                <Btn
                  text="Replace image"
                  onPress={() => {}}
                  type="simple"
                  style={{ flex: 1 }}
                />
                <Btn text="Remove" onPress={() => {}} type="delete" />
              </View> */}

            <Btn
              iconLeft={<ICON_image />}
              text="Tap to upload image"
              onPress={() => {}}
              type="seethrough"
              style={{
                flex: 1,
                height: 200,
                flexDirection: "column",
                gap: 8,
              }}
              text_STYLES={{
                color: MyColors.text_white_06,
                fontFamily: "Nunito-Light",
              }}
            />
          </Block>
          <Block label="Description (optional)">
            <StyledTextInput
              multiline={true}
              value={description || ""}
              SET_value={(value: string) => SET_description(value)}
              placeholder="Note down the place / movie / book so that you remember better..."
            />
          </Block>

          {!toEdit_VOCAB && (
            <ManageVocab_FOOTER
              IS_edit={false}
              reset={TOGGLE_modal}
              create={create}
              update={update}
              btnText="Create vocab"
            />
          )}
        </KeyboardAwareScrollView>
        {toEdit_VOCAB && (
          <ManageVocab_FOOTER
            IS_edit={true}
            reset={TOGGLE_modal}
            create={create}
            update={update}
            btnText="Save edits"
          />
        )}
        <SelectList_MODAL
          SHOW_modal={SHOW_selectListModal}
          TOGGLE_modal={TOGGLE_selectListModal}
          currentList_ID={selected_LIST?.id || ""}
          SELECT_list={SELECT_list}
        />
        {/* <SelectLanguages_MODAL
          {...{
            SHOW_selectLangModal,
            TOGGLE_selectLangModal,
            langIDs: managed_VOCAB?.translations?.map((tr) => tr.lang_id),
            ADD_REMOVE_lang,
          }}
        /> */}

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
              ?.highlights || ""
          }
          lang_id={trModalLangId}
          IS_open={SHOW_trHighlightsModal}
          TOGGLE_open={TOGGLE_trHighlightsModal}
          EDIT_trHighlights={EDIT_trHighlights}
          difficulty={difficulty}
        />
      </SafeAreaView>
    </Modal>
  );
}
