//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import ChosenLangs_BLOCK from "@/src/components/1_grouped/blocks/ChosenLangs_BLOCK/ChosenLangs_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import {
  ICON_arrow,
  ICON_questionMark,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import Confirmation_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";

import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import Dropdown_BLOCK from "@/src/components/1_grouped/blocks/Dropdown_BLOCK/Dropdown_BLOCK";

import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";

import { MyColors } from "@/src/constants/MyColors";
import List_MODEL from "@/src/db/models/List_MODEL";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import { USE_zustand } from "@/src/hooks";
import { Error_PROPS } from "@/src/types/error_TYPES";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { SelectUsers_MODAL } from "@/src/features/users/components";
import { FETCH_listParticipants } from "@/src/features/users/functions";
import { fetchListParticipants_ERRS } from "@/src/features/users/functions/fetch/FETCH_listParticipants/FETCH_listParticipants";
import {
  ListParticipants_ARGS,
  ListParticipants_DATA,
  ListParticipantsError_PROPS,
} from "@/src/features/users/functions/fetch/FETCH_listParticipants/props";
import { USE_async } from "@/src/hooks";

import { USE_observeMyTargetList, USE_shareList } from "../../../functions";
import { DeleteList_MODAL } from "../DeleteList_MODAL/DeleteList_MODAL";
import { RenameList_MODAL } from "../RenameList_MODAL/RenameList_MODAL";
import { SelectMultipleLanguages_MODAL } from "@/src/features/languages/components";
import { USE_modalToggles } from "@/src/hooks/index";
import { List_TYPE } from "@/src/types/general_TYPES";
import { z_USE_oneList } from "@/src/hooks/z_USE_oneList/z_USE_oneList";

interface ListSettingsModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
}

export function ListSettings_MODAL({
  IS_open = false,
  CLOSE_modal = () => {},
}: ListSettingsModal_PROPS) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { sync } = USE_sync();
  const toast = useToast();
  const router = useRouter();
  const { list } = z_USE_oneList();

  const { modals } = USE_modalToggles([
    "deleteList",
    "selectLangs",
    "renameList",
    "listSharingInfo",
    "listSharingCancel",
    "selectListParticipants",
  ]);

  const { SHARE_list, IS_sharing, listSharing_SUCCESS, listSharing_ERROR } =
    USE_shareList();
  const share = async (val: boolean) => {
    await SHARE_list({
      list,
      user: z_user,
      val,
      sync: async () => await sync({ user: z_user, PULL_EVERYTHING: true }),
    });
  };

  const {
    data: participants,
    loading,
    error,
    execute: FETCH_participants,
    RESET_errors: RESET_backendErrors,
  } = USE_async<
    ListParticipants_ARGS,
    ListParticipants_DATA,
    ListParticipantsError_PROPS
  >({
    args: {
      list_id: list?.id,
      owner_id: z_user?.id,
    },
    fn_NAME: "FETCH_listParticipants",
    dependencies: [IS_open, list?.type, list?.id],
    defaultErr_MSG: fetchListParticipants_ERRS.user.defaultmessage,
    SHOULD_fetchOnLoad: true,
    SHOULD_returnNothing: list?.type !== "shared",
    fn: FETCH_listParticipants,
  });

  const {
    highlight: HIGHLIGHT_listName,
    isHighlighted: IS_listNameHighlighted,
  } = USE_highlightBoolean(3000);

  return (
    <Big_MODAL open={IS_open}>
      <Btn text="Fn" onPress={FETCH_participants} />
      <Header
        title={t("header.listSettings")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={CLOSE_modal}
            style={{ borderRadius: 100 }}
          />
        }
      />
      <ScrollView>
        <Block
          row={true}
          styles={{ position: "relative", alignItems: "flex-start" }}
        >
          <View style={{ flex: 1 }}>
            <Styled_TEXT type="text_18_bold">{t("label.listName")}</Styled_TEXT>
            <Styled_TEXT
              style={{
                color: IS_listNameHighlighted
                  ? MyColors.text_green
                  : MyColors.text_white,
              }}
            >
              {list?.name || "NO LIST NAME PROVIDED"}
            </Styled_TEXT>
            {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
          </View>
          <Btn text="Edit" onPress={() => modals.renameList.set(true)} />
        </Block>

        <ChosenLangs_BLOCK
          label={t("label.defaultVocabLangs")}
          default_lang_ids={list?.default_lang_ids}
          toggle={() => modals.selectLangs.set(true)}
          REMOVE_lang={async (targetLang_ID: string) => {
            await list?.DELETE_defaultLangId(targetLang_ID);
          }}
          // error={}
        />

        <Block>
          <Label>
            Reset the difficulty of every vocab in this list to "Hard"
          </Label>
          <Btn
            text="Reset all vocabs"
            onPress={() => {
              (async () => {
                await list?.RESET_allVocabsDifficulty();
                toast.show("Difficulties reset", {
                  type: "success",
                  duration: 5000,
                });
              })();
            }}
          />
        </Block>
        {/* -------------------------------------------------------------------------------------------------- */}

        <ListSharing_BLOCK
          {...{
            list,
            share,
            IS_sharing,
            listSharing_ERROR,
            participants: participants,
          }}
          TOGGLE_infoModal={() => modals.listSharingInfo.set(true)}
          TOGGLE_cancelModal={() => modals.listSharingCancel.set(true)}
          TOGGLE_selectUsersModal={() =>
            modals.selectListParticipants.set(true)
          }
        />

        {/* -------------------------------------------------------------------------------------------------- */}

        <Dropdown_BLOCK
          toggleBtn_TEXT={t("btn.dangerZone")}
          label="Danger danger"
        >
          <Btn
            type="delete"
            text={t("btn.deleteList")}
            onPress={() => modals.deleteList.set(true)}
          />
        </Dropdown_BLOCK>
      </ScrollView>
      <TwoBtn_BLOCK
        btnLeft={
          <Btn
            text={t("btn.done")}
            onPress={CLOSE_modal}
            type="simple"
            style={{ flex: 1 }}
          />
        }
      />

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectMultipleLanguages_MODAL
        open={modals.selectLangs.IS_open}
        TOGGLE_open={() => modals.selectLangs.set(false)}
        lang_ids={list?.default_lang_ids?.split(",") || []}
        SUBMIT_langIds={async (lang_ids: string[]) => {
          await list?.UPDATE_defaultLangIds(lang_ids);
        }}
      />

      <RenameList_MODAL
        list={list}
        user_id={z_user?.id}
        current_NAME={list?.name}
        IS_open={modals.renameList.IS_open}
        CLOSE_modal={() => modals.renameList.set(false)}
        onSuccess={() => {
          HIGHLIGHT_listName();
          modals.renameList.set(false);
        }}
      />

      <HowDoesSharingListWork_MODAL
        open={modals.listSharingInfo.IS_open}
        TOGGLE_modal={() => modals.listSharingInfo.set(false)}
      />

      <SelectUsers_MODAL
        open={modals.selectListParticipants.IS_open}
        TOGGLE_open={() => modals.selectListParticipants.set(false)}
        list_id={list?.id}
        onUpdate={() => {
          (async () =>
            await FETCH_participants({
              list_id: list?.id,
              owner_id: z_user?.id,
            }))();
        }}
      />

      <Confirmation_MODAL
        open={modals.listSharingCancel.IS_open}
        toggle={() => modals.listSharingCancel.set(false)}
        title={t("header.cancelListSharing")}
        action={() => {
          share(false);
          modals.listSharingCancel.set(false);
        }}
        actionBtnText={t("btn.confirmStop")}
      >
        <Styled_TEXT style={{ color: MyColors.text_red }}>
          The people you have selected won't be able to view your list anymore
        </Styled_TEXT>
      </Confirmation_MODAL>

      <DeleteList_MODAL
        IS_open={modals.deleteList.IS_open}
        list={list}
        CLOSE_modal={() => modals.deleteList.set(false)}
        onSuccess={() => {
          modals.deleteList.set(false);
          toast.show(t("notifications.listDeleted"), {
            type: "success",
            duration: 5000,
          });
          router.back();
        }}
      />
    </Big_MODAL>
  );
}

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
        title="Share a list"
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
        title="Publish a list"
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
  list,
  IS_sharing,
  listSharing_ERROR,
  share,
  TOGGLE_infoModal,
  TOGGLE_cancelModal,
  TOGGLE_selectUsersModal,
  participants,
}: {
  list: List_MODEL | undefined;
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
      {list?.type !== "shared" && (
        <>
          <Label>Share your list with others</Label>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              text={!IS_sharing ? "Share list" : ""}
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
      {list?.type === "shared" && (
        <>
          <Styled_TEXT style={{ color: MyColors.text_green }}>
            This list is shared with {participants?.length || 0} people
          </Styled_TEXT>
          <SharedWithUsers_BULLETS users={participants || []} />
          <Btn
            text="Edit people list"
            style={{ flex: 1 }}
            iconRight={<ICON_arrow direction="right" />}
            text_STYLES={{
              textAlign: "left",
              flex: 1,
            }}
            onPress={TOGGLE_selectUsersModal}
          />
          <Btn
            text={!IS_sharing ? "Unshare this list" : ""}
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
  list,
  IS_publishing,
  listPublish_ERROR,
  publish,
  TOGGLE_infoModal,
  TOGGLE_cancelPublishModal,
}: {
  list: List_MODEL | undefined;
  IS_publishing: boolean;
  listPublish_ERROR: Error_PROPS | undefined;
  publish: (val: boolean) => Promise<void>;
  TOGGLE_infoModal: () => void;
  TOGGLE_cancelPublishModal: () => void;
}) {
  const list_STATUS = useMemo(
    () =>
      list?.is_submitted_for_publish && !list?.was_accepted_for_publish
        ? "submitted"
        : list?.was_accepted_for_publish
        ? "accepted"
        : "not_submitted_or_accepted",
    [list?.is_submitted_for_publish, list?.was_accepted_for_publish]
  );

  return (
    <Block>
      {list_STATUS === "not_submitted_or_accepted" && (
        <>
          <Label>Publish your list and get free vocabs</Label>
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
            This list is being reviewed for publishing, which shouldn't take
            longer than a few days. You'll be notified as soon as the list is
            accepted or rejected.
          </Styled_TEXT>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              text={!IS_publishing ? "Unpublish list" : ""}
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
            Great Work! You have received 57 vocabs for publishing this list.
          </Styled_TEXT>
        </>
      )}
      {listPublish_ERROR && <Error_TEXT text={listPublish_ERROR.message} />}
    </Block>
  );
}
