//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

import React, { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Link, router } from "expo-router";

import Block from "@/src/components/Block/Block";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Label from "@/src/components/Label/Label";
import { useTranslation } from "react-i18next";
import Big_BTN from "@/src/components/Transition_BTN/Big_BTN";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { Vocabs_DB } from "@/src/db";
import { withObservables } from "@nozbe/watermelondb/react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import USE_zustand from "@/src/zustand";
import CurrentVocabCount_BAR from "@/src/components/CurrentVocabCount_BAR";
import { VOCAB_PRICING } from "@/src/constants/globalVars";
import { PUSH_changes, sync } from "@/src/db/sync";
import { supabase } from "@/src/lib/supabase";

function __GetVocabs_PAGE({
  totalUserVocab_COUNT = 0,
}: {
  totalUserVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();

  const { BUY_vocabs, loading, error, RESET_error } = USE_buyVocabs();

  const buy = async (offer: 1 | 2 | 3) => {
    await BUY_vocabs({ user_id: z_user?.id, offer, onSuccess: () => {} });
  };

  return (
    <Page_WRAP>
      {/* <Styled_TEXT>Total vocab count: {totalUserVocab_COUNT}</Styled_TEXT> */}
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
      <ScrollView>
        <Block styles={{ paddingBottom: 8 }}>
          <Styled_TEXT type="label">
            You have {(z_user?.max_vocabs || 200) - (totalUserVocab_COUNT || 0)}{" "}
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
            the amount of vocabs that were inside of your submitted list. Keep
            in mind that there are certain rules your list must adhere to.
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
            appear, asking you if you were invited to join this app by a friend.
            The person you select will receive the same amount of vocabs that
            you are buying. Note that this only works for your very first
            purchase. If you invite a friend and he decides to make a purchase,
            he can then select your username and you will get
          </Styled_TEXT>
        </View>
      </ScrollView>
    </Page_WRAP>
  );
}
export default function GetVocabs_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    totalUserVocab_COUNT: z_user?.totalVocab_COUNT
      ? z_user?.totalVocab_COUNT
      : undefined,
  }));

  const EnhancedPage = enhance(__GetVocabs_PAGE);

  // Pass the observable to the EnhancedPage
  return <EnhancedPage />;
}

function Pricing_BTN({
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
      await PUSH_changes();
      SET_loading(false);

      // TODO ==> finish payments

      // fetch supabase user

      // increase his max vocabs
      // create a notification
      //create a payment

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
        });

      console.log(createNotification_ERROR);

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
    } finally {
      await sync("updates", user_id || "");
      SET_loading(false);
    }
  };

  return { BUY_vocabs, loading, error, RESET_error };
}
