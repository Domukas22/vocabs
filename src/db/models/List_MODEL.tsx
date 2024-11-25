//
//
//

import { List_TYPES } from "@/src/props";
import { Model, Q } from "@nozbe/watermelondb";

import { notEq } from "@nozbe/watermelondb/QueryDescription";
import {
  date,
  field,
  lazy,
  readonly,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";

export default class List_MODEL extends Model {
  static table = "lists";

  @text("user_id") user_id!: string;

  @text("original_creator_id") original_creator_id!: string;
  @text("name") name!: string;
  @text("description") description!: string;

  @field("is_submitted_for_publish") is_submitted_for_publish!: boolean;
  @field("was_accepted_for_publish") was_accepted_for_publish!: boolean;

  @text("type") type!: List_TYPES;
  @field("saved_count") saved_count!: number;

  @text("collected_lang_ids") collected_lang_ids!: string;
  @text("default_lang_ids") default_lang_ids!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;

  @writer async rename(name: string | undefined) {
    if (!name) return undefined;

    const list = await this.update((l) => {
      l.name = name;
    });
    return list;
  }

  @writer async DELETE_defaultLangId(incomingLang_ID: string = "") {
    // Get all vocabs where list_id matches this list's ID

    let new_IDS = new Set(this.default_lang_ids?.split(",") || []);

    new_IDS.delete(incomingLang_ID);

    await this.update((list) => {
      list.default_lang_ids = Array.from(new_IDS).join(",");
    });
  }
  @writer async UPDATE_defaultLangIds(incomingLang_IDS: string[] = []) {
    let new_IDS = new Set(incomingLang_IDS || []);

    await this.update((list) => {
      list.default_lang_ids = Array.from(new_IDS).join(",");
    });
  }
  @writer async RESET_allVocabsDifficulty() {
    // Get all vocabs where list_id matches this list's ID

    const vocabsToUpdate = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id))
      .fetch();

    // Prepare update for each vocab to set difficulty to 1
    const updates = vocabsToUpdate.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.difficulty = 3;
      })
    );

    // Execute all updates in a single batch
    await this.batch(...updates);
  }
  @writer async HARD_DELETE_list() {
    const notYetDeleted_VOCABS = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id), Q.where("deleted_at", null))
      .fetch();

    const alreadyDeleted_VOCABS = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id), Q.where("deleted_at", notEq(null)))
      .fetch();

    const updates_1 = notYetDeleted_VOCABS.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.deleted_at = new Date().toISOString();
        v.list_id = null;
      })
    );

    const updates_2 = alreadyDeleted_VOCABS.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.list_id = null;
      })
    );

    // Execute all updates in a single batch
    await this.batch(...updates_1, ...updates_2);

    await this.markAsDeleted();
  }
  @writer async SOFT_DELETE_list() {
    const vocabsToSoftDelete = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id), Q.where("deleted_at", null))
      .fetch();

    const updates = vocabsToSoftDelete.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.deleted_at = new Date().toISOString();
      })
    );

    // Prepare update for the list itself
    const listUpdate = this.prepareUpdate((list) => {
      list.deleted_at = new Date().toISOString();
    });

    // Execute all updates in a single batch transaction
    await this.batch(...updates, listUpdate);
  }

  @lazy diff_1 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 1),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy diff_2 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 2),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy diff_3 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 3),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy markedVocab_COUNT = this.collections
    .get("vocabs")
    .query(
      Q.where("is_marked", true),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy vocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("list_id", this.id), Q.where("deleted_at", Q.eq(null)))
    .observeCount();

  @lazy participants = this.collections
    .get("notifications")
    .query(
      Q.where("deleted_at", Q.notEq(null)),
      Q.where("user_id", this.id),
      Q.where("is_read", false)
    )
    .observeCount();
}
