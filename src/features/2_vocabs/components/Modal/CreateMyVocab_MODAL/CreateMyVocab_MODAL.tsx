//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { tr_PROPS } from "@/src/db/props";

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
import {
  List_MODEL,
  User_MODEL,
  Vocab_MODEL,
  Language_MODEL,
} from "@/src/db/watermelon_MODELS";
import FETCH_langs from "@/src/features/4_languages/hooks/FETCH_langs";

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
  translations: tr_PROPS[];
};

export default function CreateMyVocab_MODAL({
  IS_open,
  TOGGLE_modal: TOGGLE_vocabModal,
  initial_LIST,
  onSuccess = () => {},
}: CreateMyVocabModal_PROPS) {
  const { t } = useTranslation();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectLangs" },
    { name: "highlights" },
    { name: "list" },
  ]);

  const [target_TR, SET_targetTr] = useState<tr_PROPS | undefined>(undefined);

  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();

  const create = async (data: CreateMyVocabData_PROPS) => {
    const { list, description, difficulty, translations } = data;
    const result = await CREATE_vocab({
      list,
      difficulty,
      description,
      translations,
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
      translations:
        GET_defaultTranslations(
          initial_LIST?.default_lang_ids || ["en", "de"]
        ) || [],
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

  useEffect(() => {
    if (IS_open)
      setValue(
        "translations",
        GET_defaultTranslations(
          initial_LIST?.default_lang_ids || ["en", "de"]
        ) || []
      );
  }, [IS_open]);

  const [selected_LANGS, SET_selectedLangs] = useState<Language_MODEL[]>([]);

  useEffect(() => {
    const fetchSelectedLangs = async () => {
      const langs = await FETCH_langs({
        lang_ids: getValues("translations")?.map((tr) => tr.lang_id),
      });
      SET_selectedLangs(langs);
    };

    fetchSelectedLangs();
  }, [getValues("translations")]);

  const target_LANG = useMemo(
    () => selected_LANGS.find((l) => l.lang_id === target_TR?.lang_id),
    [selected_LANGS, target_TR]
  );

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
            TOGGLE_langModal={() => TOGGLE_modal("selectLangs")}
          />

          <TrInput_CONTROLLERS
            {...{ control, selected_LANGS }}
            trs={form_TRS}
            diff={getValues("difficulty")}
            OPEN_highlights={(tr: tr_PROPS) => {
              SET_targetTr(tr);
              TOGGLE_modal("highlights");
            }}
          />

          <Description_CONTROLER {...{ control }} />
          <Difficulty_CONTROLLER {...{ control }} />
          <List_CONTROLLER
            {...{ control }}
            TOGGLE_listModal={() => TOGGLE_modal("list")}
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
        <SelectLangs_MODAL
          open={modal_STATES.selectLangs}
          TOGGLE_open={() => TOGGLE_modal("selectLangs")}
          lang_ids={getValues("translations")?.map((tr) => tr.lang_id) || []}
          SUBMIT_langIds={(lang_ids: string[]) => {
            HANLDE_selectedLangs({
              newLang_IDS: lang_ids,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: tr_PROPS[]) => {
                setValue("translations", updated_TRS);

                if (updated_TRS.length) {
                  clearErrors("translations");
                }
              },
            });
          }}
          IS_inAction={false}
        />

        <TrHighlights_MODAL
          open={modal_STATES.highlights}
          tr={target_TR}
          target_LANG={target_LANG}
          diff={getValues("difficulty")}
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
          IS_inAction={IS_creatingVocab}
          current_LIST={getValues("list")}
        />
      </View>
    </Big_MODAL>
  );
}
