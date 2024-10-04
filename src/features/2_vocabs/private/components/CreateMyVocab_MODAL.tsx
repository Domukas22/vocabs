//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_dropdownArrow, ICON_X } from "@/src/components/icons/icons";
import React, { useMemo, useState } from "react";
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
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";
import DifficultyInput_BLOCK from "../../components/Vocab_MODAL/components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";
import DescriptionInput_BLOCK from "../../components/Vocab_MODAL/components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";
import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import Label from "@/src/components/Label/Label";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Footer from "@/src/components/Footer/Footer";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createVocab from "../../hooks/USE_createVocab";
import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

import GET_defaultTranslations from "@/src/utils/GET_defaultTranslations";
import { Controller, useForm } from "react-hook-form";
import HANLDE_selectedLangs from "../../shared/utils/HANLDE_selectedLangs";
import HANLDE_selectedHighlights from "../../shared/utils/HANDLE_selectedTrs";
import HANDLE_langRemoval from "../../shared/utils/HANLDE_langRemoval";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TRANSLATION_LENGTH,
} from "@/src/constants/globalVars";

interface CreateMyVocabModal_PROPS {
  IS_open: boolean;
  initial_LIST: List_MODEL | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

type CreateMyVocabData_PROPS = {
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

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "selectedList", initialValue: false },
    { name: "trHighlights", initialValue: false },
  ]);

  const [target_TR, SET_targetTr] = useState<
    TranslationCreation_PROPS | undefined
  >(undefined);

  const { CREATE_vocab, IS_creatingVocab, error, RESET_error } =
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
    formState: { errors, isSubmitted },
    setValue,
    getValues,
    reset,
    clearErrors,
    trigger,
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

  const form_TRS = useMemo(
    () => getValues("translations"),
    [getValues("translations")]
  );
  const submit = (data: CreateMyVocabData_PROPS) => create(data);

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

          <Controller
            control={control}
            name="translations"
            rules={{
              validate: (value) =>
                value && value.length > 0
                  ? true
                  : "At least one language must be selected is required",
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <ChosenLangs_BLOCK
                label={t("label.chosenLangs")}
                trs={value}
                toggle={() => TOGGLE_modal("selectedLangs")}
                REMOVE_lang={(lang_id: string) =>
                  HANDLE_langRemoval({
                    lang_id,
                    current_TRS: value,
                    SET_trs: (updated_TRS: TranslationCreation_PROPS[]) => {
                      onChange([...updated_TRS]); // Update translations array via onChange
                      trigger();
                    },
                  })
                }
                error={error}
                // Pass the error message from validation
              />
            )}
          />

          {form_TRS.map((tr, index) => (
            <Controller
              key={tr.lang_id + "InputsBlock"}
              control={control}
              name={`translations[${index}].text`}
              rules={{
                required: {
                  value: true,
                  message: "Please provide a value or remove the language",
                },
                maxLength: {
                  value: MAX_TRANSLATION_LENGTH,
                  message: `Translations can have ${MAX_TRANSLATION_LENGTH} letters at most`,
                },
              }}
              render={({ field }) => (
                <TrInput_BLOCK
                  tr={tr}
                  diff={getValues("difficulty")}
                  HANDLE_trText={(newValue) => field.onChange(newValue.text)}
                  TOGGLE_modal={TOGGLE_modal}
                  SET_targetTr={SET_targetTr}
                  error={isSubmitted ? errors.translations?.[index]?.text : ""}
                  IS_errorCorrected={
                    isSubmitted && !errors.translations?.[index]?.text
                  }
                />
              )}
            />
          ))}

          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: MAX_DESCRIPTION_LENGTH,
                message: `Descriptions can have ${MAX_DESCRIPTION_LENGTH} letters at most`,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DescriptionInput_BLOCK
                value={value}
                SET_value={(val) => {
                  onChange(val);
                  RESET_error();
                }}
                error={isSubmitted ? errors.description : ""}
                IS_errorCorrected={isSubmitted && !errors.description}
              />
            )}
          />
          <Controller
            control={control}
            name="difficulty"
            rules={{
              required: {
                value: true,
                message: "Please select a difficulty",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <DifficultyInput_BLOCK
                value={value}
                SET_value={(val) => {
                  onChange(val);
                  trigger();
                  RESET_error();
                }}
                error={isSubmitted ? errors.difficulty : ""}
              />
            )}
          />
          <Controller
            control={control}
            name="list"
            rules={{
              required: {
                value: true,
                message: "Please select a list",
              },
            }}
            render={({ field: { value } }) => (
              <Block>
                <Label>{t("label.chosenList")}</Label>
                <Btn
                  text={value?.name || "Select a list..."}
                  iconRight={<ICON_dropdownArrow />}
                  onPress={() => TOGGLE_modal("selectedList")}
                  type="simple"
                  style={[
                    { flex: 1 },
                    errors.list && { borderColor: MyColors.border_red },
                  ]}
                  text_STYLES={{
                    flex: 1,
                    fontFamily: value?.name ? "Nunito-Regular" : "Nunito-Light",
                    color: value?.name
                      ? MyColors.text_white
                      : MyColors.text_white_06,
                  }}
                />
                {isSubmitted && errors.list && (
                  <Styled_TEXT type="text_error">
                    {errors.list?.message}
                  </Styled_TEXT>
                )}
              </Block>
            )}
          />
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
                reset();
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
              onPress={handleSubmit(submit)}
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
          trs={form_TRS}
          SUBMIT_langs={(new_LANGS: Language_MODEL[]) =>
            HANLDE_selectedLangs({
              new_LANGS,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: TranslationCreation_PROPS[]) =>
                setValue("translations", updated_TRS),
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
