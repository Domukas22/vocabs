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
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";
import { List_CARD } from "@/src/features_new/lists/components/flashlists/components/List_CARD/List_CARD";

export const PopularPublicLists_LIST = function PopularPublicLists_LIST() {
  const router = useRouter();
  const { z_SET_publicOneList } = z_USE_publicOneList();

  const {
    z_IS_publicStarterInitialFetchDone,
    z_publicStarterTop5Lists,
    z_publicStarterTotalListCount,
  } = z_USE_publicStarterContent();

  if (!z_IS_publicStarterInitialFetchDone)
    return (
      <Block styles={{ gap: 12 }}>
        <Label icon={<ActivityIndicator color={MyColors.icon_gray} />}>
          {t("label.loadingPopularLists")}
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
      {z_publicStarterTop5Lists?.map((list) => (
        <List_CARD
          key={list.id}
          list={list}
          list_TYPE="public"
          onPress={() => {
            z_SET_publicOneList(list);
            router.push(`/(main)/explore/public_lists/${list.id}`);
          }}
        />
      ))}

      <Btn
        text={`See all ${z_publicStarterTotalListCount} public lists`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => {
          router.push("/(main)/explore/public_lists");
        }}
      />
    </Block>
  );
};
