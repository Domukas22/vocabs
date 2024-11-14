# Why no relations/associations for the models?

- For the time being, I will not have a deleted list section, only a deleted vocabs section. This means that when a list is deleted, each vocab that pointed to id should have a list_id: null. This is problematic when you set a relation between lists and vocabs. If i pull changes for a vocab from supabase where the list_id is null and we have a relation/association defined, that vocab pull will be completely ignored. So in watermelondb, a relation cannot be null. To keep the code consistent, I have decided to not use the relations/associations in any models.

---

# Syncing

- In my current system, hard deletes are impossible to pull from supabase. You can only hard delete on WatermelonDB and then push that deletion to supabase. The only exeption is when you delete a user profile. When you do so, you completely which the users associated data on WatermelonDB, and only update the users deleted_at on supabase. then after f.e. 30 days, you wipe out all the users data on supabase as well.

- This means that for items that are never pushed from Watermelon, and are always only pulled from Supabase, the only way to hide these items is to not display them if they have a deleted_at defined. An example would be payments. If we need to fix a faulty payment, the only way to remove it from the users local view is to set the deleted_at to not null, and to only displayed not deleted payments locally. This means payments will be impossible to delete locally.

- The only way around this would be to create a function which:

1. Wipes out all user data from WatermelonDB
2. Copies all user data from Supabase
3. Pastes all data from Supabase to WatermelonDB
