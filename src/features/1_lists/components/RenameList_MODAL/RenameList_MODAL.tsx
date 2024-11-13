//
//
//

import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, TextInput } from "react-native";

import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import USE_zustand from "@/src/zustand";
import USE_renameList from "../../hooks/USE_renameList";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";

interface LogoutConfirmationModal_PROPS {
  list: List_MODEL | undefined;
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: (updated_LIST?: List_MODEL) => void;
}

export default function RenameList_MODAL({
  list,
  IS_open = false,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const _ref = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  const { RENAME_list, loading, RESET_error, HAS_internalError } =
    USE_renameList();

  const HIDE_actionBtn = useMemo(() => HAS_internalError, [HAS_internalError]);

  const {
    control,
    formState: { errors, isSubmitted },
    reset,
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: list?.name || "INSERT LIST NAME",
    },
  });

  const rename = async (data: { name: string }) => {
    if (!list) return;

    const { name } = data;
    const { success, userError_MSG } = await RENAME_list({
      new_NAME: name,
      list,
      user: z_user,
    });

    if (success) {
      CLOSE_modal();
      if (onSuccess) onSuccess();
    } else {
      Keyboard.dismiss();
      setError(
        "name",
        {
          type: "manual",
          message: userError_MSG || "Failed to rename the list",
        },
        { shouldFocus: true }
      );
    }
  };

  useEffect(() => {
    if (IS_open) {
      _ref.current?.focus();
    }
    reset({ name: list?.name || "" });
    setInvalidAttempts(0);
    RESET_error();
  }, [IS_open]);

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
          style={HIDE_actionBtn && { flex: 1 }}
        />
      }
      btnRight={
        !HIDE_actionBtn && (
          <Btn
            text={!loading ? t("btn.confirmListRename") : ""}
            iconRight={loading ? <ActivityIndicator color="black" /> : null}
            onPress={handleSubmit(rename)}
            type="action"
            style={{ flex: 1 }}
          />
        )
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
          validate: {
            uniqueName: async (value) => {
              const IS_theSameName = value === list?.name;
              if (IS_theSameName) return true;

              const IS_listNameTaken =
                await z_user?.DOES_userHaveListWithThisName(value);

              if (IS_listNameTaken) {
                setInvalidAttempts((p) => p + 1);
                return t("error.listNameTaken");
              }

              return true;
            },
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <StyledText_INPUT
            {...{
              _ref,
              error,
              value,
              isFocused,
              setIsFocused,
            }}
            isSubmitted={isSubmitted && invalidAttempts > 0}
            SET_value={(val) => {
              onChange(val);
              RESET_error();
            }}
          />
        )}
      />
      {errors.name && <Error_TEXT text={errors.name.message} />}
    </Small_MODAL>
  );
}
