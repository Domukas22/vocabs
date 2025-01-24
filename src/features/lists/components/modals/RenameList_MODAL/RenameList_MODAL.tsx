//
//
//

import List_MODEL from "@/src/db/models/List_MODEL";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TextInput } from "react-native";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import { USE_zustand } from "@/src/hooks";

import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";

import {
  RenameList_ARGS,
  RenameList_DATA,
  RenameListError_PROPS,
} from "../../../functions/myLists/rename/types";
import { USE_async } from "@/src/hooks";
import { RENAME_list } from "../../../functions";
import { renameList_ERRS } from "../../../functions/myLists/rename/RENAME_list";

interface LogoutConfirmationModal_PROPS {
  list: List_MODEL | undefined;
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: () => void;
}

export function RenameList_MODAL({
  list,
  IS_open = false,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: LogoutConfirmationModal_PROPS) {
  const _ref = useRef<TextInput>(null);
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
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
      name: list?.name || "INSERT LIST NAME",
    },
  });

  const {
    loading,
    error,
    execute,
    RESET_errors: RESET_backendErrors,
  } = USE_async<RenameList_ARGS, RenameList_DATA, RenameListError_PROPS>({
    fn_NAME: "RENAME_list",
    fn: RENAME_list,
    onSuccess,
    defaultErr_MSG: renameList_ERRS.user.defaultInternal_MSG,
  });

  useEffect(() => {
    if (IS_open) {
      _ref.current?.focus();
    }
    RESET_form({ name: list?.name || "" });
    RESET_backendErrors();

    setInvalidAttempts(0);
  }, [IS_open]);

  useEffect(() => {
    error?.falsyForm_INPUTS?.forEach((err) => {
      setError(err.input_NAME, {
        type: "manual",
        message: err.message,
      });
    });
  }, [error]);

  const rename = async (data: { name: string }) => {
    const { name } = data;
    await execute({ new_NAME: name, list, user: z_user });
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
          style={error?.error_TYPE === "internal" && { flex: 1 }}
        />
      }
      btnRight={
        error?.error_TYPE !== "internal" && (
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
        rules={
          {
            // required: {
            //   value: true,
            //   message: t("error.provideAListName"),
            // },
            // validate: {
            //   uniqueName: async (value) => {
            //     const IS_theSameName = value === list?.name;
            //     if (IS_theSameName) return true;
            //     const IS_listNameTaken =
            //       await z_user?.DOES_userHaveListWithThisName(value);
            //     if (IS_listNameTaken) {
            //       setInvalidAttempts((p) => p + 1);
            //       return t("error.listNameTaken");
            //     }
            //     return true;
            //   },
            // },
          }
        }
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
              RESET_backendErrors();
            }}
          />
        )}
      />
      {errors.name && <Error_TEXT text={errors.name.message} />}
      {error && error?.error_TYPE !== "form_input" && (
        <Error_TEXT text={error.user_MSG} />
      )}
    </Small_MODAL>
  );
}
