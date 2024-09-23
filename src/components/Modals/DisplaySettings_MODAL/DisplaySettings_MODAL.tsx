//
//
//

import Btn from "../../Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import {
  ICON_calendar,
  ICON_difficultyDot,
  ICON_shuffle,
  ICON_X,
} from "@/src/components/icons/icons";
import Block from "@/src/components/Block/Block";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Modal, SafeAreaView, ScrollView, View } from "react-native";
import Settings_TOGGLE from "../../Settings_TOGGLE/Settings_TOGGLE";
import Vocab_FRONT from "../../Vocab/components/Vocab_FRONT/Vocab_FRONT";
import { DisplaySettings_MODEL } from "@/src/db/models";
import Label from "../../Label/Label";
import { useTranslation } from "react-i18next";

interface DisplaySettingsModal_PROPS {
  displaySettings: DisplaySettings_MODEL;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettings_MODEL>
  >;
  open: boolean;
  TOGGLE_open: () => void;
}

export default function DisplaySettings_MODAL({
  open,
  TOGGLE_open,
  displaySettings,
  SET_displaySettings,
}: DisplaySettingsModal_PROPS) {
  const { t } = useTranslation();

  function toggle(
    propName: "image" | "listName" | "desc" | "flags" | "difficulty"
  ) {
    switch (propName) {
      case "image":
        SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          SHOW_image: !p.SHOW_image,
        }));
        break;
      case "listName":
        SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          SHOW_listName: !p.SHOW_listName,
        }));
        break;
      case "desc":
        SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          SHOW_description: !p.SHOW_description,
        }));
        break;
      case "flags":
        SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          SHOW_flags: !p.SHOW_flags,
        }));
        break;
      case "difficulty":
        SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          SHOW_difficulty: !p.SHOW_difficulty,
        }));
        break;
    }
  }

  function FILTER_difficulty(difficulty: 1 | 2 | 3) {
    displaySettings?.difficultyFilters.includes(difficulty)
      ? SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          difficultyFilters: p.difficultyFilters.filter(
            (d) => d !== difficulty
          ),
        }))
      : SET_displaySettings((p: DisplaySettings_MODEL) => ({
          ...p,
          difficultyFilters: [...p.difficultyFilters, difficulty],
        }));
  }

  return (
    <Modal animationType="slide" transparent={true} visible={open} style={{}}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,
          flex: 1,
        }}
      >
        <Header
          title={t("modal.displaySettings.header")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_open}
              style={{ borderRadius: 100 }}
            />
          }
        />

        <ScrollView style={{ flex: 1 }}>
          <Block row={false}>
            <Label>{t("modal.displaySettings.label.sorting")}</Label>
            {/* <Btn
              text="Shuffle vocabs"
              iconRight={
                <ICON_shuffle
                  color={displaySettings?.sorting === "shuffle" ? "primary" : "grey_light"}
                />
              }
              onPress={() =>
                SET_displaySettings((p) => ({ ...p, sorting: "shuffle" }))
              }
              type={displaySettings?.sorting === "shuffle" ? "active" : "simple"}
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            /> */}
            <Btn
              text={t("btn.sortByDifficulty")}
              iconRight={
                <ICON_difficultyDot
                  big={true}
                  difficulty={displaySettings?.sorting === "difficulty" ? 0 : 1}
                />
              }
              onPress={() =>
                SET_displaySettings((p) => ({ ...p, sorting: "difficulty" }))
              }
              type={
                displaySettings?.sorting === "difficulty" ? "active" : "simple"
              }
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
            <Btn
              text={t("btn.sortByDate")}
              iconRight={
                <ICON_calendar
                  color={
                    displaySettings?.sorting === "date" ? "primary" : "grey"
                  }
                />
              }
              onPress={() =>
                SET_displaySettings((p) => ({ ...p, sorting: "date" }))
              }
              type={displaySettings?.sorting === "date" ? "active" : "simple"}
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
            {/* {displaySettings?.sorting === "shuffle" && (
              <Btn
                text="Re-shuffle vocabs"
                iconRight={<ICON_shuffle color={"grey"} />}
                onPress={() => {}}
                type={"seethrough"}
                style={{ flex: 1 }}
                text_STYLES={{ flex: 1 }}
              />
            )} */}
            {(displaySettings?.sorting === "difficulty" ||
              displaySettings?.sorting === "date") && (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Btn
                  text={
                    displaySettings?.sorting === "difficulty"
                      ? t("btn.easyToHard")
                      : t("btn.newToOld")
                  }
                  onPress={() =>
                    SET_displaySettings((p) => ({
                      ...p,
                      sortDirection: "ascending",
                    }))
                  }
                  type={
                    displaySettings?.sortDirection === "ascending"
                      ? "difficulty_1_active"
                      : "simple"
                  }
                  style={{ flex: 1 }}
                />
                <Btn
                  text={
                    displaySettings?.sorting === "difficulty"
                      ? t("btn.hardToEasy")
                      : t("btn.oldToNew")
                  }
                  onPress={() =>
                    SET_displaySettings((p) => ({
                      ...p,
                      sortDirection: "descending",
                    }))
                  }
                  type={
                    displaySettings?.sortDirection === "descending"
                      ? "difficulty_1_active"
                      : "simple"
                  }
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </Block>
          <Block row={false}>
            <Label>{t("label.filterByDifficulty")}</Label>
            <Btn
              text={t("difficulty.easy")}
              iconRight={
                displaySettings?.difficultyFilters.includes(1) ? (
                  <ICON_X big={true} rotate={true} color="difficulty_1" />
                ) : (
                  <ICON_difficultyDot big={true} difficulty={1} />
                )
              }
              onPress={() => FILTER_difficulty(1)}
              type={
                displaySettings?.difficultyFilters.includes(1)
                  ? "difficulty_1_active"
                  : "simple"
              }
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
            <Btn
              text={t("difficulty.medium")}
              iconRight={
                displaySettings?.difficultyFilters.includes(2) ? (
                  <ICON_X big={true} rotate={true} color="difficulty_2" />
                ) : (
                  <ICON_difficultyDot big={true} difficulty={2} />
                )
              }
              onPress={() => FILTER_difficulty(2)}
              type={
                displaySettings?.difficultyFilters.includes(2)
                  ? "difficulty_2_active"
                  : "simple"
              }
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
            <Btn
              text={t("difficulty.hard")}
              iconRight={
                displaySettings?.difficultyFilters.includes(3) ? (
                  <ICON_X big={true} rotate={true} color="difficulty_3" />
                ) : (
                  <ICON_difficultyDot big={true} difficulty={3} />
                )
              }
              onPress={() => FILTER_difficulty(3)}
              type={
                displaySettings?.difficultyFilters.includes(3)
                  ? "difficulty_3_active"
                  : "simple"
              }
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
            />
          </Block>

          <Block>
            <Label>{t("label.vocabPreview")}</Label>
            <View style={{ gap: 12 }}>
              <View
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: MyColors.border_white_005,
                }}
              >
                <Vocab_FRONT
                  displaySettings={displaySettings}
                  disablePressAnimation={true}
                  dummy={true}
                />
              </View>
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: MyColors.border_white_005,
                  overflow: "hidden",
                }}
              >
                <Settings_TOGGLE
                  text={t("toggle.showImage")}
                  active={displaySettings?.SHOW_image}
                  onPress={() => {
                    toggle("image");
                  }}
                />
                <Settings_TOGGLE
                  text={t("toggle.showListName")}
                  active={displaySettings?.SHOW_listName}
                  onPress={() => {
                    toggle("listName");
                  }}
                />
                <Settings_TOGGLE
                  text={t("toggle.showDescription")}
                  active={displaySettings?.SHOW_description}
                  onPress={() => {
                    toggle("desc");
                  }}
                />
                <Settings_TOGGLE
                  text={t("toggle.showFlags")}
                  active={displaySettings?.SHOW_flags}
                  onPress={() => {
                    toggle("flags");
                  }}
                />
                <Settings_TOGGLE
                  text={t("toggle.showDifficulty")}
                  active={displaySettings?.SHOW_difficulty}
                  onPress={() => {
                    toggle("difficulty");
                  }}
                  last
                />
              </View>
            </View>
          </Block>
        </ScrollView>
        <Footer
          btnLeft={
            <Btn
              type="simple"
              text={t("btn.done")}
              onPress={TOGGLE_open}
              style={{ flex: 1 }}
              // text_STYLES={{ color: MyColors.text_white }}
            />
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
