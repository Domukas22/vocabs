//
//
//

import { ICON_difficultyDot } from "@/src/components/icons/icons";
import RENDER_textWithHighlights from "@/src/components/RENDER_textWithHighlights/RENDER_textWithHighlights";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import { MyColors } from "@/src/constants/MyColors";
import { DisplaySettings_MODEL, Vocab_MODEL } from "@/src/db/models";
import { Image, Pressable, StyleSheet } from "react-native";
import { View } from "react-native";

interface VocabFront_PROPS {
  displaySettings: DisplaySettings_MODEL;
  listName: string;
  visible?: boolean;
  vocab?: Vocab_MODEL;
  onPress?: () => void;
  disablePressAnimation?: boolean;
  dummy?: boolean;
}

export default function Vocab_FRONT({
  visible = true,
  vocab,
  displaySettings,
  onPress,
  disablePressAnimation = false,
  listName,
  dummy = false,
}: VocabFront_PROPS) {
  const {
    SHOW_image,
    SHOW_listName,
    SHOW_description,
    SHOW_flags,
    SHOW_difficulty,
  } = displaySettings;

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: MyColors.btn_2 },
          pressed &&
            !disablePressAnimation && { backgroundColor: MyColors.btn_3 },
          // Pressed and non-pressed styles
        ]}
        onPress={onPress}
      >
        {SHOW_image && (
          <>
            {!dummy ? (
              <Image
                source={require("@/src/assets/images/dummyImage.jpg")}
                style={{ height: 160, width: "100%" }}
              />
            ) : (
              <Image
                source={require("@/src/assets/images/dummyImage.jpg")}
                style={{ height: 160, width: "100%" }}
              />
            )}
          </>
        )}

        {visible && (
          <View style={s.topPadding}>
            {!dummy &&
              vocab?.translations &&
              vocab?.translations?.length > 0 && (
                <RENDER_textWithHighlights
                  text="Vocabs app is awesome"
                  highlights={[14, 15, 16, 17, 18, 19, 20]}
                  difficulty={2}
                />
              )}
            {dummy && (
              <RENDER_textWithHighlights
                text="Vocabs app is awesome"
                highlights={[14, 15, 16, 17, 18, 19, 20]}
                difficulty={3}
              />
            )}

            {!dummy && SHOW_listName && listName && (
              <Styled_TEXT type="label_small">{listName}</Styled_TEXT>
            )}
            {dummy && SHOW_listName && (
              <Styled_TEXT type="label_small">Name of the list</Styled_TEXT>
            )}

            {!dummy && SHOW_description && vocab?.description && (
              <Styled_TEXT type="label_small">{vocab.description}</Styled_TEXT>
            )}
            {dummy && SHOW_description && (
              <Styled_TEXT type="label_small">Vocab description</Styled_TEXT>
            )}

            {!dummy &&
              (SHOW_flags || SHOW_difficulty) &&
              (vocab?.difficulty || true) && (
                <View style={s.topIconWrap}>
                  {SHOW_flags && (
                    <Styled_TEXT type="label_small">{"Flags"}</Styled_TEXT>
                  )}
                  {SHOW_difficulty && vocab?.difficulty && (
                    <ICON_difficultyDot difficulty={vocab?.difficulty} />
                  )}
                </View>
              )}
            {dummy && (SHOW_flags || SHOW_difficulty) && (
              <View style={s.topIconWrap}>
                {SHOW_flags && (
                  <Styled_TEXT type="label_small">{"Flags"}</Styled_TEXT>
                )}
                {SHOW_difficulty && <ICON_difficultyDot difficulty={3} />}
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  vocab_TITLE: {
    fontSize: 18,
    color: MyColors.text_white,
    fontWeight: "500",
    paddingBottom: 2,
  },
  vocab_SUBTITLE: {
    fontSize: 16,
    color: MyColors.text_white_06,
    fontWeight: "300",
    paddingBottom: 2,
  },
  topPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topIconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
});
