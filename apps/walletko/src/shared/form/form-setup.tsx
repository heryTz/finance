import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { AllocationField } from "./allocation-field";
import { AmountField } from "./amount-field";
import { ColorField } from "./color-field";
import { ComboboxField } from "./combobox-field";
import { DatePickerField } from "./date-picker-field";
import { InputField } from "./input-field";
import { OtpField } from "./otp-field";
import { SubmitButton } from "./submit-button";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
    OtpField,
    AmountField,
    DatePickerField,
    ComboboxField,
    ColorField,
    AllocationField,
  },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
});

export { useFieldContext, useFormContext, useAppForm };
