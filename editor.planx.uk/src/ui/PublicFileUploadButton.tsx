import ErrorIcon from "@mui/icons-material/Error";
import Image from "@mui/icons-material/Image";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { uploadPublicFile } from "api/upload";
import React, { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

export interface Props {
  onChange?: (image: string) => void;
}

const Root = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "isDragActive",
})<ButtonBaseProps & { isDragActive?: boolean }>(({ theme, isDragActive }) => ({
  borderRadius: 0,
  height: 50,
  width: 50,
  backgroundColor: "#fff",
  color: theme.palette.primary.main,
  ...(isDragActive && {
    border: `2px dashed ${theme.palette.primary.dark}`,
  }),
}));

export default function PublicFileUploadButton(props: Props): FCReturn {
  const { onChange } = props;

  const [status, setStatus] = useState<
    { type: "none" } | { type: "loading" } | { type: "error"; msg: string }
  >({ type: "none" });

  useEffect(() => {
    if (status.type === "error") {
      const timeout = setTimeout(() => {
        setStatus({ type: "none" });
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [status, setStatus]);

  const onDrop = useCallback(
    (files: FileWithPath[]) => {
      const file: File = files[0];
      if (!file) {
        return;
      }
      setStatus({
        type: "loading",
      });
      uploadPublicFile(file)
        .then((res) => {
          setStatus({
            type: "none",
          });
          onChange && onChange(res);
        })
        .catch(() => {
          setStatus({
            type: "error",
            msg: "Something went wrong. Please try again.",
          });
        });
    },
    [onChange, setStatus]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".svg"],
    },
  });

  if (status.type === "loading") {
    return (
      <Root key="status-loading">
        <CircularProgress size={24} />
      </Root>
    );
  }

  if (status.type === "error") {
    return (
      <Tooltip open title={status.msg}>
        <Root>
          <ErrorIcon titleAccess="Error" />
        </Root>
      </Tooltip>
    );
  }

  return (
    <Root isDragActive={isDragActive} key="status-none" {...getRootProps()}>
      <input data-testid="upload-file-input" {...getInputProps()} />
      <Image />
    </Root>
  );
}
