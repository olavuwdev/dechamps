const { exec } = require("node:child_process");

function checkPostgres() {
  const ex = exec("echo $?");

  console.log(ex);
}

checkPostgres();
