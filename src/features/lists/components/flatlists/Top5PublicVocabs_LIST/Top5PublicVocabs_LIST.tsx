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
import { z_USE_publicStarterContent } from "@/src/hooks/zustand/z_USE_publicStarterContent/z_USE_publicStarterContent";
import { Vocab_CARD } from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers";

export const Top5PublicVocabs_LIST = function Top5PublicVocabs_LIST() {
  const router = useRouter();

  const {
    z_IS_publicStarterInitialFetchDone,
    z_publicStarterTop5Vocabs,
    z_publicStarterTotalVocabCount,
  } = z_USE_publicStarterContent();

  if (!z_IS_publicStarterInitialFetchDone)
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
      <Label>{t("label.mostPopularVocabs")}</Label>
      {z_publicStarterTop5Vocabs?.map((vocab) => (
        <Vocab_CARD vocab={vocab} list_TYPE="public" fetch_TYPE="all" />
      ))}

      <Btn
        text={`See all ${z_publicStarterTotalVocabCount} public vocabs`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => {
          router.push("/(main)/explore/all_public_vocabs");
        }}
      />
    </Block>
  );
};
