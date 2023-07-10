import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";
import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_WEIGHT_SEMI_BOLD, linkStyle } from "theme";

const useClasses = makeStyles((theme) => ({
  htmlRoot: {
    "& a": linkStyle(theme.palette.primary.main),
    "& h2": theme.typography.h3,
    "& h3": theme.typography.h5,
    "& strong": {
      fontWeight: FONT_WEIGHT_SEMI_BOLD,
    },
    "& p:last-of-type": {
      marginBottom: 0,
    },
    "& img": {
      maxWidth: "100%",
    },
  },
}));

// Increment H1 and H2 elements to meet a11y requirements in user submitted rich text
export const incrementHeaderElements = (source: string): string => {
  const regex: RegExp = /(<\/?h)[1-2]/gi;
  const incrementer = (match: string, p1: string): string => {
    const currentLevel: number = Number(match.slice(-1));
    const newLevel: number = currentLevel + 1;
    return p1 + newLevel;
  };
  return source.replace(regex, incrementer);
};

export default function ReactMarkdownOrHtml(props: {
  source?: string;
  textColor?: string;
  openLinksOnNewTab?: boolean;
  id?: string;
  manuallyIncrementHeaders?: boolean;
}): FCReturn {
  const classes = useClasses();
  if (typeof props.source !== "string") {
    return null;
  }
  const containsHTMLTags = new RegExp(/<([A-Za-z]*)\b[^>]*>/);
  if (containsHTMLTags) {
    const replaceTarget = props.openLinksOnNewTab
      ? props.source.replaceAll(`target="_self"`, `target="_blank" external`)
      : props.source;
    const incrementHeaders = props.manuallyIncrementHeaders
      ? replaceTarget
      : incrementHeaderElements(replaceTarget);

    return (
      <div
        color={props.textColor}
        className={classNames(classes.htmlRoot)}
        dangerouslySetInnerHTML={{ __html: incrementHeaders }}
        id={props.id}
      />
    );
  }
  return (
    <div id={props.id} color={props.textColor}>
      <ReactMarkdown className={classNames(classes.htmlRoot)}>
        {props.source}
      </ReactMarkdown>
    </div>
  );
}
