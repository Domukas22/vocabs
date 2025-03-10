//
//
//

import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import {
  USE_getOneTargetLang,
  USE_getAppLangId,
} from "@/src/features_new/languages/hooks";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { t } from "i18next";
import { useMemo } from "react";

export function VocabCardFront_TR({
  frontTrLang_ID = "en",
  vocab,
}: {
  frontTrLang_ID: string;
  vocab: Vocab_TYPE;
}) {
  const { trs = [] } = vocab;
  const { target_LANG } = USE_getOneTargetLang({
    targetLang_ID: frontTrLang_ID,
  });
  const { appLang_ID } = USE_getAppLangId();

  const frontTr_OBJ = useMemo(
    () =>
      trs?.find(
        (tr) =>
          tr.lang_id === frontTrLang_ID &&
          tr.text !== "" &&
          tr.text !== undefined &&
          tr.text !== null
      ),
    [trs, frontTrLang_ID]
  );

  return frontTr_OBJ?.text &&
    frontTr_OBJ?.lang_id &&
    frontTr_OBJ?.highlights ? (
    <Highlighted_TEXT
      text={frontTr_OBJ?.text}
      highlights={frontTr_OBJ?.highlights || []}
      diff={vocab.type === "private" ? vocab?.difficulty : 0}
    />
  ) : (
    <Label>
      {t("label.missingTranslation") +
        " " +
        target_LANG?.[`lang_in_${appLang_ID}`]}
    </Label>
  );
}
