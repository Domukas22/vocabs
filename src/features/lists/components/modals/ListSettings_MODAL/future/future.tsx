import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_X,
  ICON_questionMark,
  ICON_arrow,
} from "@/src/components/1_grouped/icons/icons";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import List_MODEL from "@/src/db/models/List_MODEL";
import { ListParticipants_DATA } from "@/src/features/users/functions/fetch/FETCH_listParticipants/props";
import { Error_PROPS } from "@/src/types/error_TYPES";
import { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";

function HowDoesSharingListWork_MODAL({
  open = false,
  TOGGLE_modal = () => {},
}: {
  open: boolean;
  TOGGLE_modal: () => void;
}) {
  return (
    <Big_MODAL {...{ open }}>
      <Header
        btnRight={
          <Btn
            iconLeft={<ICON_X big rotate />}
            style={{ borderRadius: 100 }}
            onPress={TOGGLE_modal}
          />
        }
        title="Share a z_myOneList"
        big
      />
    </Big_MODAL>
  );
}
function HowDoesPublishingListWork_MODAL({
  open = false,
  TOGGLE_modal = () => {},
}: {
  open: boolean;
  TOGGLE_modal: () => void;
}) {
  return (
    <Big_MODAL {...{ open }}>
      <Header
        btnRight={
          <Btn
            iconLeft={<ICON_X big rotate />}
            style={{ borderRadius: 100 }}
            onPress={TOGGLE_modal}
          />
        }
        title="Publish a z_myOneList"
        big
      />
    </Big_MODAL>
  );
}

export function SharedWithUsers_BULLETS({
  users = [],
}: {
  users: { id: string; username: string }[];
}) {
  const maxPrint = 10;

  return users.length > 0 ? (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap",
        paddingBottom: 4,
      }}
    >
      {users.slice(0, maxPrint).map((u, index) => (
        <View
          key={u.id}
          style={{
            borderWidth: 1,
            borderColor: MyColors.border_white_005,
            backgroundColor: MyColors.btn_1,
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 50,
          }}
        >
          <Styled_TEXT>
            {index < maxPrint - 1 || users.length <= maxPrint
              ? u.username
              : `+${users.length - maxPrint}`}
          </Styled_TEXT>
        </View>
      ))}
    </View>
  ) : null;
}

export function ListSharing_BLOCK({
  z_myOneList,
  IS_sharing,
  listSharing_ERROR,
  share,
  TOGGLE_infoModal,
  TOGGLE_cancelModal,
  TOGGLE_selectUsersModal,
  participants,
}: {
  z_myOneList: List_MODEL | undefined;
  IS_sharing: boolean;
  listSharing_ERROR: Error_PROPS | undefined;
  share: (val: boolean) => Promise<void>;
  TOGGLE_infoModal: () => void;
  TOGGLE_cancelModal: () => void;
  TOGGLE_selectUsersModal: () => void;
  participants: ListParticipants_DATA;
}) {
  return (
    <Block>
      {z_myOneList?.type !== "shared" && (
        <>
          <Label>Share your z_myOneList with others</Label>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              text={!IS_sharing ? "Share z_myOneList" : ""}
              iconRight={
                IS_sharing ? <ActivityIndicator color="white" /> : null
              }
              style={{ flex: 1 }}
              text_STYLES={{
                textAlign: "left",
                flex: 1,
              }}
              stayPressed={IS_sharing}
              onPress={() => share(true)}
            />
            <Btn iconLeft={<ICON_questionMark />} onPress={TOGGLE_infoModal} />
          </View>
        </>
      )}
      {z_myOneList?.type === "shared" && (
        <>
          <Styled_TEXT style={{ color: MyColors.text_green }}>
            This z_myOneList is shared with {participants?.length || 0} people
          </Styled_TEXT>
          <SharedWithUsers_BULLETS users={participants || []} />
          <Btn
            text="Edit people z_myOneList"
            style={{ flex: 1 }}
            iconRight={<ICON_arrow direction="right" />}
            text_STYLES={{
              textAlign: "left",
              flex: 1,
            }}
            onPress={TOGGLE_selectUsersModal}
          />
          <Btn
            text={!IS_sharing ? "Unshare this z_myOneList" : ""}
            iconRight={
              IS_sharing ? (
                <ActivityIndicator color={MyColors.icon_red} />
              ) : null
            }
            type="delete"
            stayPressed={IS_sharing}
            text_STYLES={{ flex: 1 }}
            onPress={TOGGLE_cancelModal}
          />
        </>
      )}

      {listSharing_ERROR && <Error_TEXT text={listSharing_ERROR.message} />}
    </Block>
  );
}
export function ListPublishing_BLOCK({
  z_myOneList,
  IS_publishing,
  listPublish_ERROR,
  publish,
  TOGGLE_infoModal,
  TOGGLE_cancelPublishModal,
}: {
  z_myOneList: List_MODEL | undefined;
  IS_publishing: boolean;
  listPublish_ERROR: Error_PROPS | undefined;
  publish: (val: boolean) => Promise<void>;
  TOGGLE_infoModal: () => void;
  TOGGLE_cancelPublishModal: () => void;
}) {
  const list_STATUS = useMemo(
    () =>
      z_myOneList?.is_submitted_for_publish &&
      !z_myOneList?.was_accepted_for_publish
        ? "submitted"
        : z_myOneList?.was_accepted_for_publish
        ? "accepted"
        : "not_submitted_or_accepted",
    [
      z_myOneList?.is_submitted_for_publish,
      z_myOneList?.was_accepted_for_publish,
    ]
  );

  return (
    <Block>
      {list_STATUS === "not_submitted_or_accepted" && (
        <>
          <Label>Publish your z_myOneList and get free vocabs</Label>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              text={!IS_publishing ? "Submit for publish" : ""}
              iconRight={
                IS_publishing ? <ActivityIndicator color="white" /> : null
              }
              style={{ flex: 1 }}
              stayPressed={IS_publishing}
              text_STYLES={{
                textAlign: "left",
                flex: 1,
              }}
              onPress={() => publish(true)}
            />

            <Btn iconLeft={<ICON_questionMark />} onPress={TOGGLE_infoModal} />
          </View>
        </>
      )}
      {list_STATUS === "submitted" && (
        <>
          <Styled_TEXT style={{ color: MyColors.text_yellow }}>
            This z_myOneList is being reviewed for publishing, which shouldn't
            take longer than a few days. You'll be notified as soon as the
            z_myOneList is accepted or rejected.
          </Styled_TEXT>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              text={!IS_publishing ? "Unpublish z_myOneList" : ""}
              iconRight={
                IS_publishing ? (
                  <ActivityIndicator color={MyColors.icon_red} />
                ) : null
              }
              type="delete"
              style={{ flex: 1 }}
              stayPressed={IS_publishing}
              onPress={TOGGLE_cancelPublishModal}
            />
            <Btn iconLeft={<ICON_questionMark />} onPress={TOGGLE_infoModal} />
          </View>
        </>
      )}
      {list_STATUS === "accepted" && (
        <>
          <Styled_TEXT style={{ color: MyColors.text_green }}>
            Great Work! You have received 57 vocabs for publishing this
            z_myOneList.
          </Styled_TEXT>
        </>
      )}
      {listPublish_ERROR && <Error_TEXT text={listPublish_ERROR.message} />}
    </Block>
  );
}
