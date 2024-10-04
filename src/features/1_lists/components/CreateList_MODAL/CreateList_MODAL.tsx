import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import { useTranslation } from "react-i18next";
import USE_createList from "../../hooks/USE_createList";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { List_MODEL, User_MODEL } from "@/src/db/models";
import { Controller, useForm } from "react-hook-form";

interface CreateListModal_PROPS {
  user: User_MODEL;
  IS_open: boolean;
  currentList_NAMES: string[];
  CLOSE_modal: () => void;
  onSuccess: (newList: List_MODEL) => void;
}

type NewList_PROPS = {
  name: string;
};

export default function CreateList_MODAL({
  user,
  IS_open,
  currentList_NAMES,
  CLOSE_modal,
  onSuccess,
}: CreateListModal_PROPS) {
  const { t } = useTranslation();
  const { CREATE_list, IS_creatingList, createList_ERROR, RESET_error } =
    USE_createList();
  const inputREF = useRef(null);

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
      user_id: user.id,
      currentList_NAMES,
      onSuccess: (newList) => {
        console.log("Before reset");
        onSuccess(newList);
        setTimeout(() => {
          // doesn't call for some reason without the timeout
          reset();
        }, 0);
        console.log("After reset");
      },
    });

    if (!newList.success) {
      console.log(newList.msg); // Log internal message for debugging.
    }
  };

  const HANLDE_toggle = () => {
    RESET_error();
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
            message: "Please provide a list name",
          },
          validate: {
            uniqueName: (value) =>
              !currentList_NAMES.includes(value.trim()) ||
              "This list name already exists.",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledText_INPUT
            onBlur={onBlur}
            SET_value={(val) => {
              onChange(val);
              RESET_error();
            }}
            value={value}
            error={!!errors.name || !!createList_ERROR}
            props={{ keyboardType: "default" }} // Changed to "default" for list names
            IS_errorCorrected={isSubmitted && !errors.name && !createList_ERROR}
            _ref={inputREF}
          />
        )}
        name="name"
      />
      {errors.name && <Error_TEXT>{errors.name.message}</Error_TEXT>}
      {createList_ERROR && <Error_TEXT>{createList_ERROR}</Error_TEXT>}
    </Small_MODAL>
  );
}
