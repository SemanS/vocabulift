import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { theme } from "antd/lib";
import { convertLegacyToken } from "@ant-design/compatible/lib";
import visualizer from "rollup-plugin-visualizer";

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir);
}

export default ({ command }: { command: string }) => {
  return {
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: pathResolve("node_modules") + "/",
        },
        {
          find: /@\//,
          replacement: pathResolve("src") + "/",
        },
      ],
    },
    optimizeDeps: {
      include: ["@ant-design/colors", "@ant-design/icons"],
    },
    plugins: [
      react(),
      svgr(),
      viteMockServe({
        mockPath: "mock",
        supportTs: true,
        watchFiles: true,
        localEnabled: command === "serve",
        logger: true,
      }),
      visualizer(),
    ],
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: "@root-entry-name: default;",
          modifyVars: {
            "@primary-color": "#1890ff",
            v4Token,
          },
        },
      },
    },
  };
};
