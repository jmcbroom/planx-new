import { sortBy } from "lodash";
import { Store } from "pages/FlowEditor/lib/store";

import { FileUploadSlot } from "../FileUpload/Public";
import { MoreInformation, parseMoreInformation } from "../shared";

/**
 * Conditions which can apply to a rule
 * Order is significant - these represent the hierarchy of these rules
 */
export enum Condition {
  AlwaysRequired = "AlwaysRequired",
  AlwaysRecommended = "AlwaysRecommended",
  RequiredIf = "RequiredIf",
  RecommendedIf = "RecommendedIf",
  NotRequired = "NotRequired",
}

export enum Operator {
  Equals = "Equals",
}

interface SimpleRuleProperties {
  val?: undefined;
  fn?: undefined;
  operator?: undefined;
}

interface ConditionalRuleProperties {
  val: string;
  fn: string;
  operator: Operator;
}

// Mapping of additional rule properties to Condition
type RuleProperties<T extends Condition> = {
  [Condition.AlwaysRequired]: SimpleRuleProperties;
  [Condition.AlwaysRecommended]: SimpleRuleProperties;
  [Condition.RequiredIf]: ConditionalRuleProperties;
  [Condition.RecommendedIf]: ConditionalRuleProperties;
  [Condition.NotRequired]: SimpleRuleProperties;
}[T];

export type ConditionalRule<T extends Condition> = {
  condition: T;
} & RuleProperties<T>;

// Union type of all possible ConditionalRule objects
export type Rule = {
  [T in Condition]: ConditionalRule<T>;
}[Condition];

export interface FileType {
  key: string;
  fn: string;
  rule: Rule;
  moreInformation?: MoreInformation;
}

export interface MultipleFileUpload extends MoreInformation {
  title: string;
  description?: string;
  fn?: string;
  fileTypes: FileType[];
}

export const parseContent = (
  data: Record<string, any> | undefined
): MultipleFileUpload => ({
  title: data?.title || DEFAULT_TITLE,
  description: data?.description || "",
  fn: data?.fn || "",
  fileTypes: data?.fileTypes || [newFileType()],
  ...parseMoreInformation(data),
});

const DEFAULT_TITLE = "Upload multiple files";

export const newFileType = (): FileType => ({
  key: "",
  fn: "",
  rule: {
    condition: Condition.AlwaysRequired,
  },
});

export const checkIfConditionalRule = (condition: Condition) =>
  [Condition.RecommendedIf, Condition.RequiredIf].includes(condition);

export interface UserFiles extends FileType {
  slot?: FileUploadSlot;
}

export interface FileList {
  required: UserFiles[];
  recommended: UserFiles[];
  optional: UserFiles[];
}

export const createFileList = ({
  passport,
  fileTypes,
}: {
  passport: Readonly<Store.passport>;
  fileTypes: FileType[];
}): FileList => {
  const fileList: FileList = { required: [], recommended: [], optional: [] };
  const sortedFileTypes = sortFileTypes(fileTypes);
  const uniqueKeys: string[] = [];
  sortedFileTypes.forEach((fileType) => {
    const isUnique = !uniqueKeys.includes(fileType.key);
    if (isUnique) {
      uniqueKeys.push(fileType.key);
      populateFileList({ fileList, fileType, passport });
    }
  });
  return fileList;
};

const sortFileTypes = (fileTypes: FileType[]): FileType[] => {
  const hierarchyOfConditions = (fileType: FileType) =>
    Object.values(Condition).indexOf(fileType.rule.condition);
  const sortedFileTypes = sortBy(fileTypes, hierarchyOfConditions);
  return sortedFileTypes;
};

const populateFileList = ({
  fileList,
  fileType,
  passport,
}: {
  fileList: FileList;
  fileType: FileType;
  passport: Store.passport;
}) => {
  switch (fileType.rule.condition) {
    case Condition.AlwaysRequired:
      fileList.required.push(fileType);
      break;
    case Condition.AlwaysRecommended:
      fileList.recommended.push(fileType);
      break;
    case Condition.RequiredIf:
      if (isRuleMet(passport, fileType.rule)) {
        fileList.required.push(fileType);
      }
      break;
    case Condition.RecommendedIf:
      if (isRuleMet(passport, fileType.rule)) {
        fileList.recommended.push(fileType);
      }
      break;
    case Condition.NotRequired:
      fileList.optional.push(fileType);
      break;
  }
};

const isRuleMet = (
  passport: Store.passport,
  rule: ConditionalRule<Condition.RequiredIf | Condition.RecommendedIf>
) => {
  return (
    passport.data?.[rule.fn] === rule.val ||
    passport.data?.[rule.fn]?.includes(rule.val)
  );
};
