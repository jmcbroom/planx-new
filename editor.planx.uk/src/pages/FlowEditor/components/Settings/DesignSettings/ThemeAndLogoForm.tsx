import Link from "@mui/material/Link";
import { getContrastRatio, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Team, TeamTheme } from "@opensystemslab/planx-core/types";
import { useFormik } from "formik";
import { useStore } from "pages/FlowEditor/lib/store";
import React, { useEffect, useState } from "react";
import ColorPicker from "ui/editor/ColorPicker";
import InputDescription from "ui/editor/InputDescription";
import InputRow from "ui/shared/InputRow";
import InputRowItem from "ui/shared/InputRowItem";
import InputRowLabel from "ui/shared/InputRowLabel";
import PublicFileUploadButton from "ui/shared/PublicFileUploadButton";

import { DesignPreview, SettingsForm } from ".";

type FormValues = Pick<TeamTheme, "primaryColour" | "logo">;

export const ThemeAndLogoForm: React.FC<{
  team: Team;
  onSuccess: () => void;
}> = ({ team, onSuccess }) => {
  const theme = useTheme();

  useEffect(() => {
    setInitialValues({
      primaryColour: team.theme?.primaryColour,
      logo: team.theme?.logo,
    });
  }, [team]);

  const [initialValues, setInitialValues] = useState<FormValues>({
    primaryColour: "",
    logo: "",
  });

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      const isSuccess = await useStore.getState().updateTeamTheme(values);
      if (isSuccess) {
        onSuccess();
        // Reset "dirty" status to disable Save & Reset buttons
        resetForm({ values });
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: ({ primaryColour }) => {
      const isContrastThresholdMet =
        getContrastRatio("#FFF", primaryColour) >
        theme.palette.contrastThreshold;

      if (!isContrastThresholdMet) {
        return {
          primaryColour:
            "Theme colour does not meet accessibility contrast requirements (3:1)",
        };
      }
    },
  });

  return (
    <SettingsForm
      formik={formik}
      legend="Theme colour & logo"
      description={
        <>
          <InputDescription>
            The theme colour and logo, are used in the header of the service.
            The theme colour should be a dark colour that contrasts with white
            ("#ffffff"). The logo should contrast with a dark background colour
            (your theme colour) and have a transparent background.
          </InputDescription>
          <InputDescription>
            <Link href="https://www.planx.uk">
              See our guide for setting theme colours and logos
            </Link>
          </InputDescription>
        </>
      }
      input={
        <>
          <InputRow>
            <InputRowItem>
              <ColorPicker
                color={formik.values.primaryColour}
                onChange={(color) =>
                  formik.setFieldValue("primaryColour", color)
                }
                label="Theme colour"
              />
            </InputRowItem>
          </InputRow>
          <InputRow>
            <InputRowLabel>Logo:</InputRowLabel>
            <InputRowItem width={50}>
              <PublicFileUploadButton
                onChange={(newUrl) => formik.setFieldValue("logo", newUrl)}
              />
            </InputRowItem>
            <Typography
              color="text.secondary"
              variant="body2"
              pl={2}
              alignSelf="center"
            >
              .png or .svg
            </Typography>
          </InputRow>
        </>
      }
      preview={
        <DesignPreview bgcolor={formik.values.primaryColour}>
          {formik.values.logo ? (
            <img width="140" src={formik.values.logo} alt="council logo" />
          ) : (
            <Typography color={theme.palette.primary.contrastText}>
              {team?.name}
            </Typography>
          )}
        </DesignPreview>
      }
    />
  );
};
