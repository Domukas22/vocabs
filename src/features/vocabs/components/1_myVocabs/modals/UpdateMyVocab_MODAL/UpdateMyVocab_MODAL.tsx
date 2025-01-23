//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import List_MODEL from "@/src/db/models/List_MODEL";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import { tr_PROPS } from "@/src/props";

import { Q } from "@nozbe/watermelondb";
import { FETCH_langs } from "@/src/features/languages/functions";
import { Lists_DB } from "@/src/db";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { SelectMyList_MODAL } from "@/src/features/lists/components";
import { USE_collectListLangs } from "@/src/features/lists/functions";
import {
  USE_updateVocab,
  HANLDE_selectedLangs,
  HANLDE_selectedHighlights,
} from "@/src/features/vocabs/functions";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { UpdateMyVocab_FOOTER } from "../../footers/UpdateMyVocab_FOOTER/UpdateMyVocab_FOOTER";
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

interface UpdateMyVocabModal_PROPS {
  IS_open: boolean;
  toUpdate_VOCAB: Vocab_MODEL | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type UpdateMyVocabData_PROPS = {
  list_id: string | undefined;
  user_id: string | undefined;
  difficulty: 1 | 2 | 3;
  description: string;
  translations: tr_PROPS[];
};

export function UpdateMyVocab_MODAL({
  IS_open,
  toUpdate_VOCAB,
  TOGGLE_modal: TOGGLE_vocabModal,
  onSuccess = () => {},
}: UpdateMyVocabModal_PROPS) {
  const { t } = useTranslation();

  const toast = useToast();

  const { modals } = USE_modalToggles([
    "selectLangs",
    "selectHighlights",
    "selectList",
  ]);

  const [target_TR, SET_targetTr] = useState<tr_PROPS | undefined>(undefined);

  const { UPDATE_vocab, IS_updatingVocab, db_ERROR, RESET_dbError } =
    USE_updateVocab();
  const {
    COLLECT_langs,
    IS_collectingLangs,
    collectLangs_ERROR,
    RESET_collectLangsError,
  } = USE_collectListLangs();

  const collectLangs = async (list_id: string | undefined) => {
    const updated_LIST = await COLLECT_langs({
      list_id,
    });
    if (!updated_LIST.success) {
      console.error(updated_LIST.msg); // Log internal message for debugging.
    }
  };

  const update = async (data: UpdateMyVocabData_PROPS) => {
    const { list_id, description, difficulty, translations } = data;

    const result = await UPDATE_vocab({
      vocab_id: toUpdate_VOCAB?.id,
      list_id,
      difficulty,
      description,
      translations,
      is_public: false,
      onSuccess: (updated_VOCAB: Vocab_MODEL) => {
        onSuccess(updated_VOCAB);
        collectLangs(updated_VOCAB?.list_id);

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
      list_id: undefined,
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
    const fn = async () => {
      const _list = await Lists_DB.query(
        Q.where("id", toUpdate_VOCAB?.list_id || "")
      );

      if (IS_open) {
        setValue("translations", toUpdate_VOCAB?.trs || []);
        setValue("description", toUpdate_VOCAB?.description || "");
        setValue("difficulty", toUpdate_VOCAB?.difficulty || 3);
        setValue("list_id", _list?.[0]?.id || undefined);
      }
    };
    fn();
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
            TOGGLE_langModal={() => modals.selectLangs.set(true)}
          />

          <TrInput_CONTROLLERS
            {...{ control, selected_LANGS }}
            trs={form_TRS}
            diff={getValues("difficulty")}
            OPEN_highlights={(tr: tr_PROPS) => {
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
          open={modals.selectLangs.IS_open}
          TOGGLE_open={() => modals.selectLangs.set(false)}
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
          open={modals.selectHighlights.IS_open}
          tr={target_TR}
          target_LANG={target_LANG}
          diff={getValues("difficulty")}
          TOGGLE_open={() => modals.selectHighlights.set(false)}
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
          open={modals.selectList.IS_open}
          title="Saved vocab to list"
          submit_ACTION={(target_LIST: List_MODEL) => {
            if (target_LIST) {
              setValue("list_id", target_LIST?.id);
              clearErrors("list_id");
              modals.selectList.set(false);
            }
          }}
          cancel_ACTION={() => {
            modals.selectList.set(false);
          }}
          IS_inAction={false}
          current_LIST={getValues("list_id")}
        />
      </View>
    </Big_MODAL>
  );
}
