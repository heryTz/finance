import { createUser } from "@/app/(dashboard)/user/user-service";
import {
  createPaymentMode,
  deletePaymentMode,
  getPaymentModeById,
  updatePaymentMode,
  getPaymentsMode
} from "../payment-mode-service";
import { NotFoundException } from "@/lib/exception";
import { CreatePaymentModeInput } from "../payment-mode-dto";

describe("payment mode service", () => {
  it("create payment mode", async () => {
    const user = await createUser({ email: "user@user.com" });
    const payment = await createPaymentMode(user.id, { name: "Payment1" });
    expect(payment).toBeTruthy();
  });

  it("can only view my payment mode list", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const newPayment = await createPaymentMode(user1.id, { name: "Payment1" });
    const user1Payments = await getPaymentsMode(user1.id);
    expect(user1Payments.results[0].id).toBe(newPayment.id);
    const user2Payements = await getPaymentsMode(user2.id);
    expect(user2Payements.results.length).toBe(0);
  });

  it("can only view my payment mode item", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const newPayment = await createPaymentMode(user1.id, {
      name: "Payment1",
    });
    const user1Payment = await getPaymentModeById(user1.id, newPayment.id);
    expect(user1Payment).toBeTruthy();
    await expect(getPaymentModeById(user2.id, newPayment.id)).rejects.toThrow(
      NotFoundException
    );
  });

  it("can only update my payment mode", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const newPayment = await createPaymentMode(user1.id, {
      name: "Payment1",
    });
    const updateInput: CreatePaymentModeInput = { name: "Payment2" };
    const paymentUpdate = await updatePaymentMode(
      user1.id,
      newPayment.id,
      updateInput
    );
    expect(paymentUpdate.name).toBe(updateInput.name);
    await expect(
      updatePaymentMode(user2.id, newPayment.id, updateInput)
    ).rejects.toThrow();
  });

  it("delete payment mode", async () => {
    const user = await createUser({ email: "user@user.com" });
    const payment = await createPaymentMode(user.id, { name: "Payment1" });
    const deletedPayment = await deletePaymentMode(user.id, payment.id);
    expect(deletedPayment.id).toBe(payment.id);
  });

  it("can only delete my payment mode", async () => {
    const user1 = await createUser({ email: "user1@user.com" });
    const user2 = await createUser({ email: "user2@user.com" });
    const payment = await createPaymentMode(user1.id, { name: "Payment1" });
    await expect(deletePaymentMode(user2.id, payment.id)).rejects.toThrow();
  });
});
