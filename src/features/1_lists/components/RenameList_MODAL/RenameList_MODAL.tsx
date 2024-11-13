//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator, TextInput } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import USE_renameList from "../../hooks/USE_renameList";

import { useToast } from "react-native-toast-notifications";
import { Controller, useForm } from "react-hook-form";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import VALIDATE_newListName from "../../utils/IS_listNameTaken";
import IS_listNameTaken from "../../utils/IS_listNameTaken";
import USE_zustand from "@/src/zustand";

interface LogoutConfirmationModal_PROPS {
  list: List_MODEL | undefined;
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: (updated_LIST?: List_MODEL) => void;
}

type NewListName_PROPS = {
  name: string;
};

export default function RenameList_MODAL({
  list,
  IS_open = false,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();
  const toast = useToast();
  const inputREF = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { z_user } = USE_zustand();

  const { RENAME_list, loading, RESET_error } = USE_renameList();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      name: list?.name || "",
    },
  });

  useEffect(() => {
    if (IS_open) {
      inputREF.current?.focus();
      setValue("name", list?.name || "");
    }
  }, [IS_open]);

  const rename = async (data: NewListName_PROPS) => {
    if (!list) return;
    const { name } = data;

    const { success, userError_MSG } = await RENAME_list({
      new_NAME: name,
      list,
      user: z_user,
    });

    if (success) {
      if (onSuccess) onSuccess();
      HANLDE_toggle();
    } else {
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

  const HANLDE_toggle = () => {
    RESET_error();
    CLOSE_modal();
    reset();
  };

  const onSubmit = (data: NewListName_PROPS) => rename(data);

  return (
    <Small_MODAL
      {...{ IS_open }}
      TOGGLE_modal={HANLDE_toggle}
      title={t("header.renameList")}
      btnLeft={
        <Btn text={t("btn.cancel")} onPress={HANLDE_toggle} type="simple" />
      }
      btnRight={
        <Btn
          text={!loading ? t("btn.confirmListRename") : ""}
          iconRight={loading ? <ActivityIndicator color="black" /> : null}
          onPress={handleSubmit(onSubmit)}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      <Label>{t("label.editListName")}</Label>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: t("error.provideAListName"),
          },
          validate: {
            uniqueName: async (value) => {
              const IS_listNameTaken =
                await z_user?.DOES_userHaveListWithThisName(value);
              return IS_listNameTaken ? t("error.listNameTaken") : true;
              // return true;
            },
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <StyledText_INPUT
            {...{ value, error, isSubmitted, isFocused, setIsFocused }}
            SET_value={(val) => {
              onChange(val);
              RESET_error();
            }}
            value={value}
            props={{ keyboardType: "default" }} // Changed to "default" for list names
            _ref={inputREF}
          />
        )}
        name="name"
      />
      {errors.name && <Error_TEXT text={errors.name.message} />}
    </Small_MODAL>
  );
}
