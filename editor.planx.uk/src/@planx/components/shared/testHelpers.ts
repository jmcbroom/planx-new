import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const typeUsingPlaceholder = async (placeholder: string, text: string) =>
  userEvent.type(await screen.getByPlaceholderText(placeholder), text);

export const fillInFieldsUsingPlaceholder = async (
  ob: Record<string, string>
) => {
  for (const [placeholder, text] of Object.entries(ob)) {
    await typeUsingPlaceholder(placeholder, text);
  }
};

export const typeUsingLabel = async (label: string, text: string) =>
  userEvent.type(await screen.getByLabelText(label), text);

export const fillInFieldsUsingLabel = async (ob: Record<string, string>) => {
  for (const [label, text] of Object.entries(ob)) {
    await typeUsingLabel(label, text);
  }
};
