import { createUser } from "@/app/(dashboard)/user/user-service";
import { getProvider, saveProvider } from "../provider-service";
import { SaveProviderInput } from "../provider-dto";

describe("provider service", () => {
  it("create provider and get only my provider", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const input: SaveProviderInput = {
      address: "address",
      email: "test@test.com",
      name: "name",
    };
    await saveProvider(user1.id, input);
    const user1Provider = await getProvider(user1.id);
    expect(user1Provider?.name).toBe(input.name);
    const user2Provider = await getProvider(user2.id);
    expect(user2Provider).toBeFalsy();
  });
});
