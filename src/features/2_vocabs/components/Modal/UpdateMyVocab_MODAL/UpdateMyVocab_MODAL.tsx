//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_arrow, ICON_X } from "@/src/components/icons/icons";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/props";

import TrHighlights_MODAL from "../TrHighlights_MODAL";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";
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
import TrInput_CONTROLLER from "../../Inputs/InputControllers/TrInput_CONTROLLER";
import Description_CONTROLER from "../../Inputs/InputControllers/Description_CONTROLER";
import Difficulty_CONTROLLER from "../../Inputs/InputControllers/Difficulty_CONTROLLER";
import List_CONTROLLER from "../../Inputs/InputControllers/List_CONTROLLER";
import CreateMyVocab_FOOTER from "../../Footer/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";
import USE_updateVocab from "../../../hooks/USE_updateVocab";
import UpdateMyVocab_FOOTER from "../../Footer/UpdateMyVocab_FOOTER/UpdateMyVocab_FOOTER";
import PublishPrivateVocabAsAdmin_MODAL from "../PublishPrivateVocabAsAdmin_MODAL/PublishPrivateVocabAsAdmin_MODAL";
import { useToast } from "react-native-toast-notifications";

interface UpdateMyVocabModal_PROPS {
  IS_open: boolean;
  toUpdate_VOCAB: Vocab_MODEL | undefined;
  initial_LIST: List_MODEL | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type UpdateMyVocabData_PROPS = {
  list: List_MODEL | undefined;
  difficulty: 1 | 2 | 3;
  description: string;
  translations: TranslationCreation_PROPS[];
};

export default function UpdateMyVocab_MODAL(props: UpdateMyVocabModal_PROPS) {
  const {
    IS_open,
    toUpdate_VOCAB,
    initial_LIST,
    TOGGLE_modal: TOGGLE_vocabModal,
    onSuccess = () => {},
  } = props;

  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();
  const toast = useToast();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "langs", initialValue: false },
    { name: "highlights", initialValue: false },
    { name: "list", initialValue: false },
    { name: "publish", initialValue: false },
  ]);

  const [target_TR, SET_targetTr] = useState<
    TranslationCreation_PROPS | undefined
  >(undefined);

  const { UPDATE_vocab, IS_updatingVocab, db_ERROR, RESET_dbError } =
    USE_updateVocab();

  const update = async (data: UpdateMyVocabData_PROPS) => {
    const { list, description, difficulty, translations } = data;
    const result = await UPDATE_vocab({
      user,
      vocab_id: toUpdate_VOCAB?.id,
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
    watch,
  } = useForm<UpdateMyVocabData_PROPS>({
    defaultValues: {
      translations: [],
      description: "",
      list: undefined,
      difficulty: undefined,
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const form_TRS = getValues("translations") || [];
  const submit = (data: UpdateMyVocabData_PROPS) => update(data);
  const formValues = watch();

  useEffect(() => {
    RESET_dbError();
  }, [formValues, toUpdate_VOCAB]);

  useEffect(() => {
    if (IS_open) {
      setValue("translations", toUpdate_VOCAB?.translations || []);
      setValue("description", toUpdate_VOCAB?.description || "");
      setValue("difficulty", toUpdate_VOCAB?.difficulty || 3);
      setValue("list", initial_LIST || undefined);
    }
  }, [IS_open]);

  return (
    <Big_MODAL {...{ open: IS_open }}>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Header
          title={t("modal.vocab.headerCreate")}
          big={true}
          btnRight={
            <View style={{ flexDirection: "row", gap: 8 }}>
              {user?.is_admin && (
                <Btn
                  type="seethrough"
                  iconLeft={<ICON_arrow direction="right" color="green" />}
                  onPress={() => {
                    TOGGLE_modal("publish");
                  }}
                  style={{ borderRadius: 100 }}
                />
              )}
              <Btn
                type="seethrough"
                iconLeft={<ICON_X big={true} rotate={true} />}
                onPress={() => {
                  TOGGLE_vocabModal();
                  reset();
                }}
                style={{ borderRadius: 100 }}
              />
            </View>
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
            <TrInput_CONTROLLER
              {...{ tr, index, control }}
              diff={getValues("difficulty")}
              OPEN_highlights={() => {
                SET_targetTr(tr);
                TOGGLE_modal("highlights");
              }}
              key={tr.lang_id + "InputsBlock"}
            />
          ))}

          <Description_CONTROLER {...{ control }} />
          <Difficulty_CONTROLLER {...{ control }} />
          <List_CONTROLLER
            {...{ control }}
            TOGGLE_listModal={() => TOGGLE_modal("list")}
          />
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
        <SelectMultipleLanguages_MODAL
          open={modal_STATES.langs}
          TOGGLE_open={() => TOGGLE_modal("langs")}
          trs={form_TRS}
          SUBMIT_langs={(new_LANGS: Language_MODEL[]) =>
            // adds/deletes current translations based on new languages provided
            HANLDE_selectedLangs({
              new_LANGS,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: TranslationCreation_PROPS[]) => {
                setValue("translations", updated_TRS);
                if (updated_TRS.length) clearErrors("translations");
              },
            })
          }
        />

        <TrHighlights_MODAL
          open={modal_STATES.highlights}
          tr={target_TR}
          diff={getValues("difficulty")}
          TOGGLE_open={() => TOGGLE_modal("highlights")}
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
          open={modal_STATES.list}
          title="Saved vocab to list"
          submit_ACTION={(target_LIST: List_MODEL) => {
            if (target_LIST) {
              setValue("list", target_LIST);
              clearErrors("list");
              TOGGLE_modal("list");
            }
          }}
          cancel_ACTION={() => {
            TOGGLE_modal("list");
          }}
          IS_inAction={false}
          current_LIST={getValues("list")}
        />

        <PublishPrivateVocabAsAdmin_MODAL
          user={user}
          IS_open={modal_STATES.publish}
          vocab={toUpdate_VOCAB}
          CLOSE_modal={() => TOGGLE_modal("publish")}
          onSuccess={() => {
            TOGGLE_modal("publish");
            TOGGLE_vocabModal();
            toast.show(t("notifications.vocabPublishedToPublic"), {
              type: "green",
              duration: 5000,
            });
          }}
        />
      </View>
    </Big_MODAL>
  );
}
