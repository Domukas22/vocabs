//
//
//

import { useCallback, useEffect } from "react";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  CreateList_MODAL,
  SelectMyList_MODAL,
} from "@/src/features/lists/components";
import { t } from "i18next";
import { ActivityIndicator, View } from "react-native";
import { USE_modalToggles } from "@/src/hooks/index";
import { z_USE_publicOneVocab } from "@/src/features_new/vocabs/hooks/zustand/z_USE_publicOneVocab/z_USE_publicOneVocab";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import { useForm } from "react-hook-form";
import { USE_saveVocab } from "../../../hooks/actions/USE_saveVocab/USE_saveVocab";
import { Vocab_TYPE } from "../../../types";
import { TinyList_TYPE } from "@/src/features_new/lists/types";
import { ICON_dropdownArrow } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { z_USE_myTargetSaveList } from "@/src/features_new/lists/hooks/zustand/z_USE_myTargetSaveList/z_USE_myTargetSaveList";

export type SaveVocabData_PROPS = {
  vocab: Vocab_TYPE;
  list: { id: string; name: string };
};

export function SaveVocab_MODAL({
  IS_open,
  CLOSE_modal,
}: {
  IS_open: boolean;
  CLOSE_modal: () => void;
}) {
  const { modals } = USE_modalToggles(["chooseList", "createList"]);
  const { z_publicOneVocab } = z_USE_publicOneVocab();
  const { z_myTargetSave_LIST } = z_USE_myTargetSaveList();

  const { SAVE_vocab, error, loading, RESET_error } = USE_saveVocab();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    trigger,
    formState,
  } = useForm<SaveVocabData_PROPS>({
    defaultValues: {
      vocab: z_publicOneVocab,
      list: z_myTargetSave_LIST,
    },
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const _RESET = useCallback(
    () =>
      reset({
        list: { id: z_myTargetSave_LIST?.id, name: z_myTargetSave_LIST?.name },
        vocab: z_publicOneVocab,
      }),
    [reset, z_publicOneVocab]
  );

  const close = useCallback(() => {
    RESET_error();
    _RESET();
    CLOSE_modal();
  }, [RESET_error, _RESET, CLOSE_modal]);

  // update content each time the oneVocab updates
  useEffect(() => _RESET(), [z_publicOneVocab, z_myTargetSave_LIST]);

  const submit = async (data: SaveVocabData_PROPS) => {
    const { vocab, list } = data;
    await SAVE_vocab(vocab, list?.id || "", close);
  };

  return (
    <Small_MODAL
      title={t("btn.saveVocab")}
      IS_open={IS_open}
      TOGGLE_modal={close}
      error_MSG={error?.user_MSG}
      btnLeft={<Btn text={t("btn.cancel")} onPress={close} />}
      btnRight={
        <Btn
          text={!loading ? t("btn.save") : ""}
          iconRight={loading ? <ActivityIndicator color="black" /> : null}
          type="action"
          style={{ flex: 1 }}
          onPress={handleSubmit(submit)}
        />
      }
      modals={
        <>
          <SelectMyList_MODAL
            open={modals.chooseList.IS_open}
            title="Choose a list"
            submit_ACTION={(list: TinyList_TYPE) => {
              if (list) {
                setValue("list", { id: list?.id, name: list?.name });
                clearErrors("list");
                modals.chooseList.set(false);
                modals.createList.set(false);
              }
            }}
            cancel_ACTION={() => modals.chooseList.set(false)}
            IS_inAction={loading}
            initial_LIST={getValues("list")}
          />
          <CreateList_MODAL
            IS_open={modals.createList.IS_open}
            CLOSE_modal={() => modals.createList.toggle()}
          />
        </>
      }
    >
      <ChosenList_BLOCK
        name={getValues("list.name")}
        OPEN_chooseListModal={() => modals.chooseList.set(true)}
        error_MSG={formState?.errors?.list?.message}
      />
    </Small_MODAL>
  );
}

function ChosenList_BLOCK({
  name,
  OPEN_chooseListModal = () => {},
  error_MSG,
}: {
  name?: string;
  error_MSG?: string;
  OPEN_chooseListModal: () => void;
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: "yellow" }}>
      <Label styles={{ marginBottom: 10 }}>{t("label.chosenList")}</Label>
      <Btn
        text={name || "Select a list..."}
        iconRight={<ICON_dropdownArrow />}
        onPress={OPEN_chooseListModal}
        type="simple"
        style={[
          { flex: 1 },
          !!error_MSG && { borderColor: MyColors.border_red },
        ]}
        text_STYLES={{
          flex: 1,
          fontFamily: name ? "Nunito-Regular" : "Nunito-Light",
          color: name ? MyColors.text_white : MyColors.text_white_06,
        }}
      />
      {!!error_MSG && <Styled_TEXT type="text_error">{error_MSG}</Styled_TEXT>}
    </View>
  );
}
