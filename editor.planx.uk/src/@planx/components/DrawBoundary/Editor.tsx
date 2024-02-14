import { ComponentType as TYPES } from "@opensystemslab/planx-core/types";
import {
  EditorProps,
  ICONS,
  InternalNotes,
  MoreInformation,
} from "@planx/components/ui";
import { useFormik } from "formik";
import React from "react";
import InputGroup from "ui/editor/InputGroup";
import ModalSection from "ui/editor/ModalSection";
import ModalSectionContent from "ui/editor/ModalSectionContent";
import OptionButton from "ui/editor/OptionButton";
import RichTextInput from "ui/editor/RichTextInput";
import Input from "ui/shared/Input";
import InputRow from "ui/shared/InputRow";

import type { DrawBoundary } from "./model";
import { parseDrawBoundary } from "./model";

export type Props = EditorProps<TYPES.DrawBoundary, DrawBoundary>;

export default DrawBoundaryComponent;

function DrawBoundaryComponent(props: Props) {
  const formik = useFormik({
    initialValues: parseDrawBoundary(props.node?.data),
    onSubmit: (newValues) => {
      if (props.handleSubmit) {
        props.handleSubmit({ type: TYPES.DrawBoundary, data: newValues });
      }
    },
    validate: () => {},
  });
  return (
    <form onSubmit={formik.handleSubmit} id="modal">
      <ModalSection>
        <ModalSectionContent
          title="Draw boundary"
          Icon={ICONS[TYPES.DrawBoundary]}
        >
          <InputRow>
            <Input
              format="large"
              placeholder={props.node?.data?.title}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </InputRow>
          <InputRow>
            <RichTextInput
              name="description"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </InputRow>
          <InputGroup label="Boundary data field">
            <InputRow>
              <Input
                name="dataFieldBoundary"
                placeholder=""
                format="data"
                value={formik.values.dataFieldBoundary}
                onChange={formik.handleChange}
              />
            </InputRow>
          </InputGroup>
          <InputGroup label="Area data field (square metres)">
            <InputRow>
              <Input
                name="dataFieldArea"
                placeholder="property.boundary.area"
                format="data"
                value={formik.values.dataFieldArea}
                onChange={formik.handleChange}
              />
            </InputRow>
          </InputGroup>
        </ModalSectionContent>
        <ModalSectionContent
          title={props.node?.data?.titleForUploading}
          Icon={ICONS[TYPES.DrawBoundary]}
        >
          <InputRow>
            <Input
              format="large"
              placeholder={props.node?.data?.titleForUploading}
              name="titleForUploading"
              value={formik.values.titleForUploading}
              onChange={formik.handleChange}
            />
          </InputRow>
          <InputRow>
            <RichTextInput
              name="descriptionForUploading"
              placeholder="Description"
              value={formik.values.descriptionForUploading}
              onChange={formik.handleChange}
            />
          </InputRow>
          <OptionButton
            selected={formik.values.hideFileUpload}
            onClick={() => {
              formik.setFieldValue(
                "hideFileUpload",
                !formik.values.hideFileUpload,
              );
            }}
          >
            Hide file upload and allow user to continue without data
          </OptionButton>
        </ModalSectionContent>
      </ModalSection>
      <MoreInformation
        changeField={formik.handleChange}
        definitionImg={formik.values.definitionImg}
        howMeasured={formik.values.howMeasured}
        policyRef={formik.values.policyRef}
        info={formik.values.info}
      />
      <InternalNotes
        name="notes"
        value={formik.values.notes}
        onChange={formik.handleChange}
      />
    </form>
  );
}
