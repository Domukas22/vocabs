//
//
//

import { useTranslation } from "react-i18next";
import Simple_MODAL from "../../../../Simple_MODAL/Simple_MODAL";
import Btn from "../../../../../Basic/Btn/Btn";

interface DeleteVocabConfirmationModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  _delete: () => void;
}

export default function DeleteVocabConfirmation_MODAL({
  open,
  TOGGLE_open,
  _delete,
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
            text={t("btn.confirmVocabDelete")}
            onPress={_delete}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    ></Simple_MODAL>
  );
}
