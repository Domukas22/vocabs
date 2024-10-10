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
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { Controller, useForm } from "react-hook-form";
import { List_MODEL } from "@/src/db/props";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import VALIDATE_newListName from "../../utils/IS_listNameTaken";
import IS_listNameTaken from "../../utils/IS_listNameTaken";

interface LogoutConfirmationModal_PROPS {
  list_id: string | undefined;
  user_id: string | undefined;
  current_NAME: string | undefined;
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: (updated_LIST?: List_MODEL) => void;
}

type NewListName_PROPS = {
  name: string;
};

export default function RenameList_MODAL({
  list_id,
  user_id,
  IS_open = false,
  current_NAME = "INSERT NEW NAME",
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();
  const toast = useToast();
  const inputREF = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { z_lists } = USE_zustand();
  const { RENAME_list, IS_renamingList, renameList_ERROR, RESET_error } =
    USE_renameList();

  const currentList_NAMES = useMemo(
    () => z_lists?.map((l) => l.name),
    [z_lists]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: current_NAME,
    },
  });

  useEffect(() => {
    if (IS_open) {
      inputREF.current?.focus();
      setValue("name", current_NAME || "");
    }
  }, [IS_open]);

  const rename = async (data: NewListName_PROPS) => {
    const { name } = data;
    const newList = await RENAME_list({
      newName: name,
      user_id,
      list_id,
      currentList_NAMES,
      onSuccess,
      cleanup: HANLDE_toggle,
    });

    if (!newList.success) {
      console.error(newList.msg); // Log internal message for debugging.
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
          text={!IS_renamingList ? t("btn.confirmListRename") : ""}
          iconRight={
            IS_renamingList ? <ActivityIndicator color="black" /> : null
          }
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
            uniqueName: (value) => {
              const IS_nameTaken = IS_listNameTaken({
                lists: z_lists,
                name: value,
                list_id,
              });

              return IS_nameTaken ? t("error.listNameTaken") : true;
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
      {renameList_ERROR && <Error_TEXT text={renameList_ERROR} />}
    </Small_MODAL>
  );
}
