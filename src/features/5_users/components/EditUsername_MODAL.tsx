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

import { useToast } from "react-native-toast-notifications";
import { Controller, useForm } from "react-hook-form";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";

import USE_zustand from "@/src/zustand";
import USE_editUsername from "../hooks/USE_editUsername";
import { sync } from "@/src/db/sync";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

interface modalProps {
  IS_open: boolean;
  CLOSE_modal: () => void;
  onSuccess?: () => void;
}

type props = {
  username: string;
};

export default function EditUsername_MODAL({
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
      await sync("all", z_user?.id);
      z_SET_user(z_user);
      HANLDE_toggle();
      if (onSuccess) onSuccess();

      // const newVocab = await db.write(async () => {
      //   const vocab = await Vocabs_DB.create((vocab: Vocab_MODEL) => {
      //     vocab.user_id = user_id;
      //     vocab.list_id = list_id;

      //     vocab.difficulty = difficulty || 3;
      //     vocab.description = description || "";

      //     vocab.trs = translations;
      //     vocab.lang_ids = translations?.map((t) => t.lang_id).join(",");
      //     vocab.searchable = translations?.map((t) => t.text).join(",");

      //     vocab.is_marked = false;
      //   });

      //   return vocab;
      // });
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
