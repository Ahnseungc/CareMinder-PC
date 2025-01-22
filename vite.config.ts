import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import macrosPlugin from "vite-plugin-babel-macros";
import svgr from "@svgr/rollup";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [macrosPlugin(), react(), tsconfigPaths(), svgr()],
  define: {
    global: {},
  },
  base: "./", // 상대 경로로 설정
  build: {
    outDir: "dist", // 빌드 디렉토리
  },
});
