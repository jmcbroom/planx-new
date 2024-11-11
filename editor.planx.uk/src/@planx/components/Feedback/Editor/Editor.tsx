import { ComponentType as TYPES } from "@opensystemslab/planx-core/types";
import { ICONS } from "@planx/components/shared/icons";
import { EditorProps } from "@planx/components/shared/types";
import { useFormik } from "formik";
import React from "react";
import InputGroup from "ui/editor/InputGroup";
import InputLabel from "ui/editor/InputLabel";
import { ModalFooter } from "ui/editor/ModalFooter";
import ModalSection from "ui/editor/ModalSection";
import ModalSectionContent from "ui/editor/ModalSectionContent";
import RichTextInput from "ui/editor/RichTextInput/RichTextInput";
import Input from "ui/shared/Input/Input";
import InputRow from "ui/shared/InputRow";
import { Switch } from "ui/shared/Switch";

import {
  descriptionPlaceholder,
  disclaimerPlaceholder,
  freeformQuestionPlaceholder,
  ratingQuestionPlaceholder,
  titlePlaceholder,
} from "../components/placeholders";
import { Feedback, parseFeedback } from "../model";

type FeedbackEditorProps = EditorProps<TYPES.Feedback, Feedback>;

export const FeedbackEditor = (props: FeedbackEditorProps) => {
  const formik = useFormik<Feedback>({
    initialValues: parseFeedback(props.node?.data),
    onSubmit: (newValues) => {
      if (props.handleSubmit) {
        props.handleSubmit({
          type: TYPES.Feedback,
          data: newValues,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} id="modal">
      <ModalSection>
        <ModalSectionContent title="Feedback" Icon={ICONS[TYPES.Feedback]}>
          <InputGroup flowSpacing>
            <InputRow>
              <InputLabel label="Title">
                <Input
                  format="large"
                  placeholder={titlePlaceholder}
                  name="title"
                  value={formik.values.title || titlePlaceholder}
                  onChange={formik.handleChange}
                />
              </InputLabel>
            </InputRow>
            <InputRow>
              <InputLabel label="Description" htmlFor="description">
                <RichTextInput
                  name="description"
                  value={formik.values.description || descriptionPlaceholder}
                  placeholder="Description"
                  onChange={formik.handleChange}
                />
              </InputLabel>
            </InputRow>

            <InputRow>
              <InputLabel label="Rating question" htmlFor="ratingQuestion">
                <RichTextInput
                  placeholder={ratingQuestionPlaceholder}
                  name="ratingQuestion"
                  value={formik.values.ratingQuestion}
                  onChange={formik.handleChange}
                />
              </InputLabel>
            </InputRow>
            <InputRow>
              <InputLabel label="Freeform question" htmlFor="freeformQuestion">
                <RichTextInput
                  placeholder={freeformQuestionPlaceholder}
                  name="freeformQuestion"
                  value={formik.values.freeformQuestion}
                  onChange={formik.handleChange}
                />
              </InputLabel>
            </InputRow>
            <InputRow>
              <InputLabel label="Disclaimer text" htmlFor="disclaimer">
                <RichTextInput
                  name="disclaimer"
                  value={formik.values.disclaimer || disclaimerPlaceholder}
                  placeholder={disclaimerPlaceholder}
                  onChange={formik.handleChange}
                />
              </InputLabel>
            </InputRow>
            <InputRow>
              <Switch
                checked={formik.values.feedbackRequired}
                onChange={() =>
                  formik.setFieldValue(
                    "feedbackRequired",
                    !formik.values.feedbackRequired,
                  )
                }
                label="Feedback required"
              />
            </InputRow>
          </InputGroup>
        </ModalSectionContent>
      </ModalSection>
      <ModalFooter formik={formik} />
    </form>
  );
};
