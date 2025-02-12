//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ActivityIndicator, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";

import { Controller, useForm } from "react-hook-form";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import { USE_zustand } from "@/src/hooks";
import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import { USE_editUsername } from "@/src/features/users/functions";

interface modalProps {
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: () => void;
}

type props = {
  username: string;
};

export function EditUsername_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: modalProps) {
  const { t } = useTranslation();
  const { z_user, z_SET_user } = USE_zustand();

  const inputREF = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      username: z_user?.username || "INSERT USERNAME",
    },
  });

  useEffect(() => {
    if (IS_open) {
      inputREF.current?.focus();
      setValue("username", z_user?.username || "INSERT USERNAME");
    }
  }, [IS_open]);

  const { EDIT_username, loading, error, RESET_error } = USE_editUsername();

  const { sync: sync_2 } = USE_sync();

  const SUBMIT = async (data: props) => {
    const { username } = data;
    const result = await EDIT_username({
      current_USERNAME: z_user?.username,
      new_USERNAME: username,
      user_id: z_user?.id,
    });

    if (!result?.success) {
      console.error(result?.msg); // Log internal message for debugging.
    } else if (result.user) {
      await sync_2({ user: z_user });

      HANLDE_toggle();
      if (onSuccess) onSuccess();
    }
  };

  const HANLDE_toggle = () => {
    RESET_error();
    CLOSE_modal();
    reset();
  };

  const onSubmit = (data: props) => SUBMIT(data);

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
        name="username"
        control={control}
        rules={{
          required: {
            value: true,
            message: "Please provide a username",
          },
          minLength: {
            value: 6,
            message: "USername must be at least 6 characters long",
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
      />
      {errors.username && <Error_TEXT text={errors.username.message} />}
      {error && <Error_TEXT text={error} />}
    </Small_MODAL>
  );
}
