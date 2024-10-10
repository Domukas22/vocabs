import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import USE_deleteVocab from "../../../hooks/USE_deleteVocab";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import { User_PROPS, Vocab_PROPS } from "@/src/db/props";
import USE_createVocab from "../../../hooks/USE_createVocab";
import { CreatePublicVocabData_PROPS } from "../CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";

interface PublishPrivateVocabAsAdmin_PROPS {
  user?: User_PROPS;
  IS_open: boolean;
  vocab: Vocab_PROPS | undefined;
  CLOSE_modal: () => void | undefined;
  onSuccess: () => void | undefined;
}

export default function PublishPrivateVocabAsAdmin_MODAL({
  user,
  IS_open = false,
  vocab = undefined,
  CLOSE_modal = () => {},
  onSuccess = () => {},
}: PublishPrivateVocabAsAdmin_PROPS) {
  const { t } = useTranslation();
  const { CREATE_vocab, IS_creatingVocab, RESET_dbError, db_ERROR } =
    USE_createVocab();

  const create = async () => {
    const result = await CREATE_vocab({
      user,
      list_id: undefined,
      difficulty: 3,
      description: vocab?.description || "",
      translations: vocab?.translations || [],
      is_public: true,
      onSuccess: () => {
        onSuccess();
        RESET_dbError();
      },
    });

    if (!result.success) {
      console.error(result.msg);
    }
  };

  return (
    <Small_MODAL
      title={t("header.publicPrivateVocabToPublicAsAdmin")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        if (!IS_creatingVocab) {
          RESET_dbError();
          CLOSE_modal();
        }
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_creatingVocab) {
              RESET_dbError();
              CLOSE_modal();
            }
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!IS_creatingVocab ? t("btn.confirmPublish") : ""}
          iconRight={
            IS_creatingVocab ? <ActivityIndicator color="black" /> : null
          }
          onPress={create}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {db_ERROR && <Error_TEXT>{db_ERROR}</Error_TEXT>}
    </Small_MODAL>
  );
}
