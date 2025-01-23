import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ActivityIndicator } from "react-native";

import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_collectListLangs } from "@/src/features/lists/functions";
import { USE_deleteVocab } from "@/src/features/vocabs/functions";

interface DeleteVocabModal_PROPS {
  IS_open: boolean;
  vocab: Vocab_MODEL | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess: () => void | undefined;
}

export function DeleteVocab_MODAL({
  IS_open = false,
  vocab = undefined,
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
    let list_id = vocab?.list?.id;
    vocab?.DELETE_vocab("soft");
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
      {error && <Error_TEXT text={error} />}
    </Small_MODAL>
  );
}
