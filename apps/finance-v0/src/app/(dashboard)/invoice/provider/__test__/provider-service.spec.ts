import { createUser } from "@/app/(dashboard)/user/user-service";
import {
  createProvider,
  deleteProvider,
  getProviders,
  updateProvider,
} from "../provider-service";
import { SaveProviderInput } from "../provider-dto";
import { buildSaveProviderInput } from "@/lib/factory";

describe("provider service", () => {
  it("create provider and get only my provider", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const input: SaveProviderInput = {
      address: "address",
      email: "test@test.com",
      name: "name",
    };
    await createProvider(user1.id, input);
    const user1Provider = await getProviders(user1.id);
    expect(user1Provider.results.map((el) => el.ownerId)).toEqual([user1.id]);
    const user2Provider = await getProviders(user2.id);
    expect(user2Provider.results.length).toBe(0);
  });

  it("update provider", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const provider = await createProvider(user.id, buildSaveProviderInput());
    const update = buildSaveProviderInput({
      name: "test",
      address: "test",
      ape: "test",
      email: "test",
      nif: "test",
      phone: "test",
      siren: "test",
    });
    const providerUpdated = await updateProvider(user.id, provider.id, update);
    expect(providerUpdated.name).toBe(update.name);
    expect(providerUpdated.address).toBe(update.address);
    expect(providerUpdated.ape).toBe(update.ape);
    expect(providerUpdated.email).toBe(update.email);
    expect(providerUpdated.nif).toBe(update.nif);
    expect(providerUpdated.phone).toBe(update.phone);
    expect(providerUpdated.siren).toBe(update.siren);
  });

  it("can only update my provider", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1provider = await createProvider(
      user1.id,
      buildSaveProviderInput(),
    );
    await expect(
      updateProvider(user2.id, user1provider.id, buildSaveProviderInput()),
    ).rejects.toThrow();
  });

  it("delete provider", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const provider = await createProvider(user.id, buildSaveProviderInput());
    const providerDeleted = await deleteProvider(user.id, provider.id);
    expect(providerDeleted.id).toBe(provider.id);
  });

  it("can only delete my provider", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1provider = await createProvider(
      user1.id,
      buildSaveProviderInput(),
    );
    await expect(deleteProvider(user2.id, user1provider.id)).rejects.toThrow();
  });
});
