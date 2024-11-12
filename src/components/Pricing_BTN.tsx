//
//
//

import { View } from "react-native";
import { VOCAB_PRICING } from "../constants/globalVars";
import { MyColors } from "../constants/MyColors";
import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";
import Big_BTN from "./Transition_BTN/Big_BTN";

export default function Pricing_BTN({
  offer = 1,
  onPress,
}: {
  offer: 1 | 2 | 3;
  onPress: () => void;
}) {
  const pricing = VOCAB_PRICING[offer];

  return (
    <Big_BTN onPress={onPress}>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <Styled_TEXT type="text_20_bold">
          Get {pricing.amount} Vocabs for{" "}
          <Styled_TEXT
            type="text_20_bold"
            style={{ color: MyColors.text_primary }}
            // style={{ textDecorationLine: "underline" }}
          >
            €{pricing.price}
          </Styled_TEXT>
        </Styled_TEXT>
        <Styled_TEXT
          type="label"
          style={[
            { fontFamily: "Nunito-Semibold" },
            pricing.discount > 0 && { color: MyColors.text_green },
          ]}
        >
          {pricing.discount}% discount
        </Styled_TEXT>
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          gap: 6,
          borderRadius: 50,
        }}
      >
        {pricing.points.map((p, index) => (
          <View key={index} style={{ flexDirection: "row" }}>
            <View style={{ width: 20 }}>
              <View
                style={{
                  width: 8,
                  height: 1,
                  backgroundColor: MyColors.text_white_06,
                  marginTop: 13,
                }}
              />
            </View>
            <Styled_TEXT type="label">{p}</Styled_TEXT>
          </View>
        ))}
      </View>
      {/* <View
          style={{
            paddingHorizontal: 12,
            paddingBottom: 10,
          }}
        >
          <Styled_TEXT type="label">
            Example: 5 vocabs a day for 100 days
          </Styled_TEXT>
        </View> */}
      {/* <View
          style={{
            paddingHorizontal: 12,
            paddingBottom: 10,
          }}
        >
           <Btn
            type="action"
            text={`Get ${pricing.amount} vocabs`}
            text_STYLES={{ flex: 1 }}
            iconRight={<ICON_arrow direction="right" color="black" />}
          /> 
     
        </View>*/}
    </Big_BTN>
  );
}
