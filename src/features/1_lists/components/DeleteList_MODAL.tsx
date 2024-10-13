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
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

interface DeleteListModal_PROPS {
  user_id: string | undefined;
  IS_open: boolean;
  list_id: string | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess?: (deleted_LIST?: List_MODEL) => void | undefined;
}

export default function DeleteList_MODAL({
  user_id,
  IS_open = false,
  list_id = undefined,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: DeleteListModal_PROPS) {
  const { t } = useTranslation();
  const { DELETE_list, IS_deletingList, error, RESET_error } = USE_deleteList();

  const del = async () => {
    await db.write(async () => {
      const list = await Lists_DB.find(list_id || "");

      const vocabs = await Vocabs_DB.query(Q.where("list_id", list?.id));

      vocabs?.forEach(async (v) => {
        await v.markAsDeleted();
      });

      await list.markAsDeleted();
    });
    if (onSuccess) onSuccess();
  };

  return (
    <Small_MODAL
      title={t("header.deleteList")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        if (!IS_deletingList) {
          RESET_error();
          CLOSE_modal();
        }
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_deletingList) {
              RESET_error();
              CLOSE_modal();
            }
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!IS_deletingList ? t("btn.confirmDelete") : ""}
          iconRight={
            IS_deletingList ? <ActivityIndicator color="black" /> : null
          }
          onPress={del}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {error && <Error_TEXT text={error} />}
    </Small_MODAL>
  );
}
