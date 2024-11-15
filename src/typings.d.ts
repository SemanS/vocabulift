declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}

declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "react-quiz-component" {
  const Quiz: any;
  export default Quiz;
}
