//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";

import {
  ICON_3dots,
  ICON_arrow2,
} from "@/src/components/1_grouped/icons/icons";

import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { router, useRouter } from "expo-router";

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";
import CurrentVocabCount_BAR from "@/src/components/2_byPage/general/CurrentVocabCount_BAR";
import { VOCAB_PRICING } from "@/src/constants/globalVars";
import Pricing_BTN from "@/src/components/1_grouped/buttons/Pricing_BTN/Pricing_BTN";

import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_raiseUserVocabs } from "@/src/features_new/user/hooks/USE_user/USE_raiseUserVocabs/USE_raiseUserVocabs";

export default function GetVocabs_PAGE() {
  const { t } = useTranslation();
  const { z_user } = z_USE_user();

  const [purchase, SET_purchase] = useState({
    completed: false,
    vocab_COUNT: 0,
  });

  const { RAISE_vocabs, RESET_error, error, loading } = USE_raiseUserVocabs();

  const buy = async (offer: 1 | 2 | 3) => {
    if (!z_user?.id) return;
    const count = VOCAB_PRICING[offer].amount;

    await RAISE_vocabs(count, () => {
      SET_purchase({
        completed: true,
        vocab_COUNT: VOCAB_PRICING[offer].amount,
      });
    });

    if (!error) {
      SET_purchase({
        completed: true,
        vocab_COUNT: count,
      });
    }
  };

  return (
    <>
      <Header
        title={t("header.getVocabs")}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow2 />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
      />

      {loading && (
        <View
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: MyColors.fill_bg,
          }}
        >
          <ActivityIndicator color="white" style={{ marginBottom: 8 }} />
          <Styled_TEXT type="label">Completing purchase...</Styled_TEXT>
        </View>
      )}
      {!loading && (
        <ScrollView
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: MyColors.fill_bg,
          }}
        >
          {purchase.completed && (
            <PurchaseCompleted_VIEW
              purchasedVocabs_COUNT={purchase.vocab_COUNT}
              reset={() => SET_purchase({ completed: false, vocab_COUNT: 0 })}
            />
          )}

          {!purchase.completed && (
            <>
              <Block styles={{ paddingBottom: 8 }}>
                <Styled_TEXT type="label">
                  You have{" "}
                  {(z_user?.max_vocabs || 200) - (z_user?.total_vocabs || 0)}{" "}
                  vocabs left
                </Styled_TEXT>

                <CurrentVocabCount_BAR
                  totalUserVocab_COUNT={z_user?.total_vocabs || 0}
                  max_vocabs={z_user?.max_vocabs || 0}
                  color="white"
                />
              </Block>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 16,
                  gap: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                  marginBottom: 50,
                }}
              >
                {/* <Styled_TEXT type="label">Get yourself some vocabs!</Styled_TEXT> */}

                <Pricing_BTN offer={1} onPress={() => buy(1)} />
                <Pricing_BTN offer={2} onPress={() => buy(2)} />
                <Pricing_BTN offer={3} onPress={() => buy(3)} />
              </View>

              {/* Other ways tog et vocabs */}
              {/* <View
                style={{
                  padding: 12,
                  gap: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                  marginBottom: 48,
                }}
              >
                <Styled_TEXT type="text_18_bold">
                  Are there other ways to get vocabs?
                </Styled_TEXT>
                <Styled_TEXT>
                  Yes! Here are a few ways how you can earn vocabs for free:
                </Styled_TEXT>
                <Styled_TEXT>
                  1.{" "}
                  <Styled_TEXT
                    style={{
                      fontFamily: "Nunito-Bold",
                    }}
                  >
                    Publish a list:
                  </Styled_TEXT>{" "}
                  If your list is accepted for publish, your will receive{" "}
                  <Styled_TEXT style={{ textDecorationLine: "underline" }}>
                    double
                  </Styled_TEXT>{" "}
                  the amount of vocabs that were inside of your submitted list.
                  Keep in mind that there are certain rules your list must
                  adhere to.
                </Styled_TEXT>
                <Styled_TEXT>
                  2.{" "}
                  <Styled_TEXT
                    style={{
                      fontFamily: "Nunito-Bold",
                    }}
                  >
                    Invite a friend to the app:
                  </Styled_TEXT>{" "}
                  As you're completing your first vocab purchase, a pop-up will
                  appear, asking you if you were invited to join this app by a
                  friend. The person you select will receive the same amount of
                  vocabs that you are buying. Note that this only works for your
                  very first purchase. If you invite a friend and he decides to
                  make a purchase, he can then select your username and you will
                  get
                </Styled_TEXT>
              </View> */}
            </>
          )}
        </ScrollView>
      )}
    </>
  );
}

function PurchaseCompleted_VIEW({
  purchasedVocabs_COUNT = 0,
  reset = () => {},
}: {
  purchasedVocabs_COUNT: number;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <View style={{}}>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: MyColors.border_white_005,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <View></View>
        <Styled_TEXT type="text_22_bold" style={{ textAlign: "center" }}>
          You received {purchasedVocabs_COUNT} vocabs!
        </Styled_TEXT>
        <Styled_TEXT type="label" style={{ textAlign: "center" }}>
          Have fun learning languages!
        </Styled_TEXT>
      </View>
      <View
        style={{
          gap: 8,
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
          flexDirection: "row",
        }}
      >
        <Btn
          text="Back"
          iconLeft={<ICON_arrow2 direction="left" color="gray_light" />}
          onPress={() => {
            reset();
            router.back();
          }}
        />
        <Btn
          text="View my vocabs"
          style={{ flex: 1 }}
          onPress={() => {
            reset();
            router.push("/(main)/vocabs/");
          }}
        />
      </View>
    </View>
  );
}
