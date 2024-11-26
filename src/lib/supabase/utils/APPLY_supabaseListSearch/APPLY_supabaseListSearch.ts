//
//
//

export default function APPLY_supabaseListSearch(query: any, search?: string) {
  if (!query) return;
  if (!search) return query;
  return query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
}
