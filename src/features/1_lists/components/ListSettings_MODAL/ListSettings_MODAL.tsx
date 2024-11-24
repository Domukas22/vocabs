//
//
//

import Block from "@/src/components/Block/Block";
import ChosenLangs_BLOCK from "@/src/components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import {
  ICON_arrow,
  ICON_questionMark,
  ICON_X,
} from "@/src/components/icons/icons";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectLangs_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectLangs_MODAL";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";

import RenameList_MODAL from "../RenameList_MODAL/RenameList_MODAL";
import Footer from "@/src/components/Footer/Footer";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import DeleteList_MODAL from "../DeleteList_MODAL";

import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";

import { MyColors } from "@/src/constants/MyColors";
import List_MODEL from "@/src/db/models/List_MODEL";
import Label from "@/src/components/Label/Label";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_shareList from "../../hooks/USE_shareList";
import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import SelectUsers_MODAL from "@/src/features/5_users/components/SelectUsers_MODAL/SelectUsers_MODAL";
import USE_zustand from "@/src/zustand";
import USE_listParticipants from "@/src/hooks/USE_participantsOfAList";
import { Error_PROPS } from "@/src/props";
import USE_publishMySupabaseList from "@/src/features/1_lists/hooks/USE_publishMySupabaseList";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import USE_observeList from "@/src/features/5_users/hooks/USE_observeList";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";

interface ListSettingsModal_PROPS {
  selected_LIST: List_MODEL | undefined;
  open: boolean;
  TOGGLE_open: () => void;
  backToIndex: () => void;
}

export default function ListSettings_MODAL({
  open = false,
  selected_LIST,
  TOGGLE_open = () => {},
  backToIndex = () => {},
}: ListSettingsModal_PROPS) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { sync } = USE_sync();
  const toast = useToast();
  const router = useRouter();

  const list = USE_observeList(selected_LIST?.id);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "deleteList" },
    { name: "selectLangs" },
    { name: "renameList" },
    { name: "listSharingInfo" },
    { name: "listPublishingInfo" },
    { name: "listSharingCancel" },
    { name: "listPublishingCancel" },
    { name: "selectUsers" },
  ]);

  const { PUBLISH_list, IS_publishing, listPublish_ERROR } =
    USE_publishMySupabaseList();
  const publish = async (val: boolean) => {
    await PUBLISH_list({
      list,
      user: z_user,
      val,
      sync: async () => await sync({ user: z_user, PULL_EVERYTHING: true }),
    });
  };

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
    participants,
    IS_fetchingParticipants,
    fetchParticipants_ERROR,
    FETCH_participants,
  } = USE_listParticipants({
    list: selected_LIST,
    owner_id: z_user?.id,
    dependencies: [open, list?.type],
  });

  const {
    highlight: HIGHLIGHT_listName,
    isHighlighted: IS_listNameHighlighted,
  } = USE_highlightBoolean(3000);

  return (
    <Big_MODAL open={open}>
      <Header
        title={t("header.listSettings")}
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
              {selected_LIST?.name || "NO LIST NAME PROVIDED"}
            </Styled_TEXT>
            {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
          </View>
          <Btn text="Edit" onPress={() => TOGGLE_modal("renameList")} />
        </Block>

        <ChosenLangs_BLOCK
          label={t("label.defaultVocabLangs")}
          default_lang_ids={selected_LIST?.default_lang_ids}
          toggle={() => TOGGLE_modal("selectLangs")}
          REMOVE_lang={async (targetLang_ID: string) => {
            await selected_LIST?.DELETE_defaultLangId(targetLang_ID);
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
                await selected_LIST?.RESET_allVocabsDifficulty();
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
            participants,
          }}
          TOGGLE_infoModal={() => TOGGLE_modal("listSharinggInfo")}
          TOGGLE_cancelModal={() => TOGGLE_modal("listSharingCancel")}
          TOGGLE_selectUsersModal={() => TOGGLE_modal("selectUsers")}
        />

        <ListPublishing_BLOCK
          {...{
            list,
            publish,
            IS_publishing,
            listPublish_ERROR,
          }}
          TOGGLE_infoModal={() => TOGGLE_modal("listPublishingInfo")}
          TOGGLE_cancelPublishModal={() => TOGGLE_modal("listPublishingCancel")}
        />
        {/* -------------------------------------------------------------------------------------------------- */}

        <Dropdown_BLOCK
          toggleBtn_TEXT={t("btn.dangerZone")}
          label="Danger danger"
        >
          <Btn
            type="delete"
            text={t("btn.deleteList")}
            onPress={() => TOGGLE_modal("deleteList")}
          />
        </Dropdown_BLOCK>
      </ScrollView>
      <Footer
        btnLeft={
          <Btn
            text={t("btn.done")}
            onPress={TOGGLE_open}
            type="simple"
            style={{ flex: 1 }}
          />
        }
      />

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectLangs_MODAL
        open={modal_STATES.selectLangs}
        TOGGLE_open={() => TOGGLE_modal("selectLangs")}
        lang_ids={selected_LIST?.default_lang_ids?.split(",") || []}
        SUBMIT_langIds={async (lang_ids: string[]) => {
          await selected_LIST?.UPDATE_defaultLangIds(lang_ids);
        }}
      />

      <RenameList_MODAL
        list={selected_LIST}
        user_id={z_user?.id}
        current_NAME={selected_LIST?.name}
        IS_open={modal_STATES.renameList}
        CLOSE_modal={() => TOGGLE_modal("renameList")}
        onSuccess={() => {
          HIGHLIGHT_listName();
          TOGGLE_modal("renameList");
        }}
      />

      <HowDoesSharingListWork_MODAL
        open={modal_STATES.listSharingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listSharingInfo")}
      />
      <HowDoesPublishingListWork_MODAL
        open={modal_STATES.listPublishingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listPublishingInfo")}
      />

      <SelectUsers_MODAL
        open={modal_STATES.selectUsers}
        TOGGLE_open={() => TOGGLE_modal("selectUsers")}
        list_id={selected_LIST?.id}
        onUpdate={() => {
          (async () => await FETCH_participants())();
        }}
      />

      <Confirmation_MODAL
        open={modal_STATES.listSharingCancel}
        toggle={() => TOGGLE_modal("listSharingCancel")}
        title={t("header.cancelListSharing")}
        action={() => {
          share(false);
          TOGGLE_modal("listSharingCancel");
        }}
        actionBtnText={t("btn.confirmStop")}
      >
        <Styled_TEXT style={{ color: MyColors.text_red }}>
          The people you have selected won't be able to view your list anymore
        </Styled_TEXT>
      </Confirmation_MODAL>

      <Confirmation_MODAL
        open={modal_STATES.listPublishingCancel}
        toggle={() => TOGGLE_modal("listPublishingCancel")}
        title={t("header.cancelListPublishing")}
        action={async () => {
          TOGGLE_modal("listPublishingCancel");
          await publish(false);
        }}
        IS_inAction={IS_publishing}
        actionBtnText={t("btn.confirmListUnpublish")}
      >
        <Styled_TEXT style={{ color: MyColors.text_red }}>
          Your list will not be reviewed for publishing and you will not receive
          any new vocabs
        </Styled_TEXT>
      </Confirmation_MODAL>

      <DeleteList_MODAL
        IS_open={modal_STATES.deleteList}
        list={selected_LIST}
        CLOSE_modal={() => TOGGLE_modal("deleteList")}
        onSuccess={() => {
          TOGGLE_modal("deleteList");
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
  participants: { id: string; username: string }[] | undefined;
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
