//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { useForm } from "react-hook-form";

import Language_MODEL from "@/src/db/models/Language_MODEL";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import { SelectMyList_MODAL } from "@/src/features/lists/components";
import { USE_collectListLangs } from "@/src/features/lists/functions";
import {
  USE_createVocab,
  GET_defaultTranslations,
  HANLDE_selectedLangs,
  HANLDE_selectedHighlights,
} from "@/src/features/vocabs/functions";

import { CreateMyVocab_FOOTER } from "../../footers/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";
import {
  ChosenLangs_CONTROLLER,
  TrInput_CONTROLLERS,
  Description_CONTROLER,
  Difficulty_CONTROLLER,
  List_CONTROLLER,
} from "../../inputs/inputControllers";
import { TrHighlights_MODAL } from "../TrHighlights_MODAL/TrHighlights_MODAL";
import { SelectMultipleLanguages_MODAL } from "@/src/features/languages/components";
import { USE_modalToggles } from "@/src/hooks/index";
import List_MODEL from "@/src/db/models/List_MODEL";
import { FETCH_langs } from "@/src/features/languages/functions/fetch/FETCH_langs/FETCH_langs";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

interface CreateMyVocabModal_PROPS {
  IS_open: boolean;

  CLOSE_modal: () => void;
}

export type CreateMyVocabData_PROPS = {
  list: List_MODEL | undefined;
  difficulty: 1 | 2 | 3;
  description: string;
  translations: VocabTr_TYPE[];
};

export function CreateMyVocab_MODAL({
  IS_open,
  CLOSE_modal: TOGGLE_vocabModal,
}: CreateMyVocabModal_PROPS) {
  const { t } = useTranslation();

  const { z_myList: initial_LIST } = z_USE_myVocabs();

  const { modals } = USE_modalToggles([
    "selectLangs",
    "selectHighlights",
    "selectList",
  ]);

  const [target_TR, SET_targetTr] = useState<VocabTr_TYPE | undefined>(
    undefined
  );
  const { z_user } = z_USE_user();

  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();
  const {
    COLLECT_langs,
    IS_collectingLangs,
    collectLangs_ERROR,
    RESET_collectLangsError,
  } = USE_collectListLangs();

  const collectLangs = async (list_id: string) => {
    const updated_LIST = await COLLECT_langs({
      list_id,
    });
    if (!updated_LIST.success) {
      console.error(updated_LIST.msg); // Log internal message for debugging.
    }
  };

  const create = async (data: CreateMyVocabData_PROPS) => {
    const { list, description, difficulty, translations } = data;
    const result = await CREATE_vocab({
      user: z_user,
      list_id: list?.id,
      difficulty,
      description,
      translations,
      onSuccess: (new_VOCAB: Vocab_MODEL) => {
        // onSuccess(new_VOCAB);
        // collectLangs(new_VOCAB.list_id || "");
        // reset();
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
      translations: GET_defaultTranslations("en,de") || [],
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
      setValue("translations", GET_defaultTranslations("en,de") || []);
    setValue("list", initial_LIST);
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
            TOGGLE_langModal={() => modals.selectLangs.set(false)}
          />

          <TrInput_CONTROLLERS
            {...{ control, selected_LANGS }}
            trs={form_TRS}
            diff={getValues("difficulty")}
            OPEN_highlights={(tr: VocabTr_TYPE) => {
              SET_targetTr(tr);
              modals.selectHighlights.set(true);
            }}
          />

          <Description_CONTROLER {...{ control }} />
          <Difficulty_CONTROLLER {...{ control }} />
          <List_CONTROLLER
            {...{ control }}
            TOGGLE_listModal={() => modals.selectList.set(true)}
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
          open={modals.selectList.IS_open}
          TOGGLE_open={() => modals.selectLangs.set(false)}
          lang_ids={getValues("translations")?.map((tr) => tr.lang_id) || []}
          SUBMIT_langIds={(lang_ids: string[]) => {
            HANLDE_selectedLangs({
              newLang_IDS: lang_ids,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: VocabTr_TYPE[]) => {
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
          open={modals.selectList.IS_open}
          tr={target_TR}
          target_LANG={target_LANG}
          diff={getValues("difficulty")}
          TOGGLE_open={() => modals.selectHighlights.set(false)}
          SET_trs={(trs: VocabTr_TYPE[]) => {
            setValue("translations", trs);
          }}
          SUBMIT_highlights={({ lang_id, highlights }) =>
            // modifies highlgiths of a specific translation based on lang_id
            HANLDE_selectedHighlights({
              new_HIGHLIGHTS: highlights,
              lang_id,
              current_TRS: form_TRS,
              SET_trs: (updated_TRS: VocabTr_TYPE[]) =>
                setValue("translations", updated_TRS),
            })
          }
        />

        <SelectMyList_MODAL
          open={modals.selectList.IS_open}
          title="Select a list of yours"
          submit_ACTION={(list: List_MODEL) => {
            if (list) {
              setValue("list", list);
              clearErrors("list");
              modals.selectList.set(false);
            }
          }}
          cancel_ACTION={() => {
            modals.selectList.set(false);
          }}
          IS_inAction={IS_creatingVocab}
          selected_LIST={getValues("list")}
        />
      </View>
    </Big_MODAL>
  );
}
