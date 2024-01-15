import { createUser } from "@/app/(dashboard)/user/user-service";
import inquirer from "inquirer";

async function run() {
  const answer = await inquirer.prompt([
    { type: "input", name: "email", message: `Entrer l'email: ` },
  ]);
  await createUser(answer);
  console.log("Success !!");
}

run();
