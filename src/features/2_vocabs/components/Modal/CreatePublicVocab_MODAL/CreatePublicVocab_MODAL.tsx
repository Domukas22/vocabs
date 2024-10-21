//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { tr_PROPS } from "@/src/db/props";

import {
  Vocab_MODEL,
  Language_MODEL,
  List_MODEL,
  User_MODEL,
} from "@/src/db/watermelon_MODELS";

import TrHighlights_MODAL from "../TrHighlights_MODAL";
import SelectLangs_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectLangs_MODAL";
import { useTranslation } from "react-i18next";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createVocab from "../../../hooks/USE_createVocab";

import GET_defaultTranslations from "@/src/features/2_vocabs/utils/GET_defaultTranslations";
import { useForm } from "react-hook-form";
import HANLDE_selectedLangs from "../../../utils/HANLDE_selectedLangs";
import HANLDE_selectedHighlights from "../../../utils/HANDLE_selectedTrs";

import ChosenLangs_CONTROLLER from "../../Inputs/InputControllers/ChosenLangs_CONTROLLER";
import TrInput_CONTROLLERS from "../../Inputs/InputControllers/TrInput_CONTROLLER";
import Description_CONTROLER from "../../Inputs/InputControllers/Description_CONTROLER";
import Difficulty_CONTROLLER from "../../Inputs/InputControllers/Difficulty_CONTROLLER";
import List_CONTROLLER from "../../Inputs/InputControllers/List_CONTROLLER";
import CreateMyVocab_FOOTER from "../../Footer/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";

interface CreatePublicVocabModal_PROPS {
  IS_open: boolean;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type CreatePublicVocabData_PROPS = {
  description: string;
  translations: tr_PROPS[];
};

export default function CreatePublicVocab_MODAL(
  props: CreatePublicVocabModal_PROPS
) {
  const {
    IS_open,
    TOGGLE_modal: TOGGLE_vocabModal,
    onSuccess = () => {},
  } = props;

  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "langs", initialValue: false },
    { name: "highlights", initialValue: false },
    { name: "list", initialValue: false },
  ]);

  const [target_TR, SET_targetTr] = useState<tr_PROPS | undefined>(undefined);

  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();

  const create = async (data: CreatePublicVocabData_PROPS) => {
    const { description, translations } = data;
    const result = await CREATE_vocab({
      user,
      difficulty: 3,
      description,
      translations,
      is_public: true,
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
  } = useForm<CreatePublicVocabData_PROPS>({
    defaultValues: {
      translations: GET_defaultTranslations() || [],
      description: "",
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const form_TRS = getValues("translations") || [];
  const submit = (data: CreatePublicVocabData_PROPS) => create(data);
  const formValues = watch();

  useEffect(() => {
    RESET_dbError();
  }, [formValues]);

  useEffect(() => {
    if (IS_open)
      setValue("translations", GET_defaultTranslations(["en", "de"]) || []);
  }, [IS_open]);

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
            TOGGLE_langModal={() => TOGGLE_modal("langs")}
          />

          {form_TRS.map((tr, index) => (
            <TrInput_CONTROLLERS
              {...{ tr, index, control }}
              diff={undefined}
              OPEN_highlights={() => {
                SET_targetTr(tr);
                TOGGLE_modal("highlights");
              }}
              key={tr.lang_id + "InputsBlock"}
            />
          ))}

          <Description_CONTROLER {...{ control }} />
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
        <SelectLangs_MODAL
          open={modal_STATES.langs}
          TOGGLE_open={() => TOGGLE_modal("langs")}
          trs={form_TRS}
          SUBMIT_langs={(new_LANGS: Language_MODEL[]) =>
            // adds/deletes current translations based on new languages provided
            HANLDE_selectedLangs({
              new_LANGS,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: tr_PROPS[]) => {
                setValue("translations", updated_TRS);

                if (updated_TRS.length) {
                  clearErrors("translations");
                }
              },
            })
          }
        />

        <TrHighlights_MODAL
          open={modal_STATES.highlights}
          tr={target_TR}
          diff={0}
          TOGGLE_open={() => TOGGLE_modal("highlights")}
          SET_trs={(trs: tr_PROPS[]) => {
            setValue("translations", trs);
          }}
          SUBMIT_highlights={({ lang_id, highlights }) =>
            // modifies highlgiths of a specific translation based on lang_id
            HANLDE_selectedHighlights({
              new_HIGHLIGHTS: highlights,
              lang_id,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: tr_PROPS[]) =>
                setValue("translations", updated_TRS),
            })
          }
        />
      </View>
    </Big_MODAL>
  );
}
