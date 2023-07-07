import React from "react";
import LeftContentBlock from "./LeftContentBlock";
import RightContentBlock from "./RightContentBlock";
import { IContentBlockProps } from "./types";
import MiddleBlock from "./MiddleContentBlock";
import BrowserBlock from "./BrowserContentBlock copy";

const ContentBlock = (props: IContentBlockProps) => {
  if (props.type === "left") return <LeftContentBlock {...props} />;
  if (props.type === "right") return <RightContentBlock {...props} />;
  if (props.type === "middle") return <MiddleBlock {...props} />;
  if (props.type === "browser") return <BrowserBlock {...props} />;
  return null;
};

export default ContentBlock;
