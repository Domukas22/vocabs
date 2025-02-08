//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_dropdownArrow } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../../modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";

interface ListController_PROPS {
  control: Control<CreateMyVocabData_PROPS, any>;

  TOGGLE_listModal: () => void;
}

export function List_CONTROLLER({
  control,
  TOGGLE_listModal,
}: ListController_PROPS) {
  return (
    <Controller
      control={control}
      name="list"
      rules={{
        required: {
          value: true,
          message: "Please select a list",
        },
      }}
      render={({
        field: { value },
        fieldState: { error },
        formState: { isSubmitted },
      }) => (
        <Block>
          <Label>{t("label.chosenList")}</Label>
          <Btn
            text={value?.name || "Select a list..."}
            iconRight={<ICON_dropdownArrow />}
            onPress={TOGGLE_listModal}
            type="simple"
            style={[{ flex: 1 }, error && { borderColor: MyColors.border_red }]}
            text_STYLES={{
              flex: 1,
              fontFamily: value ? "Nunito-Regular" : "Nunito-Light",
              color: value ? MyColors.text_white : MyColors.text_white_06,
            }}
          />
          {isSubmitted && error && (
            <Styled_TEXT type="text_error">{error?.message}</Styled_TEXT>
          )}
        </Block>
      )}
    />
  );
}
