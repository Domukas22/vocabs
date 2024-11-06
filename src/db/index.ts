//
//
//

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { v4 as uuidv4 } from "uuid";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

import schema from "./watermelon_SCHEMA";
import migrations from "./migrations";
import "react-native-get-random-values";

import {
  User_MODEL,
  List_MODEL,
  ListAccess_MODEL,
  Vocab_MODEL,
  Language_MODEL,
  Notifications_MODEL,
  Payments_MODEL,
} from "./watermelon_MODELS";

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  // this adapter allows watermelonDB to connec tto SQLite
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

// Set the custom ID generator to use UUIDs
setGenerator(() => uuidv4());

// Then, make a Watermelon database from it!
const db = new Database({
  adapter,
  modelClasses: [
    User_MODEL,
    List_MODEL,
    Vocab_MODEL,
    Language_MODEL,
    Notifications_MODEL,
    Payments_MODEL,
    ListAccess_MODEL,
  ],
});

export default db;

export const Users_DB = db.get<User_MODEL>("users"),
  Lists_DB = db.get<List_MODEL>("lists"),
  ListAccess_DB = db.get<ListAccess_MODEL>("list_accesses"),
  Vocabs_DB = db.get<Vocab_MODEL>("vocabs"),
  Languages_DB = db.get<Language_MODEL>("languages"),
  Notifications_DB = db.get<Notifications_MODEL>("notifications"),
  Payments_DB = db.get<Payments_MODEL>("payments");
