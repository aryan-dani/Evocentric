import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.74.0/+esm";

const supabaseUrl = "https://lknlipqnpdclrljgvfsk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrbmxpcHFucGRjbHJsamd2ZnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjE5MzAsImV4cCI6MjA3NTQzNzkzMH0.rsYLMEHnN-xs66rFPt5vZW3JsI42dP27rBTc377JWQM";

export const supabase = createClient(supabaseUrl, supabaseKey);
