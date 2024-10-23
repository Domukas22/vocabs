//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_arrow, ICON_X } from "@/src/components/icons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import TrHighlights_MODAL from "../TrHighlights_MODAL";
import SelectLangs_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectLangs_MODAL";
import { useTranslation } from "react-i18next";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import { useForm } from "react-hook-form";
import HANLDE_selectedLangs from "../../../utils/HANLDE_selectedLangs";
import HANLDE_selectedHighlights from "../../../utils/HANDLE_selectedTrs";

import ChosenLangs_CONTROLLER from "../../Inputs/InputControllers/ChosenLangs_CONTROLLER";
import TrInput_CONTROLLERS from "../../Inputs/InputControllers/TrInput_CONTROLLER";
import Description_CONTROLER from "../../Inputs/InputControllers/Description_CONTROLER";
import Difficulty_CONTROLLER from "../../Inputs/InputControllers/Difficulty_CONTROLLER";
import List_CONTROLLER from "../../Inputs/InputControllers/List_CONTROLLER";
import CreateMyVocab_FOOTER from "../../Footer/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";
import USE_updateVocab from "../../../hooks/USE_updateVocab";
import UpdateMyVocab_FOOTER from "../../Footer/UpdateMyVocab_FOOTER/UpdateMyVocab_FOOTER";
import { useToast } from "react-native-toast-notifications";

import {
  Language_MODEL,
  List_MODEL,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/watermelon_MODELS";
import { tr_PROPS } from "@/src/db/props";

import { Q } from "@nozbe/watermelondb";
import FETCH_langs from "@/src/features/4_languages/hooks/FETCH_langs";
import USE_collectListLangs from "@/src/features/1_lists/hooks/USE_collectListLangs";

interface UpdateMyVocabModal_PROPS {
  IS_open: boolean;
  toUpdate_VOCAB: Vocab_MODEL | undefined;
  list: List_MODEL | undefined;
  toUpdate_TRS: tr_PROPS[] | undefined;
  TOGGLE_modal: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export type UpdateMyVocabData_PROPS = {
  list: List_MODEL | undefined;
  difficulty: 1 | 2 | 3;
  description: string;
  translations: tr_PROPS[];
};

export default function UpdateMyVocab_MODAL({
  toUpdate_VOCAB,
  list,

  IS_open,
  TOGGLE_modal: TOGGLE_vocabModal,
  onSuccess = () => {},
}: UpdateMyVocabModal_PROPS) {
  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();
  const toast = useToast();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectLangs", initialValue: false },
    { name: "highlights", initialValue: false },
    { name: "list", initialValue: false },
    { name: "publish", initialValue: false },
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
    const { list, description, difficulty, translations } = data;
    const result = await UPDATE_vocab({
      user,
      vocab_id: toUpdate_VOCAB?.id,
      list,
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
    const fn = async () => {
      if (IS_open) {
        setValue("translations", toUpdate_VOCAB?.trs || []);
        setValue("description", toUpdate_VOCAB?.description || "");
        setValue("difficulty", toUpdate_VOCAB?.difficulty || 3);
        setValue("list", list || undefined);
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
          IS_inAction={false}
          current_LIST={getValues("list")}
        />
      </View>
    </Big_MODAL>
  );
}
