import supabase from "./supabase";

export async function insertData<T>(table: string, data: T) {
  const { error } = await supabase.from(table).insert(data);
  if (error) return { success: false, error: error };
  else return { success: true, data: null };
}

export async function selectData<T>(table: string, column: string) {
  const { data, error } = await supabase.from(table).select(column);
  if (error) return { success: false, error: error };
  if (data) return { success: true, data: data };
}
