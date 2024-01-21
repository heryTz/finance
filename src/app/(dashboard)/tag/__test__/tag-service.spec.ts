import { buildSaveFinanceInput } from "@/lib/factory";
import { createFinance } from "../../finance/finance-service";
import { createUser } from "../../user/user-service";
import { getTags } from "../tag-service";

describe("tag service", () => {
  it("get only my tags", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    await createFinance(user1.id, buildSaveFinanceInput({ tags: ["tag1"] }));
    const user1Tags = await getTags(user1.id);
    expect(user1Tags.results.map((el) => el.name)).toEqual(["tag1"]);
    const user2Tags = await getTags(user2.id);
    expect(user2Tags.results.map((el) => el.name)).toEqual([]);
  });
});
