import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import USE_deleteVocab from "../../../hooks/USE_deleteVocab";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { User_PROPS } from "@/src/db/props";
import db, { Vocabs_DB } from "@/src/db";

interface DeleteVocabModal_PROPS {
  user?: User_PROPS;
  IS_open: boolean;
  is_public?: boolean;
  vocab_id: string | undefined;
  list_id?: string | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess: () => void | undefined;
}

export default function DeleteVocab_MODAL({
  user,
  IS_open = false,
  is_public = false,
  vocab_id = undefined,
  list_id = undefined,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: DeleteVocabModal_PROPS) {
  const { t } = useTranslation();
  const { DELETE_vocab, IS_deletingVocab, error, RESET_error } =
    USE_deleteVocab();

  const del = async () => {
    await db.write(async () => {
      const vocab = await Vocabs_DB.find(vocab_id);
      await vocab.markAsDeleted();
    });
  };

  const handleDelete = async () => {
    const result = await DELETE_vocab({
      user,
      vocab_id: vocab_id || "",
      list_id,
      is_public: is_public || false,
      onSuccess,
    });

    if (!result.success) {
      console.log(result.msg); // Log internal message for debugging.
    }
  };

  return (
    <Small_MODAL
      title={t("modal.deleteVocabConfirmation.header")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        if (!IS_deletingVocab) {
          RESET_error();
          CLOSE_modal();
        }
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_deletingVocab) {
              RESET_error();
              CLOSE_modal();
            }
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!IS_deletingVocab ? t("btn.confirmDelete") : ""}
          iconRight={
            IS_deletingVocab ? <ActivityIndicator color="black" /> : null
          }
          onPress={del}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {error && <Error_TEXT>{error}</Error_TEXT>}
    </Small_MODAL>
  );
}
