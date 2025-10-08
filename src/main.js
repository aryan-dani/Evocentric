import { supabase } from "./supabaseClient.js";

async function fetchTables() {
  const { data, error } = await supabase.rpc("get_tables");

  if (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
  return data;
}

function renderTables(tables) {
  const app = document.getElementById("app");
  if (tables.length === 0) {
    app.innerHTML = "<p>No tables found in the public schema.</p>";
    return;
  }

  const tableList = tables
    .map((table) => `<li>${table.table_name}</li>`)
    .join("");
  app.innerHTML = `
        <h2>Your Tables</h2>
        <ul>${tableList}</ul>
    `;
}

async function main() {
  const tables = await fetchTables();
  renderTables(tables);
}

main();
