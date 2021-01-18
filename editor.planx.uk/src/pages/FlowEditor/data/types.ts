import { TYPES } from "@planx/components/types";

export const SLUGS: {
  [key in TYPES]: string;
} = {
  [TYPES.AddressInput]: "address-input",
  [TYPES.Checklist]: "checklist",
  [TYPES.Content]: "content",
  [TYPES.DateInput]: "date-input",
  [TYPES.ExternalPortal]: "external-portal",
  [TYPES.FileUpload]: "file-upload",
  [TYPES.Filter]: "filter",
  [TYPES.FindProperty]: "find-property-merged",
  [TYPES.Flow]: "flow",
  [TYPES.InternalPortal]: "internal-portal",
  [TYPES.Notice]: "notice",
  [TYPES.Notify]: "notify",
  [TYPES.NumberInput]: "number-input",
  [TYPES.Page]: "page",
  [TYPES.Pay]: "pay",
  [TYPES.Report]: "question",
  [TYPES.Response]: "question",
  [TYPES.Result]: "result",
  [TYPES.Review]: "review",
  [TYPES.Send]: "send",
  [TYPES.SignIn]: "question",
  [TYPES.Statement]: "question",
  [TYPES.TaskList]: "task-list",
  [TYPES.TextInput]: "text-input",
} as const;

export const fromSlug = (slug: string): TYPES | undefined => {
  const entry = Object.entries(SLUGS).find(
    ([_typeString, currentSlug]) => currentSlug === slug
  );
  return entry && Number(entry[0]);
};
