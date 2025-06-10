//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_arrow2,
  ICON_checkMark,
} from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import { View } from "react-native";

export function MyDailyGoal_BLOCK() {
  const dailyGoal = 10;

  const current = 2;

  return (
    <Block>
      <View style={{ marginBottom: 6 }}>
        <Styled_TEXT type="title">{t("label.myDailyGoal")}</Styled_TEXT>
        <Styled_TEXT type="label">
          {t("label.noVocabsLearnedToday")}
        </Styled_TEXT>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Styled_TEXT
          type="text_18_bold"
          style={{
            color: MyColors.text_primary,
          }}
        >
          {current}
        </Styled_TEXT>
        <DailyGoalLine_WRAP goal={dailyGoal} current={current} />
        <Styled_TEXT
          type="text_18_bold"
          style={{
            color: MyColors.text_white_06,
          }}
        >
          {dailyGoal}
        </Styled_TEXT>
      </View>
      <Btn
        text="Schnell 8 Vokabel lernen"
        iconRight={<ICON_arrow2 direction="right" color="white" />}
        text_STYLES={{ flex: 1 }}
        style={{ marginTop: 8 }}
      />
    </Block>
  );
}

function DailyGoalLine_WRAP({
  goal = 0,
  current = 0,
}: {
  goal: number;
  current: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        paddingHorizontal: 12,
        position: "relative",
        alignItems: "center",
      }}
    >
      <DailyGoal_LINE goal={goal} current={current} />
      {/* Circle wrap */}
      <View
        style={{
          position: "absolute",

          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {Array.from({ length: goal }).map((_, index) => {
          const state =
            index === current
              ? "highlighted"
              : current > index
              ? "completed"
              : "empty";

          return <DailyGoal_CIRCLE key={index} state={state} />;
        })}
      </View>
    </View>
  );
}

function DailyGoal_CIRCLE({
  state = "empty",
}: {
  state: "highlighted" | "completed" | "empty";
}) {
  const size = 24;
  const bgColor =
    state === "completed"
      ? MyColors.icon_primary
      : state === "empty"
      ? MyColors.btn_2
      : MyColors.btn_active_press;
  const borderColor =
    state === "highlighted"
      ? MyColors.border_primary
      : MyColors.border_white_005;

  return (
    <View
      style={{
        height: size,
        width: size,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: bgColor,
        borderColor: MyColors.border_white_005,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {state === "completed" && (
        <ICON_checkMark
          color="black"
          size="teenyTiny"
          style={{ marginRight: 1 }}
        />
      )}
      {state === "highlighted" && (
        <View
          style={{
            backgroundColor: MyColors.icon_primary,
            width: 8,
            height: 8,
            borderRadius: 50,
          }}
        />
      )}
    </View>
  );
}

function DailyGoal_LINE({
  goal = 5,
  current = 0,
}: {
  goal: number;
  current: number;
}) {
  // Adjusted goal to ensure correct step-based progress calculation
  const adjustedGoal = goal - 1; // We subtract 1 because progress starts at step 2, not step 1

  // Calculate the width of the primary progress line
  const progress =
    current > 1
      ? ((current - 1) / adjustedGoal) * 100 // Starts increasing from step 2
      : 0; // If current is 0 or 1, keep the width at 0%

  // Calculate the width of the sub-primary (next step) progress line
  const nextProgress =
    current >= 0
      ? (current / adjustedGoal) * 100 // Always one step ahead of primary
      : 25; // Ensures it starts at 25% for current = 0

  return (
    <View
      style={{
        borderRadius: 10,
        height: 6,
        flex: 1, // Responsive width
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background line */}
      <View
        style={{
          backgroundColor: MyColors.btn_2,
          borderWidth: 1,
          borderColor: MyColors.border_white_005,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      {/* Sub-Primary line (next step) */}
      <View
        style={{
          backgroundColor: MyColors.btn_active_press,
          borderWidth: 1,
          borderColor: MyColors.border_white_005,
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${Math.min(nextProgress, 100)}%`, // Clamp at 100%
        }}
      />

      {/* Primary line (current progress) */}
      <View
        style={{
          backgroundColor: MyColors.icon_primary,
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${progress}%`,
        }}
      />
    </View>
  );
}
