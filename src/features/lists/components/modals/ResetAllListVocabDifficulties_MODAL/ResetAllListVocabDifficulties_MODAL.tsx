//
//
//
import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { ActivityIndicator } from "react-native";
import { USE_resetVocabDifficultiesOfAList } from "@/src/features_new/lists/hooks/actions/USE_resetVocabDifficultiesOfAList/USE_resetVocabDifficultiesOfAList";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";

interface props {
  IS_open: boolean;
  CLOSE_modal: () => void;
  refetch: () => void;
}

export function ResetAllListVocabDifficulties_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
  refetch = () => {},
}: props) {
  const { t } = useTranslation();
  const { z_myOneList } = z_USE_myOneList();

  const {
    RESET_allDifficultiesOfAList,
    loading: IS_resettingAllListDifficulties,
    db_ERROR: resetAllListDifficulties_ERROR,
  } = USE_resetVocabDifficultiesOfAList();

  return (
    <Small_MODAL
      title={t("header.resetListVocabDifficulties")}
      IS_open={IS_open}
      TOGGLE_modal={() => {
        // RESET_error();
        CLOSE_modal();
      }}
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            CLOSE_modal();
          }}
          type="simple"
        />
      }
      btnRight={
        <Btn
          text={!IS_resettingAllListDifficulties ? t("btn.confirmDelete") : ""}
          iconRight={
            IS_resettingAllListDifficulties ? (
              <ActivityIndicator color="black" />
            ) : null
          }
          onPress={() =>
            RESET_allDifficultiesOfAList(z_myOneList?.id || "", {
              onSuccess: () => {
                CLOSE_modal();
                refetch();
              },
            })
          }
          type="action"
          style={{ flex: 1 }}
        />
      }
    >
      <Styled_TEXT style={{ color: MyColors.text_yellow }}>
        {t("confirmation.paragraph.resetAllVocabDifficultiesInAList")}
      </Styled_TEXT>
      {resetAllListDifficulties_ERROR ? (
        <Error_TEXT
          text={
            resetAllListDifficulties_ERROR?.user_MSG || "Something went wrong"
          }
        />
      ) : null}
    </Small_MODAL>
  );
}
