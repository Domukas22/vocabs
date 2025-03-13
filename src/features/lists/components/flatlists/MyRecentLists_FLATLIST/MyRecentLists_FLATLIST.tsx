//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { router } from "expo-router";
import React from "react";

import { z_USE_myStarterContent } from "@/src/hooks/zustand/z_USE_myStarterContent/z_USE_myStarterContent";
import { t } from "i18next";
import { ActivityIndicator } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { USE_routerPush } from "@/src/hooks";
import { List_CARD } from "@/src/features_new/lists/components/flashlists/components/List_CARD/List_CARD";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export const MyRecentLists_FLATLIST = function RecentlyUsedPrivateLists_LIST() {
  const { PUSH_router } = USE_routerPush();
  const { z_SET_myOneList } = z_USE_myOneList();

  const {
    z_IS_myStarterInitialFetchDone,
    z_myStarterTop4Lists,
    z_myStarterTotalListCount,
  } = z_USE_myStarterContent();

  if (!z_IS_myStarterInitialFetchDone)
    return (
      <Block styles={{ gap: 12 }}>
        <Label icon={<ActivityIndicator color={MyColors.icon_gray} />}>
          {t("label.loadingRecentLists")}
        </Label>
        <Skeleton_BLOCK height={80} />
        <Skeleton_BLOCK height={80} />
        <Skeleton_BLOCK height={80} />
      </Block>
    );

  return (
    <Block styles={{ gap: 12 }}>
      <Styled_TEXT type="text_22_bold">{t("label.myLists")}</Styled_TEXT>
      {/* <Label>{t("label.recentLists")}</Label> */}
      {z_myStarterTop4Lists?.map((list) => (
        <List_CARD
          key={list.id}
          list={list}
          highlighted={false}
          onPress={() => {
            z_SET_myOneList(list);
            router.push(`/(main)/vocabs/${list.id}`);
          }}
        />
      ))}

      <Btn
        // text={`See all ${z_myStarterTotalListCount} lists`}
        text={`${t("btn.seeAllMyLists_PRE")} ${z_myStarterTotalListCount} ${t(
          "btn.seeAllMyLists_POST"
        )}`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => PUSH_router("my-lists")}
      />
    </Block>
  );
};
