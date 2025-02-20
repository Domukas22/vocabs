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
import { MyList_BTN } from "@/src/features_new/lists/components/flashlists/components/MyList_BTN/MyList_BTN";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/z_USE_myOneList/z_USE_myOneList";

export const MyRecentLists_FLATLIST = function RecentlyUsedPrivateLists_LIST() {
  const { PUSH_router } = USE_routerPush();
  const { z_SET_myOneList } = z_USE_myOneList();

  const {
    z_IS_myStarterInitialFetchDone,
    z_myStarterTop3Lists,
    z_myStarterTotalListCount,
  } = z_USE_myStarterContent();

  if (!z_IS_myStarterInitialFetchDone)
    return (
      <Block styles={{ gap: 12 }}>
        <Label icon={<ActivityIndicator color={MyColors.icon_gray} />}>
          {t("label.loadingRecentLists")}
        </Label>
        <Skeleton_BLOCK />
        <Skeleton_BLOCK />
        <Skeleton_BLOCK />
      </Block>
    );

  return (
    <Block styles={{ gap: 12 }}>
      <Label>{t("label.recentLists")}</Label>
      {z_myStarterTop3Lists?.map((list) => (
        <MyList_BTN
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
        text={`See all ${z_myStarterTotalListCount} lists`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => PUSH_router("my-lists")}
      />
    </Block>
  );
};
