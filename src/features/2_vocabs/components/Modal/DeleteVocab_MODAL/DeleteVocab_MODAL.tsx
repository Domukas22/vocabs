import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import USE_deleteVocab from "../../../hooks/USE_deleteVocab";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { User_MODEL } from "@/src/db/watermelon_MODELS";
import db, { Vocabs_DB } from "@/src/db";
import USE_collectListLangs from "@/src/features/1_lists/hooks/USE_collectListLangs";

interface DeleteVocabModal_PROPS {
  user?: User_MODEL;
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

  const {
    COLLECT_langs,
    IS_collectingLangs,
    collectLangs_ERROR,
    RESET_collectLangsError,
  } = USE_collectListLangs();

  const collectLangs = async (list_id: string | undefined) => {
    const updated_LIST = await COLLECT_langs({
      list_id,
    });
    if (!updated_LIST.success) {
      console.error(updated_LIST.msg); // Log internal message for debugging.
    }
  };

  const del = async () => {
    let list_id;
    await db.write(async () => {
      const vocab = await Vocabs_DB.find(vocab_id || "");
      list_id = vocab?.list?.id;
      await vocab.markAsDeleted();
    });
    if (onSuccess) {
      onSuccess();
      collectLangs(list_id);
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
