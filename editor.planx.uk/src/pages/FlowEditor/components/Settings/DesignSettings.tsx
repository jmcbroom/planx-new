import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import React from "react";
import ColorPicker from "ui/ColorPicker";
import FileUpload from "ui/FileUpload";
import Input from "ui/Input";
import InputGroup from "ui/InputGroup";
import InputRow from "ui/InputRow";
import InputRowItem from "ui/InputRowItem";
import InputRowLabel from "ui/InputRowLabel";
import OptionButton from "ui/OptionButton";

import { DesignSettings } from "./model";

const Team: React.FC<DesignSettings> = (props) => {
  const formik = useFormik<DesignSettings>({
    initialValues: props,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: () => {},
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box pb={3} borderBottom={1}>
        <Typography variant="h3" gutterBottom>
          <strong>Design</strong>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          How your service appears to public users
        </Typography>
      </Box>
      <Box py={3}>
        <InputGroup>
          <InputRow>
            <InputRowItem width="50%">
              <OptionButton selected>Fluid mode</OptionButton>
            </InputRowItem>
            <InputRowItem width="50%">
              <OptionButton selected>Static mode</OptionButton>
            </InputRowItem>
          </InputRow>
        </InputGroup>
        <InputGroup>
          <InputRow>
            <InputRowLabel>
              <Typography variant="h5">Background</Typography>
            </InputRowLabel>
            <InputRowItem width="70%">
              <ColorPicker
                inline
                color=""
                onChange={(color) => formik.setFieldValue("bgColor", color)}
              ></ColorPicker>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowLabel>
              <Typography variant="h5">Logo</Typography>
            </InputRowLabel>
            <InputRowItem width={50}>
              <FileUpload></FileUpload>
            </InputRowItem>
            <Box color="text.secondary" pl={2} alignSelf="center">
              .png or .svg
            </Box>
          </InputRow>
        </InputGroup>
      </Box>
      <Box py={3} borderBottom={1}>
        <Typography variant="h3" gutterBottom>
          <strong>Elements</strong>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage the features that users will be able to see
        </Typography>
      </Box>
      <Box pt={2}>
        <InputGroup>
          <InputRow>
            <InputRowItem>
              <OptionButton selected>Progress bar</OptionButton>
            </InputRowItem>
            <InputRowItem>
              <OptionButton selected>Use top level flows as steps</OptionButton>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <OptionButton selected>Phase banner</OptionButton>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input placeholder="Title" />
            </InputRowItem>
            <InputRowLabel>Colour</InputRowLabel>
            <InputRowItem width={180}>
              <ColorPicker
                inline
                color=""
                onChange={(color) =>
                  formik.setFieldValue("phaseBannerColor", color)
                }
              ></ColorPicker>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input placeholder="Text" />
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <OptionButton selected>Help</OptionButton>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input
                placeholder="Header"
                format="bold"
                name="help.header"
                value={formik.values.help?.header}
                onChange={formik.handleChange}
              />
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input
                placeholder="Text"
                multiline
                rows={6}
                name="help.content"
                value={formik.values.help?.content}
                onChange={formik.handleChange}
              />
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <OptionButton selected>Privacy</OptionButton>
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input
                placeholder="Header"
                format="bold"
                name="privacy.header"
                value={formik.values.privacy?.header}
                onChange={formik.handleChange}
              />
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowItem>
              <Input
                placeholder="Text"
                multiline
                rows={6}
                name="privacy.content"
                value={formik.values.privacy?.content}
                onChange={formik.handleChange}
              />
            </InputRowItem>
          </InputRow>
        </InputGroup>
      </Box>
    </form>
  );
};
export default Team;
