//
//
//

import { useTranslation } from "react-i18next";
import Simple_MODAL from "../../../../Simple_MODAL/Simple_MODAL";
import Btn from "../../../../../Basic/Btn/Btn";
import { ActivityIndicator } from "react-native";

interface DeleteVocabConfirmationModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  _delete: () => void;
  IS_deleting: boolean;
}

export default function DeleteVocabConfirmation_MODAL({
  open,
  TOGGLE_open,
  _delete,
  IS_deleting,
}: DeleteVocabConfirmationModal_PROPS) {
  const { t } = useTranslation();

  return (
    <Simple_MODAL
      title={t("modal.deleteVocabConfirmation.header")}
      {...{
        open: open,
        toggle: TOGGLE_open,
        btnLeft: (
          <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
        ),
        btnRight: (
          <Btn
            text={!IS_deleting ? t("btn.confirmVocabDelete") : ""}
            iconRight={IS_deleting ? <ActivityIndicator color="black" /> : null}
            onPress={_delete}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    ></Simple_MODAL>
  );
}
