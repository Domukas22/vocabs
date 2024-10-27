//
//
//

import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";
import VocabCount_LABEL from "./VocabCount_LABEL";
import React from "react";
import { children } from "@nozbe/watermelondb/decorators";

export default function ListBtn_TOP({
  name = "INSERT LIST NAME",
  description,
  owner_USERNAME,
  IS_shared = false,
  IS_submitted = false,
  vocab_COUNT = 0,
  children,
}: {
  name: string | undefined;
  description: string | undefined;
  owner_USERNAME?: string | undefined;
  IS_shared?: boolean;
  IS_submitted?: boolean;
  vocab_COUNT: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 12,
        paddingHorizontal: 14,
      }}
    >
      {children && children}
    </View>
  );
}
