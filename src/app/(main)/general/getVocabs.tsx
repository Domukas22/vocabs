//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/1_grouped/icons/icons";

import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { router, useRouter } from "expo-router";

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useTranslation } from "react-i18next";
import { USE_zustand } from "@/src/hooks";
import CurrentVocabCount_BAR from "@/src/components/2_byPage/general/CurrentVocabCount_BAR";
import { VOCAB_PRICING } from "@/src/constants/globalVars";
import { PUSH_changes, USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import { supabase } from "@/src/lib/supabase";
import Pricing_BTN from "@/src/components/1_grouped/buttons/Pricing_BTN/Pricing_BTN";

import { USE_observeMyTotalVocabCount } from "@/src/features/vocabs/functions";

export default function GetVocabs_PAGE() {
  const { t } = useTranslation();
  const { z_user, z_SET_user } = USE_zustand();
  const [loading, SET_loading] = useState(false);
  const [IS_referringAFriend, SET_referringAFriend] = useState(false);

  const totalUserVocab_COUNT = USE_observeMyTotalVocabCount(z_user?.id);

  const [purchase, SET_purchase] = useState({
    completed: false,
    vocab_COUNT: 0,
  });

  const { sync } = USE_sync();

  const { BUY_vocabs, error, RESET_error } = USE_buyVocabs();

  const buy = async (offer: 1 | 2 | 3) => {
    if (!z_user?.id) return;

    SET_loading(true);
    await PUSH_changes();
    await BUY_vocabs({ user_id: z_user?.id, offer });
    await sync({ user: z_user, PULL_EVERYTHING: true });

    if (!error) {
      SET_purchase({
        completed: true,
        vocab_COUNT: VOCAB_PRICING[offer].amount,
      });
    }
    SET_loading(false);
  };

  return (
    <>
      <Header
        title={t("header.getVocabs")}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
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
                  {(z_user?.max_vocabs || 200) - (totalUserVocab_COUNT || 0)}{" "}
                  vocabs left
                </Styled_TEXT>

                <CurrentVocabCount_BAR
                  totalUserVocab_COUNT={totalUserVocab_COUNT || 0}
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
                }}
              >
                {/* <Styled_TEXT type="label">Get yourself some vocabs!</Styled_TEXT> */}

                <Pricing_BTN offer={1} onPress={() => buy(1)} />
                <Pricing_BTN offer={2} onPress={() => buy(2)} />
                <Pricing_BTN offer={3} onPress={() => buy(3)} />
              </View>

              <View
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
              </View>
            </>
          )}
        </ScrollView>
      )}
    </>
  );
}

export function USE_buyVocabs() {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to buy vocabs. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const BUY_vocabs = async ({
    user_id,
    offer,
  }: {
    user_id: string | undefined;
    offer: 1 | 2 | 3;
  }) => {
    if (!user_id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 User is required when buying vocabs 🔴",
      };
    }
    if (offer !== 1 && offer !== 2 && offer !== 3) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 When buying vocabs, the offer must be 1 | 2 | 3. It was none of the values 🔴",
      };
    }

    try {
      const { data: user, error: fetchUser_ERROR } = await supabase
        .from("users")
        .select("*")
        .eq("id", user_id)
        .single();

      if (fetchUser_ERROR) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User not found on supabase when trying to buy vocabs 🔴",
        };
      }

      const offerBundle = VOCAB_PRICING[offer];

      // update max vocabs
      const { error: updateMaxVocabs_ERROR } = await supabase
        .from("users")
        .update({ max_vocabs: user.max_vocabs + offerBundle.amount })
        .eq("id", user_id);

      if (updateMaxVocabs_ERROR) {
        SET_error(errorMessage);
        console.error(
          `🔴Error updating user max_vocabs when trying to buy vocabs: 🔴`,
          updateMaxVocabs_ERROR
        );
        return {
          success: false,
          msg: "🔴 Error updating user max_vocabs when trying to buy vocabs 🔴",
        };
      }

      // create notification
      const { data: notification, error: createNotification_ERROR } =
        await supabase.from("notifications").insert({
          user_id: user.id,
          title: `You bought ${offerBundle.amount} vocabs`,
          paragraph: `Your vocab limit has been increased by ${offerBundle.amount}. You can view your payment details in the 'General' tab under 'Payments'.`,
          type: "vocabsAdded",
          is_read: false,
          // created_at: new Date().toDateString(),
          // updated_at: new Date().toDateString(),
        });

      if (createNotification_ERROR) {
        SET_error(errorMessage);
        console.error(
          `🔴 Error creating notification when trying to buy vocabs: 🔴`,
          createNotification_ERROR
        );
        return {
          success: false,
          msg: "🔴 Error creating notification when trying to buy vocabs 🔴",
        };
      }

      // create payment
      const { error: createPayment_ERROR } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          item: `${offerBundle.amount} vocabs`,
          payment_method: "xxxxx",
          amount: offerBundle.price,
          transaction_id: "xxxxxx",
          // created_at: new Date().toDateString(),
          // updated_at: new Date().toDateString(),
        });

      if (createPayment_ERROR) {
        SET_error(errorMessage);
        console.error(
          `🔴 Error creating payment when trying to buy vocabs: 🔴`,
          createPayment_ERROR
        );
        return {
          success: false,
          msg: "🔴 Error creating payment when trying to buy vocabs 🔴",
        };
      }

      // create a notification
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during vocab creation 🔴: ${error.message}`,
      };
    }
  };

  return { BUY_vocabs, error, RESET_error };
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
          iconLeft={<ICON_arrow direction="left" color="gray_light" />}
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
