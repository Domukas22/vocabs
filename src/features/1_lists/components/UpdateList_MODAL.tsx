//
//
//
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import { useTranslation } from "react-i18next";
import USE_updateList from "../hooks/USE_updateList";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { List_MODEL, User_MODEL } from "@/src/db/models";
import { Controller, useForm } from "react-hook-form";

interface UpdateListModal_PROPS {
  user: User_MODEL;
  IS_open: boolean;
  currentList: List_MODEL;
  currentList_NAMES: string[];
  CLOSE_modal: () => void;
  onSuccess: (updatedList: List_MODEL) => void;
}

type UpdateList_PROPS = {
  name: string;
};

export default function UpdateList_MODAL({
  user,
  IS_open,
  currentList,
  currentList_NAMES,
  CLOSE_modal,
  onSuccess,
}: UpdateListModal_PROPS) {
  const { t } = useTranslation();
  const { UPDATE_list, IS_updatingList, updateList_ERROR, RESET_error } =
    USE_updateList();
  const inputREF = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      name: currentList.name,
    },
  });

  useEffect(() => {
    if (IS_open) {
      inputREF.current?.focus();
    }
  }, [IS_open]);

  const update = async (data: UpdateList_PROPS) => {
    const { name } = data;
    const updatedList = await UPDATE_list({
      name,
      list_id: currentList.id,
      user_id: user.id,
      currentList_NAMES,
      onSuccess: (updatedList) => {
        onSuccess(updatedList);
        setTimeout(() => {
          reset({ name: updatedList.name });
        }, 0);
      },
    });

    if (!updatedList.success) {
      console.log(updatedList.msg); // Log internal message for debugging.
    }
  };

  const HANLDE_toggle = () => {
    RESET_error();
    CLOSE_modal();
    reset();
  };

  const onSubmit = (data: UpdateList_PROPS) => update(data);

  return (
    <Small_MODAL
      title={t("modal.listSettings.renameListModalTitle")}
      IS_open={IS_open}
      TOGGLE_modal={HANLDE_toggle}
      btnLeft={<Btn text={t("btn.cancel")} onPress={HANLDE_toggle} />}
      btnRight={
        <Btn
          text={!IS_updatingList ? t("btn.confirmListRename") : ""}
          iconRight={
            IS_updatingList ? <ActivityIndicator color="black" /> : null
          }
          type="action"
          style={{ flex: 1 }}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
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
            error={!!errors.name || !!updateList_ERROR}
            props={{ keyboardType: "default" }}
            IS_errorCorrected={isSubmitted && !errors.name && !updateList_ERROR}
            _ref={inputREF}
          />
        )}
        name="name"
      />
      {errors.name && <Error_TEXT>{errors.name.message}</Error_TEXT>}
      {updateList_ERROR && <Error_TEXT>{updateList_ERROR}</Error_TEXT>}
    </Small_MODAL>
  );
}
