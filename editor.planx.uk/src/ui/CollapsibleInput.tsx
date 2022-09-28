import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import makeStyles from "@mui/styles/makeStyles";
import React, { useState } from "react";
import Input from "ui/Input";

export interface Props {
  children: JSX.Element[] | JSX.Element;
  handleChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
}

const useClasses = makeStyles((theme) => ({
  button: {
    color: theme.palette.text.primary,
    padding: 0,
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

const CollapsibleInput: React.FC<Props> = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useClasses();

  return (
    <>
      <Button
        className={classes.button}
        onClick={() => setExpanded((x) => !x)}
        disableRipple
      >
        {props.children}
      </Button>
      <Collapse in={expanded}>
        <Box py={0.5}>
          <Input
            multiline
            bordered
            value={props.value}
            name={props.name}
            onChange={props.handleChange}
          />
        </Box>
      </Collapse>
    </>
  );
};

export default CollapsibleInput;
