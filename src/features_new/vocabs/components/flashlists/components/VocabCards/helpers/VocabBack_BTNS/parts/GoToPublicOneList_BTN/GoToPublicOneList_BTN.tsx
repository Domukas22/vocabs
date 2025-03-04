//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { memo } from "react";

type props = {
  vocab: Vocab_TYPE;
};

export const GoToPublicOneList_BTN = memo(({ vocab }: props) => {
  const route = useRoute();
  const router = useRouter();

  const { z_user } = z_USE_user();
  const { z_FETCH_publicOneListById } = z_USE_publicOneList();

  return (
    <Btn
      type="simple"
      text={t("btn.goToListOfVocab")}
      iconRight={<ICON_arrow direction="right" />}
      text_STYLES={{ marginRight: "auto" }}
      onPress={() => {
        if (vocab?.list_id) {
          // prefetch list for next page
          z_FETCH_publicOneListById(
            vocab?.list_id,
            z_user?.id || "",
            "public",
            {}
          );

          // route to next page
          route.name === "index"
            ? router.push(`/(main)/explore/public_lists/${vocab?.list_id}`)
            : router.replace(`/(main)/explore/public_lists/${vocab?.list_id}`);
        }
      }}
    />
  );
});
