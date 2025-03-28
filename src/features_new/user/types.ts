//
//
//

// table "users_extended"
export type User_TYPE = {
  id: string;
  email: string;

  preffered_lang_id: string;
  max_vocabs: number;

  updated_at: string;
  created_at: string;
  deleted_at: string;

  // extended props
  unread_notifications: number;
  total_vocabs: number;
};
