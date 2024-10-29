import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import { useTranslation } from "react-i18next";
import USE_createList from "../../hooks/USE_createList";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import IS_listNameTaken from "../../utils/IS_listNameTaken";

import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import db, { Lists_DB, Users_DB } from "@/src/db";
import { USER_ID } from "@/src/constants/globalVars";
import USE_collectListLangs from "../../hooks/USE_collectListLangs";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

interface CreateListModal_PROPS {
  user_id: string | undefined;
  IS_open: boolean;
  currentList_NAMES?: string[];
  CLOSE_modal: () => void;
  onSuccess: (newList: List_MODEL) => void;
}

type NewList_PROPS = {
  name: string;
};

export default function CreateList_MODAL({
  user_id,
  IS_open,
  currentList_NAMES,
  CLOSE_modal,
  onSuccess,
}: CreateListModal_PROPS) {
  const inputREF = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { t } = useTranslation();
  const {
    CREATE_list,
    IS_creatingList,
    createList_ERROR,
    RESET_createListError,
  } = USE_createList();

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
    if (IS_open) {
      inputREF.current?.focus();
    }
  }, [IS_open]);

  const create = async (data: NewList_PROPS) => {
    const { name } = data;
    const newList = await CREATE_list({
      name,
      description: "",
      user_id: user_id,
      currentList_NAMES,
      onSuccess: (new_LIST: List_MODEL) => {
        onSuccess(new_LIST);
      },
      cleanup: () => {
        setTimeout(() => {
          // doesn't call for some reason without the timeout
          HANLDE_toggle();
        }, 0);
      },
    });

    if (!newList.success) {
      console.error(newList.msg); // Log internal message for debugging.
    }
  };

  const HANLDE_toggle = () => {
    RESET_createListError();
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
          validate: {
            uniqueName: (value) => {
              const IS_nameTaken = IS_listNameTaken({
                lists: [],
                name: value,
                list_id: "new",
              });

              return IS_nameTaken ? t("error.listNameTaken") : true;
            },
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <StyledText_INPUT
            {...{ value, error, isSubmitted, isFocused, setIsFocused }}
            SET_value={(val) => {
              onChange(val);
              RESET_createListError();
            }}
            value={value}
            props={{ keyboardType: "default" }} // Changed to "default" for list names
            _ref={inputREF}
          />
        )}
        name="name"
      />
      {errors.name && <Error_TEXT text={errors.name.message} />}
      {createList_ERROR && <Error_TEXT text={createList_ERROR} />}
    </Small_MODAL>
  );
}
