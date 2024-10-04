import { Store } from "pages/FlowEditor/lib/store";
import { HandleSubmit } from "pages/Preview/Node";

import { BaseNodeData } from "../shared";

export interface Question extends BaseNodeData {
  id?: string;
  text?: string;
  description?: string;
  img?: string;
  responses: {
    id?: string;
    responseKey: string | number;
    title: string;
    description?: string;
    img?: string;
  }[];
  previouslySubmittedData?: Store.UserData;
  handleSubmit: HandleSubmit;
}
