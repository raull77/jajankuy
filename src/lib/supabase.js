import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://msfjzyxaqvgebachutql.supabase.co";

const supabaseKey =
  "sb_publishable_S5QuLg6DMGMLorq30X9OBQ_oIN-cAGg";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );