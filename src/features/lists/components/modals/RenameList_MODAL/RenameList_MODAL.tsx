//
//
//

import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, TextInput } from "react-native";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";

import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";

import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { USE_renameList } from "@/src/features_new/lists/hooks/actions/USE_renameList/USE_renameList";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";

interface LogoutConfirmationModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
  HIGHLIGHT_listName: () => void;
}

export function RenameList_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
  HIGHLIGHT_listName = () => {},
}: LogoutConfirmationModal_PROPS) {
  const _ref = useRef<TextInput>(null);

  const { z_myOneList } = z_USE_myOneList();
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  const {
    control,
    formState: { errors, isSubmitted },
    reset: RESET_form,
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: z_myOneList?.name || "INSERT z_myOneList NAME",
    },
  });

  const { RENAME_list, IS_renamingList, renameList_ERROR, RESET_hookError } =
    USE_renameList();

  useEffect(() => {
    if (IS_open) {
      _ref.current?.focus();
    }
    RESET_form({ name: z_myOneList?.name || "" });
    setInvalidAttempts(0);
  }, [IS_open]);

  const rename = async (data: { name: string }) => {
    const { name } = data;

    await RENAME_list(z_myOneList?.id || "", name, {
      onSuccess: () => {
        CLOSE_modal();
        Keyboard.dismiss();
        HIGHLIGHT_listName();
      },
    });
  };

  return (
    <Small_MODAL
      {...{ IS_open }}
      TOGGLE_modal={CLOSE_modal}
      title={t("header.renameList")}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={CLOSE_modal}
          type="simple"
          style={{ flex: renameList_ERROR ? 1 : 0 }}
        />
      }
      btnRight={
        !renameList_ERROR ? (
          <Btn
            text={!IS_renamingList ? t("btn.confirmListRename") : ""}
            iconRight={
              IS_renamingList ? <ActivityIndicator color="black" /> : null
            }
            onPress={handleSubmit(rename)}
            type="action"
            style={{ flex: 1 }}
          />
        ) : null
      }
    >
      <Label>{t("label.editListName")}</Label>
      <Controller
        name="name"
        control={control}
        rules={{
          required: {
            value: true,
            message: t("error.provideAListName"),
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <StyledText_INPUT
            {...{
              _ref,
              value,
              isFocused,
              setIsFocused,
            }}
            HAS_error={!!error || !!renameList_ERROR}
            isSubmitted={isSubmitted && invalidAttempts > 0}
            SET_value={(val) => {
              onChange(val);
              RESET_hookError();
            }}
          />
        )}
      />
      {/* Error message from the from hook*/}
      {errors.name && <Error_TEXT text={errors.name.message} />}

      {/* Error message from the db*/}
      {renameList_ERROR ? (
        <Error_TEXT
          text={
            renameList_ERROR?.falsyForm_INPUTS?.[0]?.message ||
            renameList_ERROR?.user_MSG ||
            "Something went wrong"
          }
        />
      ) : null}
    </Small_MODAL>
  );
}
