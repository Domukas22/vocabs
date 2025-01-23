//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ActivityIndicator } from "react-native";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";

interface DeleteVocabModal_PROPS {
  error: string | null;
  IS_open: boolean;
  IS_copying: boolean;
  copy: () => Promise<void>;
  RESET_error: () => void | undefined;
  CLOSE_modal: () => void | undefined;
}

export function CopyListAndVocabs_MODAL({
  error = null,
  IS_open = false,
  IS_copying = false,
  copy = async () => {},
  RESET_error = () => {},
  CLOSE_modal = () => {},
}: DeleteVocabModal_PROPS) {
  const { t } = useTranslation();

  return (
    <Small_MODAL
      title={t("header.copyListAndVocabs")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        if (!IS_copying) {
          RESET_error();
          CLOSE_modal();
        }
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_copying) {
              RESET_error();
              CLOSE_modal();
            }
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!IS_copying ? t("btn.confirmListCopy") : ""}
          iconRight={IS_copying ? <ActivityIndicator color="black" /> : null}
          onPress={copy}
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      {error && <Error_TEXT text="error" />}
    </Small_MODAL>
  );
}
