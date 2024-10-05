//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import {
  ICON_dropdownArrow,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";

import TrInput_BLOCK from "../../../components/Vocab_MODAL/components/TrInput_BLOCK/TrInput_BLOCK";
import TrHighlights_MODAL from "../../../components/Vocab_MODAL/components/TrHighlights_MODAL/TrHighlights_MODAL";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";
import DifficultyInput_BLOCK from "../../../components/Vocab_MODAL/components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";
import DescriptionInput_BLOCK from "../../../components/Vocab_MODAL/components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../../components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";
import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import Label from "@/src/components/Label/Label";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Footer from "@/src/components/Footer/Footer";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createVocab from "../../../hooks/USE_createVocab";
import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

import GET_defaultTranslations from "@/src/utils/GET_defaultTranslations";
import { Controller, useForm } from "react-hook-form";
import HANLDE_selectedLangs from "../../../shared/utils/HANLDE_selectedLangs";
import HANLDE_selectedHighlights from "../../../shared/utils/HANDLE_selectedTrs";
import HANDLE_langRemoval from "../../../shared/utils/HANLDE_langRemoval";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TRANSLATION_LENGTH,
} from "@/src/constants/globalVars";
import ChosenLangs_CONTROLLER from "./components/ChosenLangs_CONTROLLER/ChosenLangs_CONTROLLER";
import TrInput_CONTROLLER from "./components/TrInput_CONTROLLER/TrInput_CONTROLLER";
import Description_CONTROLER from "./components/Description_CONTROLER/Description_CONTROLER";
import Difficulty_CONTROLLER from "./components/Difficulty_CONTROLLER/Difficulty_CONTROLLER";
import List_CONTROLLER from "./components/List_CONTROLLER/List_CONTROLLER";
import CreateMyVocab_FOOTER from "./components/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";

import GET_langsFromTranslations from "@/src/utils/GET_langsFromTranslations";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import TinyLang_SCROLLER from "../../../shared/components/TinyLang_SCROLLER";

interface CreateMyVocabModal_PROPS {
  IS_open: boolean;
  initial_LIST: List_MODEL | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type CreateMyVocabData_PROPS = {
  list: List_MODEL | undefined;
  difficulty: 1 | 2 | 3;
  description: string;
  translations: TranslationCreation_PROPS[];
};

export default function CreateMyVocab_MODAL(props: CreateMyVocabModal_PROPS) {
  const {
    IS_open,
    TOGGLE_modal: TOGGLE_vocabModal,
    initial_LIST,
    onSuccess = () => {},
  } = props;

  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();
  const { languages } = USE_langs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "selectedList", initialValue: false },
    { name: "trHighlights", initialValue: false },
  ]);

  const [target_TR, SET_targetTr] = useState<
    TranslationCreation_PROPS | undefined
  >(undefined);

  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();

  const create = async (data: CreateMyVocabData_PROPS) => {
    const { list, description, difficulty, translations } = data;
    const result = await CREATE_vocab({
      user,
      list_id: list?.id,
      difficulty,
      description,
      translations,
      is_public: false,
      onSuccess: (new_VOCAB: Vocab_MODEL) => {
        onSuccess(new_VOCAB);
        reset();
      },
    });

    if (!result.success) {
      console.error(result.msg);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    trigger,
    formState: { errors },
    watch,
  } = useForm<CreateMyVocabData_PROPS>({
    defaultValues: {
      translations: GET_defaultTranslations(initial_LIST?.default_LANGS) || [],
      description: "",
      list: initial_LIST,
      difficulty: 3,
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const form_TRS = getValues("translations") || [];
  const submit = (data: CreateMyVocabData_PROPS) => create(data);
  const formValues = watch();

  useEffect(() => {
    RESET_dbError();
  }, [formValues]);

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
                reset();
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

          <ChosenLangs_CONTROLLER
            {...{ control, trigger }}
            TOGGLE_langModal={() => TOGGLE_modal("selectedLangs")}
          />

          {form_TRS.map((tr, index) => (
            <TrInput_CONTROLLER
              {...{ tr, index, control }}
              diff={getValues("difficulty")}
              OPEN_highlights={() => {
                SET_targetTr(tr);
                TOGGLE_modal("trHighlights");
              }}
              key={tr.lang_id + "InputsBlock"}
            />
          ))}

          <Description_CONTROLER {...{ control }} />
          <Difficulty_CONTROLLER {...{ control }} />
          <List_CONTROLLER
            {...{ control }}
            TOGGLE_listModal={() => TOGGLE_modal("selectedList")}
          />
        </KeyboardAwareScrollView>
        <CreateMyVocab_FOOTER
          {...{ IS_creatingVocab, db_ERROR }}
          submit={handleSubmit(submit)}
          CANCEL_creation={() => {
            TOGGLE_vocabModal();
            reset();
          }}
        />

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectMultipleLanguages_MODAL
          open={modal_STATES.selectedLangs}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          trs={form_TRS}
          SUBMIT_langs={(new_LANGS: Language_MODEL[]) =>
            // adds/deletes current translations based on new languages provided
            HANLDE_selectedLangs({
              new_LANGS,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: TranslationCreation_PROPS[]) => {
                setValue("translations", updated_TRS);

                if (updated_TRS.length) {
                  clearErrors("translations");
                }
              },
            })
          }
        />

        <TrHighlights_MODAL
          open={modal_STATES.trHighlights}
          tr={target_TR}
          diff={getValues("difficulty")}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          SET_trs={(trs: TranslationCreation_PROPS[]) => {
            setValue("translations", trs);
          }}
          SUBMIT_highlights={({ lang_id, highlights }) =>
            // modifies highlgiths of a specific translation based on lang_id
            HANLDE_selectedHighlights({
              new_HIGHLIGHTS: highlights,
              lang_id,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: TranslationCreation_PROPS[]) =>
                setValue("translations", updated_TRS),
            })
          }
        />

        <SelectMyList_MODAL
          open={modal_STATES.selectedList}
          title="Saved vocab to list"
          submit_ACTION={(target_LIST: List_MODEL) => {
            if (target_LIST) {
              setValue("list", target_LIST);
              clearErrors("list");
              TOGGLE_modal("selectedList");
            }
          }}
          cancel_ACTION={() => {
            TOGGLE_modal("selectedList");
          }}
          IS_inAction={IS_creatingVocab}
          current_LIST={getValues("list")}
        />
      </View>
    </Big_MODAL>
  );
}
