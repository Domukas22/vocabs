//
//
//

import { delete_TYPE } from "@/src/types/general_TYPES";
import { memo } from "react";
import { View } from "react-native";
import { X_BTN, Delete_BTN } from "../../1_parts";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

type Props = {
  vocab: Vocab_TYPE;
  IS_deleting: boolean;
  delete_TYPE: delete_TYPE;
  TOGGLE_deleteConfirmation: () => void;
};

export const FinalDeleteBtn_WRAP = memo(
  ({
    vocab,
    IS_deleting = false,
    delete_TYPE = "soft",
    TOGGLE_deleteConfirmation = () => {},
  }: Props) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {!IS_deleting ? (
          <X_BTN onPress={() => TOGGLE_deleteConfirmation()} />
        ) : null}
        <Delete_BTN delete_TYPE={delete_TYPE} vocab={vocab} />
      </View>
    );
  }
);
