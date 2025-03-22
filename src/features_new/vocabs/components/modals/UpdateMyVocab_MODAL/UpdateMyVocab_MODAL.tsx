//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { useFieldArray, useForm } from "react-hook-form";

import { SelectMyList_MODAL } from "@/src/features/lists/components";
import {
  HANLDE_selectedLangs,
  HANLDE_selectedHighlights,
} from "@/src/features/vocabs/functions";

import { CreateMyVocab_FOOTER } from "../../../../../features/vocabs/components/1_myVocabs/footers/CreateMyVocab_FOOTER/CreateMyVocab_FOOTER";
import {
  ChosenLangs_CONTROLLER,
  TrInput_CONTROLLERS,
  Description_CONTROLER,
  Difficulty_CONTROLLER,
  List_CONTROLLER,
} from "../../../../../features/vocabs/components/1_myVocabs/inputs/inputControllers";
import { TrHighlights_MODAL } from "../../../../../features/vocabs/components/1_myVocabs/modals/TrHighlights_MODAL/TrHighlights_MODAL";
import { SelectMultipleLanguages_MODAL } from "@/src/features/languages/components";
import { USE_modalToggles } from "@/src/hooks/index";
import { VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { USE_upsertOneVocab } from "@/src/features_new/vocabs/hooks/actions/USE_upsertOneVocab/USE_upsertOneVocab";
import { TinyList_TYPE } from "@/src/features_new/lists/types";
import { z_USE_myOneVocab } from "../../../hooks/zustand/z_USE_myOneVocab/z_USE_myOneVocab";

interface CreateMyVocabModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
}

export type UpdateMyVocabData_PROPS = {
  id: string;
  list: { id: string; name: string };
  difficulty: 1 | 2 | 3;
  description: string;
  translations: VocabTr_TYPE[];
};

// 🔴🔴 TODO -->
// -- Collect list langs after updating vocab

export function UpdateMyVocab_MODAL({
  IS_open,
  CLOSE_modal,
}: CreateMyVocabModal_PROPS) {
  const { t } = useTranslation();
  const { z_myOneList } = z_USE_myOneList();
  const { z_myOneVocab, z_RESET_myOneVocab } = z_USE_myOneVocab();
  const { modals } = USE_modalToggles([
    "selectLangs",
    "selectHighlights",
    "selectList",
  ]);

  const { UPSERT_oneVocab, IS_creatingVocab, createVocab_ERROR } =
    USE_upsertOneVocab({ type: "update" });

  // ---------------------------------------------------

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    trigger,
  } = useForm<UpdateMyVocabData_PROPS>({
    defaultValues: {
      id: z_myOneVocab?.id,
      translations: z_myOneVocab?.trs,
      description: z_myOneVocab?.description || "",
      list: z_myOneVocab?.list,
      difficulty: z_myOneVocab?.difficulty || 3,
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const close = useCallback(() => {
    reset({
      id: z_myOneVocab?.id,
      translations: z_myOneVocab?.trs || [],
      list: z_myOneVocab?.list,
      difficulty: z_myOneVocab?.difficulty || 3,
      description: z_myOneVocab?.description || "",
    });
    CLOSE_modal();
    Keyboard.dismiss();
  }, [reset, z_myOneList]);

  // update content each time the oneVocab updates
  useEffect(() => {
    reset({
      id: z_myOneVocab?.id,
      translations: z_myOneVocab?.trs || [],
      list: z_myOneVocab?.list,
      difficulty: z_myOneVocab?.difficulty || 3,
      description: z_myOneVocab?.description || "",
    });
  }, [z_myOneVocab]);

  const update = async (data: UpdateMyVocabData_PROPS) => {
    const { id, list, description, difficulty, translations } = data;

    await UPSERT_oneVocab(
      {
        id,
        list_id: list?.id,
        description,
        trs: translations,
        is_marked: false,
        difficulty,
      },
      () => close()
    );
  };

  const {
    fields: trs,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "translations",
  });

  const submit = (data: UpdateMyVocabData_PROPS) => update(data);

  const [target_TR, SET_targetTr] = useState<VocabTr_TYPE | undefined>();

  const REMOVE_lang = useCallback(
    (toRemoveLang_ID: string) => {
      const index = trs.findIndex((tr) => tr.lang_id === toRemoveLang_ID);
      if (index !== -1) {
        remove(index);
      }
      trigger("translations");
    },
    [trs, remove, trigger]
  );

  return (
    <Big_MODAL {...{ open: IS_open }}>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Header
          title={t("header.updateVocab")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={() => close()}
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
            control={control}
            OPEN_langModal={() => modals.selectLangs.set(true)}
            REMOVE_lang={REMOVE_lang}
          />

          <TrInput_CONTROLLERS
            control={control}
            trs={getValues("translations")}
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
          IS_creatingVocab={IS_creatingVocab}
          dbError_MSG={createVocab_ERROR?.user_MSG}
          submit={handleSubmit(submit)}
          CANCEL_creation={close}
        />

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectMultipleLanguages_MODAL
          open={modals.selectLangs.IS_open}
          CLOSE_modal={() => modals.selectLangs.set(false)}
          initialLang_IDS={
            getValues("translations")?.map((tr) => tr.lang_id) || []
          }
          SUBMIT_langIds={(lang_ids: string[]) => {
            HANLDE_selectedLangs({
              newLang_IDS: lang_ids,
              current_TRS: getValues("translations"),
              SET_trs: (updated_TRS: VocabTr_TYPE[]) => {
                reset({ translations: updated_TRS });
              },
            });
            modals.selectLangs.set(false);
          }}
          loading={IS_creatingVocab}
        />

        <TrHighlights_MODAL
          open={modals.selectHighlights.IS_open}
          tr={target_TR}
          diff={getValues("difficulty")}
          TOGGLE_open={() => modals.selectHighlights.set(false)}
          SET_trs={(trs: VocabTr_TYPE[]) => {
            setValue("translations", trs);
          }}
          SUBMIT_highlights={(highlights) =>
            // modifies highlgiths of a specific translation based on lang_id
            HANLDE_selectedHighlights({
              new_HIGHLIGHTS: highlights,
              lang_id: target_TR?.lang_id || "",
              current_TRS: getValues("translations"),
              SET_trs: (updated_TRS: VocabTr_TYPE[]) =>
                setValue("translations", updated_TRS),
            })
          }
        />

        <SelectMyList_MODAL
          open={modals.selectList.IS_open}
          title="Select a list of yours"
          submit_ACTION={(list: TinyList_TYPE) => {
            if (list) {
              setValue("list", { id: list?.id, name: list?.name });
              clearErrors("list");
              modals.selectList.set(false);
              ``;
            }
          }}
          cancel_ACTION={() => {
            modals.selectList.set(false);
          }}
          IS_inAction={IS_creatingVocab}
          initial_LIST={getValues("list")}
        />
      </View>
    </Big_MODAL>
  );
}
