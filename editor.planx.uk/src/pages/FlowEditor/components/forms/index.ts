import AddressInput from "@planx/components/AddressInput/Editor";
import Content from "@planx/components/Content/Editor";
import DateInput from "@planx/components/DateInput/Editor";
import FindPropertyMerged from "@planx/components/FindPropertyMerged/Editor";
import Notice from "@planx/components/Notice/Editor";
import Notify from "@planx/components/Notify/Editor";
import NumberInput from "@planx/components/NumberInput/Editor";
import Send from "@planx/components/Send/Editor";
import TaskList from "@planx/components/TaskList/Editor";
import TextInput from "@planx/components/TextInput/Editor";
import { TYPES } from "@planx/components/types";
import React from "react";

import { SLUGS } from "../../data/types";
import Checklist from "./Checklist";
import ExternalPortal from "./ExternalPortal";
import FileUpload from "./FileUpload";
import Filter from "./Filter";
import InternalPortal from "./InternalPortal";
import Page from "./Page";
import Pay from "./Pay";
import Question from "./Question";
import Result from "./Result";
import Review from "./Review";

const EmptyComponent: React.FC<any> = () => null;

const components: {
  [key in typeof SLUGS[TYPES]]: React.FC<any>;
} = {
  "address-input": AddressInput,
  checklist: Checklist,
  content: Content,
  "date-input": DateInput,
  "external-portal": ExternalPortal,
  "file-upload": FileUpload,
  filter: Filter,
  "find-property-merged": FindPropertyMerged,
  flow: EmptyComponent,
  "internal-portal": InternalPortal,
  notice: Notice,
  notify: Notify,
  "number-input": NumberInput,
  page: Page,
  pay: Pay,
  question: Question,
  result: Result,
  review: Review,
  send: Send,
  "task-list": TaskList,
  "text-input": TextInput,
};

export default components;
