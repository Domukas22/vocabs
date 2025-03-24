//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { useRouter } from "expo-router";
import React from "react";

import { t } from "i18next";
import { ActivityIndicator } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { Vocab_CARD } from "@/src/features_new/vocabs/components/flashlists/_parts/Vocab_CARD/Vocab_CARD";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function TopPublicVocabs_LIST({
  top_VOCABS = [],
  totalVocab_COUNT = 0,
  loading = "initial",
  OPEN_saveVocabModal = () => {},
}: {
  top_VOCABS: Vocab_TYPE[];
  totalVocab_COUNT: number;
  loading: starterContentLoading_TYPE;
  OPEN_saveVocabModal: () => void;
}) {
  const router = useRouter();

  if (loading === "initial")
    return (
      <Block styles={{ gap: 12 }}>
        <Label icon={<ActivityIndicator color={MyColors.icon_gray} />}>
          {t("label.loadingPopularVocabs")}
        </Label>
        <Skeleton_BLOCK height={100} />
        <Skeleton_BLOCK height={100} />
        <Skeleton_BLOCK height={100} />
        <Skeleton_BLOCK height={100} />
        <Skeleton_BLOCK height={100} />
      </Block>
    );

  return (
    <Block styles={{ gap: 12 }}>
      <Styled_TEXT type="text_22_bold">
        {t("label.mostPopularVocabs")}
      </Styled_TEXT>
      {top_VOCABS?.map((vocab) => (
        <Vocab_CARD
          key={vocab?.id}
          vocab={vocab}
          list_TYPE="public"
          fetch_TYPE="all"
          OPEN_vocabCopyModal={OPEN_saveVocabModal}
        />
      ))}

      <Btn
        text={`${t("btn.seeAllPublicVocabs_PRE")} ${totalVocab_COUNT} ${t(
          "btn.seeAllPublicVocabs_POST"
        )}`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => {
          router.push("/(main)/explore/all_public_vocabs");
        }}
      />
    </Block>
  );
}
