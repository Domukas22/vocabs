//
//
//

import { NEW_timestampWithTimeZone } from "@/src/utils/timestamps/NEW_timestampWithTimeZone/NEW_timestampWithTimeZone";
import { Model, Q } from "@nozbe/watermelondb";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import {
  date,
  field,
  lazy,
  reader,
  readonly,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";

export default class User_MODEL extends Model {
  static table = "users";

  @text("username") username!: string;
  @text("email") email!: string;
  @field("max_vocabs") max_vocabs!: number;

  @text("preferred_lang_id") preferred_lang_id!: string;
  @field("has_rewarded_friend_for_invite")
  has_rewarded_friend_for_invite!: boolean;

  @field("list_submit_attempt_count") list_submit_attempt_count!: number;
  @field("accepted_list_submit_count") accepted_list_submit_count!: number;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
  @text("last_pulled_at") last_pulled_at!: string;

  @writer async UPDATE_lastPulledAt() {
    try {
      const user = await this.update((user) => {
        user.last_pulled_at = NEW_timestampWithTimeZone();
      });

      return user;
    } catch (error) {
      console.error("Error during update operation:", error);
      throw error;
    }
  }
  @writer async SOFT_DELETE_user() {
    const listAccesses = await this.collections
      .get("list_accesses")
      .query(Q.where("owner_id", this.id), Q.where("participant_id", this.id))
      .fetch();

    const listAccess_UPDATES = listAccesses.map((x) =>
      x.prepareUpdate((lA) => lA.markAsDeleted())
    );

    const user_UPDATE = this.prepareUpdate((user) => {
      user.deleted_at = new Date().toISOString();
    });

    // Execute all updates in a single batch
    await this.batch(...listAccess_UPDATES, user_UPDATE);
  }
  @writer async HARD_DELETE_user() {
    // the hard delete only happens on WatermelonDB
    // since we are using destroyPermanently() instead of markAsDeleted, the changes will not be synced
    // if we want to recover profile, we need to fetch everything from Supabase again

    const lists = await this.collections
      .get("lists")
      .query(Q.where("user_id", this.id))
      .fetch();

    const listAccesses = await this.collections
      .get("list_accesses")
      .query(
        Q.or(Q.where("owner_id", this.id), Q.where("participant_id", this.id))
      )
      .fetch();

    const vocabs = await this.collections
      .get("vocabs")
      .query(Q.where("user_id", this.id))
      .fetch();

    const notifications = await this.collections
      .get("notifications")
      .query(Q.where("user_id", this.id))
      .fetch();

    const payments = await this.collections
      .get("payments")
      .query(Q.where("user_id", this.id))
      .fetch();

    const contactMessages = await this.collections
      .get("contact_messages")
      .query(Q.where("user_id", this.id))
      .fetch();

    // Execute hard delete for each type of related record
    for (const list of lists) {
      await list.destroyPermanently();
    }
    for (const listAccess of listAccesses) {
      await listAccess.destroyPermanently();
    }
    for (const vocab of vocabs) {
      await vocab.destroyPermanently();
    }
    for (const notification of notifications) {
      await notification.destroyPermanently();
    }
    for (const payment of payments) {
      await payment.destroyPermanently();
    }
    for (const contactMessage of contactMessages) {
      await contactMessage.destroyPermanently();
    }

    // Finally, delete the user record itself
    await this.destroyPermanently();
  }
  @writer async UPDATE_preferredLangId(lang_id: "en" | "de") {
    const user = await this.update((user) => {
      user.preferred_lang_id = lang_id;
    });
    return user;
  }
  // @writer async UPDATE_totalUniqueListLangs() {
  //   try {
  //     const user = await this.update((user) => {
  //       user.last_pulled_at = NEW_timestampWithTimeZone();
  //     });

  //     return user;
  //   } catch (error) {
  //     console.error("Error during update operation:", error);
  //     throw error;
  //   }
  // }

  @reader async ARE_vocabsWithinMaxRange(count: number = 0) {
    const allVocabs = await this.collections
      .get("vocabs")
      .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
      .fetchCount();

    const remaining_VOCABS = this.max_vocabs - allVocabs;
    // return remaining_VOCABS >= count;
    return remaining_VOCABS >= count;
  }
  @reader async GET_remainingVocabCount() {
    const result = await this.collections
      .get("vocabs")
      .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
      .fetchCount();

    return this.max_vocabs - result;
  }
  @reader async HAS_userMadeAPurchase() {
    const result = await this.collections
      .get("payments")
      .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
      .fetchCount();

    return result > 0;
  }
  @reader async DOES_userHaveListWithThisName(name: string | undefined) {
    if (!name) return undefined;

    const result = await this.collections
      .get("lists")
      .query(
        Q.where("user_id", this.id),
        Q.where("name", name.trim()),
        Q.where("deleted_at", null)
      )
      .fetchCount();

    return result > 0;
  }
  @reader async FETCH_listNamesSubmittedForPublishing({
    excluded_ID,
  }: {
    excluded_ID: string;
  }) {
    const result = await this.collections
      .get("lists")
      .query(
        Q.where("user_id", this.id),
        Q.where("is_submitted_for_publish", true),
        Q.where("id", notEq(excluded_ID)),
        Q.where("deleted_at", null)
      )
      .fetch();

    return result.map((list) => list.name);
  }
  @reader async FETCH_sharedListNames({
    excluded_ID,
  }: {
    excluded_ID: string;
  }) {
    const result = await this.collections
      .get("lists")
      .query(
        Q.where("user_id", this.id),
        Q.where("type", "shared"),
        Q.where("id", notEq(excluded_ID)),
        Q.where("deleted_at", null)
      )
      .fetch();

    return result.map((list) => list.name);
  }

  @lazy totalList_COUNT = this.collections
    .get("lists")
    .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
    .observeCount();

  @lazy totalVocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
    .observeCount();

  @lazy totalSavedVocab_COUNT = this.collections
    .get("vocabs")
    .query(
      Q.where("is_marked", true),
      Q.where("deleted_at", null),
      Q.where("user_id", this.id)
    )
    .observeCount();

  @lazy markedVocab_COUNT = this.collections
    .get("vocabs")
    .query(
      Q.where("deleted_at", Q.eq(null)),
      Q.where("user_id", this.id),
      Q.where("is_marked", true)
    )
    .observeCount();

  @lazy deletedVocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("deleted_at", Q.notEq(null)), Q.where("user_id", this.id))
    .observeCount();

  @lazy unreadNotification_COUNT = this.collections
    .get("notifications")
    .query(
      Q.where("deleted_at", null),
      Q.where("user_id", this.id),
      Q.where("is_read", false)
    )
    .observeCount();

  @lazy myTopLists = this.collections
    .get("lists")
    .query(Q.where("user_id", this.id), Q.where("deleted_at", null), Q.take(3))
    .observe();
}
