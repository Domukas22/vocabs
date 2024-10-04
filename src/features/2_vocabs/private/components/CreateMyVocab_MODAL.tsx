//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import {
  ICON_arrow,
  ICON_dropdownArrow,
  ICON_X,
} from "@/src/components/icons/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";

import TrInput_BLOCK from "../../components/Vocab_MODAL/components/TrInput_BLOCK/TrInput_BLOCK";

import TrHighlights_MODAL from "../../components/Vocab_MODAL/components/TrHighlights_MODAL/TrHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";

import USE_myVocabActions from "../../hooks/USE_myVocabActions";

import DifficultyInput_BLOCK from "../../components/Vocab_MODAL/components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";

import DescriptionInput_BLOCK from "../../components/Vocab_MODAL/components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";

import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Label from "@/src/components/Label/Label";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Footer from "@/src/components/Footer/Footer";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import USE_createVocab from "../../hooks/USE_createVocab";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { MyColors } from "@/src/constants/MyColors";
import My_TOAST from "@/src/components/My_TOAST/My_TOAST";
import USE_createMyVocabFormValues from "../hooks/create/USE_createMyVocabFormValues";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import GET_defaultTranslations from "@/src/utils/GET_defaultTranslations";

// TODO ==> We need separate create and update vocab modals
// perhaps even separate ones for private/public

interface CreateMyVocabModal_PROPS {
  IS_open: boolean;
  initial_LIST: List_MODEL | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export default function CreateMyVocab_MODAL(props: CreateMyVocabModal_PROPS) {
  const {
    IS_open,
    TOGGLE_modal: TOGGLE_vocabModal,
    initial_LIST,
    onSuccess = () => {},
  } = props;
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "selectedList", initialValue: false },
    { name: "trHighlights", initialValue: false },
  ]);

  const { modal_VALUES, modalSet_FNS } =
    USE_createMyVocabFormValues(initial_LIST);

  const [target_TR, SET_targetTr] = useState<
    TranslationCreation_PROPS | undefined
  >(undefined);

  const selected_LANGS = useMemo(
    () =>
      modal_VALUES?.trs.reduce((acc, tr) => {
        if (!acc.some((lang) => lang.id === tr.lang_id)) {
          const lang = languages?.find((l) => l.id === tr.lang_id);
          if (lang) acc.push(lang);
        }
        return acc;
      }, [] as Language_MODEL[]),
    [modal_VALUES.trs.length]
  );
  const EDIT_selectedLangs = (new_LANGS: Language_MODEL[]) => {
    // TODO ==> create error notifactions for too few or too many langs selected

    let new_TRS = [...modal_VALUES.trs];

    if (modal_VALUES?.trs.length > 1) {
      // filter out deleted ones
      new_TRS.filter((tr) =>
        new_LANGS.some((newLang) => newLang.id === tr.lang_id)
      );
    }

    if (modal_VALUES?.trs.length < 6) {
      // add new ones
      new_LANGS.forEach((lang) => {
        if (!new_TRS.some((tr) => tr.lang_id === lang.id)) {
          new_TRS.push({
            lang_id: lang.id,
            text: "",
            highlights: [],
          });
        }
      });
    }
    modalSet_FNS.SET_trs(new_TRS);
  };
  const REMOVE_lang = (lang_id: string) => {
    // TODO ==> create error notifactions for too few or too many langs selected
    if (modal_VALUES?.trs.length > 1) {
      modalSet_FNS.SET_trs((prev) =>
        prev.filter((tr) => tr.lang_id !== lang_id)
      );
    }
  };
  const HANDLE_trText = ({
    lang_id,
    text,
  }: {
    lang_id: string;
    text: string;
  }) => {
    modalSet_FNS.SET_trs((prev) =>
      prev.map((tr) => {
        if (tr.lang_id === lang_id) tr.text = text;
        return tr;
      })
    );
  };
  const SUBMIT_highlights = ({
    lang_id,
    highlights,
  }: {
    lang_id: string;
    highlights: number[];
  }) => {
    modalSet_FNS.SET_trs((prev) =>
      prev.map((tr) => {
        if (tr.lang_id === lang_id) tr.highlights = highlights;
        return tr;
      })
    );
  };
  const RESET_form = () => {
    modalSet_FNS.SET_trs(
      GET_defaultTranslations(initial_LIST?.default_LANGS) || []
    );
    modalSet_FNS.SET_desc("");
    modalSet_FNS.SET_list(initial_LIST);
    modalSet_FNS.SET_diff(3);
  };

  const { CREATE_vocab, IS_creatingVocab, error, RESET_error } =
    USE_createVocab();

  const create = async () => {
    const result = await CREATE_vocab({
      user,
      list_id: modal_VALUES.list?.id,
      difficulty: modal_VALUES.diff,
      description: modal_VALUES.desc,
      translations: modal_VALUES.trs,
      is_public: false,
      onSuccess: (new_VOCAB: Vocab_MODEL) => {
        onSuccess(new_VOCAB);
        RESET_form();
      },
    });

    if (!result.success) {
      console.log(result.msg); // Log internal message for debugging.
    }
  };

  return (
    <Big_MODAL {...{ open: IS_open }}>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Header
          title={t("modal.vocab.headerCreate")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={() => {
                TOGGLE_vocabModal();
                RESET_form();
                RESET_error();
              }}
              style={{ borderRadius: 100 }}
            />
          }
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          extraScrollHeight={0}
          enableResetScrollToCoords={false}
        >
          {/* ------------------------------ INPUTS ------------------------------  */}

          <ChosenLangs_BLOCK
            label={t("label.chosenLangs")}
            langs={selected_LANGS}
            toggle={() => TOGGLE_modal("selectedLangs")}
            {...{ REMOVE_lang }}
          />
          {modal_VALUES.trs?.map((tr) => (
            <TrInput_BLOCK
              key={`TrInputBlock/${tr.lang_id}`}
              diff={modal_VALUES.diff}
              {...{
                tr,
                HANDLE_trText,
                TOGGLE_modal,
                SET_targetTr,
              }}
            />
          ))}
          <DescriptionInput_BLOCK
            value={modal_VALUES.desc}
            SET_value={modalSet_FNS.SET_desc}
          />
          <DifficultyInput_BLOCK
            value={modal_VALUES.diff}
            SET_value={modalSet_FNS.SET_diff}
          />

          <Block>
            <Label>{t("label.chosenList")}</Label>
            <Btn
              text={modal_VALUES.list?.name || ""}
              iconRight={<ICON_dropdownArrow />}
              onPress={() => TOGGLE_modal("selectedList")}
              type="simple"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
          </Block>
        </KeyboardAwareScrollView>

        <Footer
          contentAbove={
            error && (
              <View
                style={{
                  paddingTop: 8,
                  paddingHorizontal: 12,
                  width: "100%",
                }}
              >
                <Styled_TEXT type="text_error">{error}</Styled_TEXT>
              </View>
            )
          }
          btnLeft={
            <Btn
              text={t("btn.cancel")}
              onPress={() => {
                TOGGLE_vocabModal();
                RESET_error();
                RESET_form();
              }}
              type="simple"
            />
          }
          btnRight={
            <Btn
              text={!IS_creatingVocab ? t("btn.createButtonAction") : ""}
              iconRight={
                IS_creatingVocab && <ActivityIndicator color={"black"} />
              }
              onPress={() => !IS_creatingVocab && create()}
              stayPressed={IS_creatingVocab}
              type="action"
              style={{ flex: 1 }}
            />
          }
        />

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectMultipleLanguages_MODAL
          open={modal_STATES.selectedLangs}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          active_LANGS={selected_LANGS}
          SUBMIT_langs={(langs: Language_MODEL[]) => {
            EDIT_selectedLangs(langs);
            TOGGLE_modal("selectedLangs");
          }}
        />

        <TrHighlights_MODAL
          open={modal_STATES.trHighlights}
          tr={target_TR}
          diff={modal_VALUES.diff}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          SET_trs={modalSet_FNS.SET_trs}
          {...{ SUBMIT_highlights }}
        />

        <SelectMyList_MODAL
          open={modal_STATES.selectedList}
          title="Saved vocab to list"
          submit_ACTION={(target_LIST: List_MODEL) => {
            modalSet_FNS.SET_list(target_LIST);
            TOGGLE_modal("selectedList");
          }}
          cancel_ACTION={() => {
            TOGGLE_modal("selectedList");
          }}
          IS_inAction={IS_creatingVocab}
          current_LIST={modal_VALUES.list}
        />
      </View>
    </Big_MODAL>
  );
}
