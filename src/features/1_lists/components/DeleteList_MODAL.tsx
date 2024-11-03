//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import USE_deleteList from "../hooks/USE_deleteList";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

import { useToast } from "react-native-toast-notifications";
import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

interface DeleteListModal_PROPS {
  IS_open: boolean;
  list: List_MODEL | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess?: (deleted_LIST?: List_MODEL) => void | undefined;
}

export default function DeleteList_MODAL({
  IS_open = false,
  list = undefined,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: DeleteListModal_PROPS) {
  const { t } = useTranslation();
  // const { DELETE_list, IS_deletingList, error, RESET_error } = USE_deleteList();

  const del = async () => {
    await list?.DELETE_list();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Small_MODAL
      title={t("header.deleteList")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        // RESET_error();
        CLOSE_modal();
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            // RESET_error();
            CLOSE_modal();
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={t("btn.confirmDelete")}
          // iconRight={
          //   IS_deletingList ? <ActivityIndicator color="black" /> : null
          // }
          onPress={del}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {/* {error && <Error_TEXT text={error} />} */}
    </Small_MODAL>
  );
}
