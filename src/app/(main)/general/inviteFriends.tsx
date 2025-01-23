//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_arrow, ICON_3dots } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import { FetchedUsers_PROPS } from "@/src/features/users/functions/fetch/hooks/USE_supabaseUsers/USE_supabaseUsers_2";

import { supabase } from "@/src/lib/supabase";
import { USE_zustand } from "@/src/hooks";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SelectASingleUser_MODAL } from "@/src/features/users/components";
import { REFRESH_zustandUser } from "@/src/features/users/functions";
import { USE_modalToggles } from "@/src/hooks/index";

export default function InviteFriends_PAGE() {
  const router = useRouter();
  const { z_user, z_SET_user } = USE_zustand();
  const [HAS_userMadeAPayment, SET_hasUserMadeAPayment] = useState(false);

  // we need this hook, becasue righ tafter completing award, the text will be green, else a simple white
  const [WAS_awardCompleted, SET_wasAwardCompleted] = useState(false);

  const [selected_FRIEND, SET_selectedFriend] = useState<
    | {
        id: string | undefined;
        username: string | undefined;
      }
    | undefined
  >();

  const { modals } = USE_modalToggles(["selectUser"]);
  const {
    AWARD_friend,
    loading: IS_awardingFriend,
    error: awardFriend_ERROR,
    RESET_error,
  } = USE_awardFriendForInvitation();

  const { sync: sync_2 } = USE_sync();

  const SEND_award = async () => {
    if (!selected_FRIEND || !selected_FRIEND?.id || !z_user?.id) return;

    await sync_2("all", z_user);
    const { msg, success } = await AWARD_friend(z_user?.id, selected_FRIEND.id);
    await sync_2("all", z_user);

    // z_SET_user(updatedUSer);

    if (!success) {
      return console.error(msg);
    }

    await REFRESH_zustandUser({ user_id: z_user?.id, z_SET_user });
    SET_wasAwardCompleted(true);
  };

  useEffect(() => {
    (async () => {
      const HAS_madePayment = await z_user?.HAS_userMadeAPurchase();
      SET_hasUserMadeAPayment(HAS_madePayment || false);
    })();
  }, []);

  return (
    <>
      <Header
        title="Invite friends"
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
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {/* Has purchase + no friend submitted */}

        <Block>
          {!z_user?.has_rewarded_friend_for_invite && (
            <View>
              <Styled_TEXT type="text_18_bold" style={{ marginBottom: 4 }}>
                Did anyone invite you to this app?
              </Styled_TEXT>
              <Styled_TEXT type="label">
                You may select the username of the person who invited you to use
                the vocabs app. Both you and the person you select will be
                rewarded 500 vocabs!
              </Styled_TEXT>

              <View style={{ marginTop: 12 }}>
                {!selected_FRIEND && (
                  <Btn
                    text="Select the user who invited me"
                    onPress={() => TOGGLE_modal("selectUser")}
                    style={{ opacity: HAS_userMadeAPayment ? 1 : 0.4 }}
                    props={{
                      pointerEvents: HAS_userMadeAPayment ? "auto" : "none",
                    }}
                  />
                )}
                {!HAS_userMadeAPayment && (
                  <Styled_TEXT
                    style={{ color: MyColors.text_yellow, marginTop: 12 }}
                  >
                    You need to have made at least a single purchase on the app
                    in order to refer someone and claim the reward.
                  </Styled_TEXT>
                )}

                {selected_FRIEND && (
                  <View>
                    <Styled_TEXT>You have selected the user: </Styled_TEXT>
                    <Styled_TEXT
                      type="text_18_bold"
                      style={{ color: MyColors.text_primary, marginBottom: 12 }}
                    >
                      {selected_FRIEND?.username || "INSERT NAME"}
                    </Styled_TEXT>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Btn
                        text="Cancel"
                        onPress={() => SET_selectedFriend(undefined)}
                      />
                      <Btn
                        text={!IS_awardingFriend ? "Send and claim reward" : ""}
                        iconLeft={
                          IS_awardingFriend ? (
                            <ActivityIndicator color="black" />
                          ) : null
                        }
                        type="action"
                        style={{ flex: 1 }}
                        onPress={async () => await SEND_award()}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
          {z_user?.has_rewarded_friend_for_invite && (
            <Styled_TEXT
              style={{
                color: WAS_awardCompleted
                  ? MyColors.text_green
                  : MyColors.text_white_06,
              }}
            >
              Both you and the person who invited you to the Vocabs app has been
              awarded 500 vocabs!
            </Styled_TEXT>
          )}
        </Block>

        <View style={{ height: 50 }} />
      </ScrollView>

      <SelectASingleUser_MODAL
        open={modals.selectUser.IS_open}
        TOGGLE_open={() => modals.selectUser.set(false)}
        submit={(user: FetchedUsers_PROPS) => {
          if (user) {
            SET_selectedFriend(user);
            modals.selectUser.set(false);
          }
        }}
      />
    </>
  );
}

function USE_awardFriendForInvitation() {
  const [loading, SET_loading] = useState(false);
  const [_error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to reward the selceted user with vocabs. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const AWARD_friend = async (
    sender_ID: string | undefined,
    receiver_ID: string | undefined
  ) => {
    if (!receiver_ID) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 Receiver ID missing for rewarding friend with vocabs 🔴",
      };
    }
    if (!sender_ID) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 Sender ID missing for rewarding friend with vocabs 🔴",
      };
    }

    SET_loading(true);

    try {
      const { error } = await supabase.rpc("award_vocabs_for_referral", {
        sender_id: sender_ID,
        receiver_id: receiver_ID,
      });

      if (error) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Something went wrong when rewarding a user with vocabs for invitation 🔴: ${error.message}`,
        };
      }
      return {
        success: true,
        msg: "",
      };
    } catch (error: any) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: `🔴 Something went wrong when awarding friend for invitation: 🔴 ${error}`,
      };
    } finally {
      SET_loading(false);
    }
  };

  return { AWARD_friend, loading, error: _error, RESET_error };
}
