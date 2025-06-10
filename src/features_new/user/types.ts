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

  // TODO ==> Implement this
  random_vocabs_of_the_day: {
    date: string;
    completed: boolean;
    vocabs: { id: string; completed: boolean }[];
  };

  // extended props
  unread_notifications: number;
  total_vocabs: number;
};
