import { createUser } from "@/app/(dashboard)/user/user-service";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../client-service";
import { buildSaveClientInput } from "@/lib/factory";
import { NotFoundException } from "@/lib/exception";

describe("client service", () => {
  it("create client", async () => {
    const user = await createUser({ email: "user@user.com" });
    const client = await createClient(user.id, buildSaveClientInput());
    expect(client).toBeTruthy();
  });

  it("can only view my client list", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createClient(user1.id, buildSaveClientInput());
    const user2Clients = await getClients(user2.id);
    const clientOfOtherUser = user2Clients.results.find(
      (el) => el.ownerId !== user2.id
    );
    expect(clientOfOtherUser).toBeFalsy();
  });

  it("can only view my client item", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Client = await createClient(user1.id, buildSaveClientInput());
    const user1ClientById = await getClientById(user1.id, user1Client.id);
    expect(user1ClientById).toBeTruthy();
    await expect(getClientById(user2.id, user1Client.id)).rejects.toThrow(
      NotFoundException
    );
  });

  it("update client", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const client = await createClient(user.id, buildSaveClientInput());
    const update = buildSaveClientInput({
      name: "test",
      address: "test",
      ape: "test",
      email: "test",
      nif: "test",
      phone: "test",
      siren: "test",
    });
    const clientUpdated = await updateClient(user.id, client.id, update);
    expect(clientUpdated.name).toBe(update.name);
    expect(clientUpdated.address).toBe(update.address);
    expect(clientUpdated.ape).toBe(update.ape);
    expect(clientUpdated.email).toBe(update.email);
    expect(clientUpdated.nif).toBe(update.nif);
    expect(clientUpdated.phone).toBe(update.phone);
    expect(clientUpdated.siren).toBe(update.siren);
  });

  it("can only update my client", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Client = await createClient(user1.id, buildSaveClientInput());
    await expect(
      updateClient(user2.id, user1Client.id, buildSaveClientInput())
    ).rejects.toThrow();
  });

  it("delete client", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const client = await createClient(user.id, buildSaveClientInput());
    const clientDeleted = await deleteClient(user.id, client.id);
    expect(clientDeleted.id).toBe(client.id);
  });

  it("can only delete my client", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Client = await createClient(user1.id, buildSaveClientInput());
    await expect(deleteClient(user2.id, user1Client.id)).rejects.toThrow();
  });
});
