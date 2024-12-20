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

import TrHighlights_MODAL from "../TrHighlights_MODAL";
import SelectLangs_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectLangs_MODAL";
import { useTranslation } from "react-i18next";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

import { useForm } from "react-hook-form";
import HANLDE_selectedLangs from "../../../utils/HANLDE_selectedLangs";
import HANLDE_selectedHighlights from "../../../utils/HANDLE_selectedTrs";

import ChosenLangs_CONTROLLER from "../../Inputs/InputControllers/ChosenLangs_CONTROLLER";
import TrInput_CONTROLLERS from "../../Inputs/InputControllers/TrInput_CONTROLLER";
import Description_CONTROLER from "../../Inputs/InputControllers/Description_CONTROLER";
import USE_updateVocab from "../../../hooks/USE_updateVocab";
import UpdateMyVocab_FOOTER from "../../Footer/UpdateMyVocab_FOOTER/UpdateMyVocab_FOOTER";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import User_MODEL from "@/src/db/models/User_MODEL";

interface UpdatePublicVocabModal_PROPS {
  IS_open: boolean;
  toUpdate_VOCAB: Vocab_MODEL | undefined;
  toUpdate_TRS: tr_PROPS[] | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type UpdatePublicVocabData_PROPS = {
  description: string;
  translations: tr_PROPS[];
};

export default function UpdatePublicVocab_MODAL(
  props: UpdatePublicVocabModal_PROPS
) {
  const {
    IS_open,
    toUpdate_VOCAB,
    toUpdate_TRS,
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

  const { UPDATE_vocab, IS_updatingVocab, db_ERROR, RESET_dbError } =
    USE_updateVocab();

  const update = async (data: UpdatePublicVocabData_PROPS) => {
    const { description, translations } = data;
    const result = await UPDATE_vocab({
      user,
      vocab_id: toUpdate_VOCAB?.id,
      description,
      translations,
      is_public: true,
      onSuccess: (updated_VOCAB: Vocab_MODEL) => {
        onSuccess(updated_VOCAB);
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
    watch,
  } = useForm<UpdatePublicVocabData_PROPS>({
    defaultValues: {
      translations: [],
      description: "",
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const form_TRS = getValues("translations") || [];
  const submit = (data: UpdatePublicVocabData_PROPS) => update(data);
  const formValues = watch();

  useEffect(() => {
    RESET_dbError();
  }, [formValues, toUpdate_VOCAB]);

  useEffect(() => {
    if (IS_open) {
      const p = toUpdate_TRS?.map((x) => ({
        text: x.text,
        highlights: x.highlights,
        lang_id: x.lang_id,
      }));

      setValue("translations", p ? p : []);
      setValue("description", toUpdate_VOCAB?.description || "");
    }
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
        <UpdateMyVocab_FOOTER
          {...{ IS_updatingVocab, db_ERROR }}
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
