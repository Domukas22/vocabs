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
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";
import { List_CARD } from "@/src/features_new/lists/components/flashlists/components/List_CARD/List_CARD";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { List_TYPE } from "@/src/features_new/lists/types";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";

export function PopularPublicLists_LIST({
  top_LISTS = [],
  totalList_COUNT = 0,
  loading = "initial",
}: {
  top_LISTS: List_TYPE[];
  totalList_COUNT: number;
  loading: starterContentLoading_TYPE;
}) {
  const router = useRouter();
  const { z_SET_publicOneList } = z_USE_publicOneList();

  if (loading === "initial")
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
      <Styled_TEXT type="text_22_bold">
        {t("label.mostPopularLists")}
      </Styled_TEXT>
      {top_LISTS?.map((list) => (
        <List_CARD
          key={list.id}
          list={list}
          onPress={() => {
            z_SET_publicOneList(list);
            router.push(`/(main)/explore/public_lists/${list.id}`);
          }}
        />
      ))}

      <Btn
        text={`${t("btn.seeAllPublicLists_PRE")} ${totalList_COUNT} ${t(
          "btn.seeAllPublicLists_POST"
        )}`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => {
          router.push("/(main)/explore/public_lists");
        }}
      />
    </Block>
  );
}
