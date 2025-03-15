import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard } from "react-native";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import { useTranslation } from "react-i18next";

import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";

import List_MODEL from "@/src/db/models/List_MODEL";

import { USE_createList } from "@/src/features_new/lists/hooks/actions/USE_createList/USE_createList";
import { useToast } from "react-native-toast-notifications";
import { TOAST_FN_TYPE } from "@/src/hooks/USE_toast/USE_toast";

interface CreateListModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
}

type NewList_PROPS = {
  name: string;
};

export function CreateList_MODAL({
  IS_open,
  CLOSE_modal,
}: CreateListModal_PROPS) {
  const inputREF = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { t } = useTranslation();

  const { CREATE_list, IS_creatingList, createList_ERROR, RESET_hookError } =
    USE_createList();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (IS_open) inputREF.current?.focus();
  }, [IS_open]);

  const create = async (data: NewList_PROPS) => {
    const { name } = data;
    await CREATE_list(name, () => {
      CLOSE_modal();
      Keyboard.dismiss();
      reset();
    });
  };

  const HANLDE_toggle = () => {
    RESET_hookError();
    CLOSE_modal();
    reset();
  };

  const onSubmit = (data: NewList_PROPS) => create(data);

  return (
    <Small_MODAL
      title={t("btn.createList")}
      IS_open={IS_open}
      TOGGLE_modal={HANLDE_toggle}
      btnLeft={<Btn text={t("btn.cancel")} onPress={HANLDE_toggle} />}
      btnRight={
        <Btn
          text={!IS_creatingList ? t("btn.create") : ""}
          iconRight={
            IS_creatingList ? <ActivityIndicator color="black" /> : null
          }
          type="action"
          style={{ flex: 1 }}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      <Styled_TEXT type="label">{t("label.createList")}</Styled_TEXT>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: t("error.provideAListName"),
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <StyledText_INPUT
            {...{
              value,
              isSubmitted,
              isFocused,
              setIsFocused,
            }}
            HAS_error={!!error || !!createList_ERROR}
            SET_value={(val) => {
              onChange(val);
              RESET_hookError();
            }}
            value={value}
            props={{ keyboardType: "default" }} // Changed to "default" for list names
            _ref={inputREF}
          />
        )}
        name="name"
      />
      {/* Error message from the from hook*/}
      {errors.name && <Error_TEXT text={errors.name.message} />}

      {/* Error message from the db*/}
      {createList_ERROR && (
        <Error_TEXT
          text={
            createList_ERROR?.falsyForm_INPUTS?.[0]?.message ||
            createList_ERROR?.user_MSG ||
            "Something went wrong"
          }
        />
      )}
    </Small_MODAL>
  );
}
