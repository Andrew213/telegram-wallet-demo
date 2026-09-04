declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {title?: string}
  >;
  export default ReactComponent;
}

interface ImportMeta {
  env: {
    DEV: boolean;
    PROD: boolean;
    MODE: "development" | "staging" | "production";
    VITE_APP_NAME?: string;
    VITE_DEMO_MODE?: "false" | "true";
    VITE_DISABE_SIGNUP?: "false" | "true";
    VITE_DISABE_RESET_PASSWORD?: "false" | "true";
    VITE_REQUEST_STUCK_MS?: string;
    VITE_AVAILABLE_LANGUAGES?: string;
    VITE_DEFAULT_LANGUAGE?: string;
    BASE_URL?: string;
  };
}
