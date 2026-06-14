import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// mock 数据文件变更时触发全量刷新
function mockFullReload(): Plugin {
  return {
    name: "mock-full-reload",
    handleHotUpdate(ctx) {
      if (ctx.file.includes("/mock/") || ctx.file.includes("\\mock\\")) {
        ctx.server.ws.send({ type: "full-reload" })
        return []
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), mockFullReload()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
  },
});
