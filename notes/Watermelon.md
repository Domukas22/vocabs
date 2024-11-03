# Why no relations/associations for lists and vocabs?

- For the time being, I will not have a deleted list section, only a deleted vocabs section. This means that when a list is deleted, each vocab that pointed to id should have a list_id: null. This is problematic when you set a relation between lists and vocabs. If i pull changes for a vocab from supabase where the list_id is null and we have a relation/association defined, that vocab pull will be completely ignored. So in watermelondb, a relation cannot be null.
