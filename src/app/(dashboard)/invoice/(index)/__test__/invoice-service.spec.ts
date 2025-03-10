import { createUser } from "@/app/(dashboard)/user/user-service";
import { NotFoundError } from "@/lib/exception";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "../invoice-service";
import { buildCreateInvoiceInput } from "@/lib/factory";

describe("invoice service", () => {
  it("create invoice", async () => {
    const user = await createUser({ email: "user@user.com" });
    const invoice = await createInvoice(
      user.id,
      await buildCreateInvoiceInput(user.id),
    );
    expect(invoice).toBeTruthy();
  });

  it("can only view my invoice list", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createInvoice(user1.id, await buildCreateInvoiceInput(user1.id));
    const user2Invoices = await getInvoices(user2.id);
    const invoiceOfOtherUser = user2Invoices.results.find(
      (el) => el.ownerId !== user2.id,
    );
    expect(invoiceOfOtherUser).toBeFalsy();
  });

  it("can only view my invoice item", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const input = await buildCreateInvoiceInput(user1.id);
    const user1Invoice = await createInvoice(user1.id, input);
    const user1InvoiceById = await getInvoiceById(user1.id, user1Invoice.id);
    expect(user1InvoiceById.tva).toBe(input.tva);
    expect(user1InvoiceById.paymentModeId).toBe(input.paymentModeId);
    expect(user1InvoiceById.Client.id).toBe(input.clientId);
    expect(
      user1InvoiceById.Products.map((el) => ({
        name: el.name,
        price: el.price,
        qte: el.qte,
      })),
    ).toEqual(input.products);
    await expect(getInvoiceById(user2.id, user1Invoice.id)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("update invoice", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const invoice = await createInvoice(
      user.id,
      await buildCreateInvoiceInput(user.id),
    );
    const update = await buildCreateInvoiceInput(user.id, {
      currency: "EUR",
    });
    await updateInvoice(user.id, invoice.id, update);
    const invoiceUpdated = await getInvoiceById(user.id, invoice.id);
    expect(invoiceUpdated.tva).toBe(update.tva);
    expect(invoiceUpdated.paymentModeId).toBe(update.paymentModeId);
    expect(invoiceUpdated.Client.id).toBe(update.clientId);
    expect(
      invoiceUpdated.Products.map((el) => ({
        name: el.name,
        price: el.price,
        qte: el.qte,
      })),
    ).toEqual(update.products);
  });

  it("can only update my invoice", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Invoice = await createInvoice(
      user1.id,
      await buildCreateInvoiceInput(user1.id),
    );
    await expect(
      updateInvoice(
        user2.id,
        user1Invoice.id,
        await buildCreateInvoiceInput(user1.id),
      ),
    ).rejects.toThrow();
  });

  it("delete invoice", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const invoice = await createInvoice(
      user.id,
      await buildCreateInvoiceInput(user.id),
    );
    const invoiceDeleted = await deleteInvoice(user.id, invoice.id);
    expect(invoiceDeleted.id).toBe(invoice.id);
  });

  it("can only delete my invoice", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Invoice = await createInvoice(
      user1.id,
      await buildCreateInvoiceInput(user1.id),
    );
    await expect(deleteInvoice(user2.id, user1Invoice.id)).rejects.toThrow();
  });
});
