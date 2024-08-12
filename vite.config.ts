/// <reference types="vitest" />
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import StyleLintPlugin from "vite-plugin-stylelint";
import path, {resolve} from "path";
import fs from "fs";
import checker from "vite-plugin-checker";
// import basicSSL from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
const proxyContext = ["/image-uploader", "/ajax", "/file-uploader", "/image"].reduce((prev, next) => {
    prev[next] = {
        target: "https://dispatch-portal.foodtruck-qa.com/",
        changeOrigin: true,
        secure: false,
    };
    return prev;
}, {});

const moduleRoot = "./example/";
const srcModules = fs.readdirSync(moduleRoot);

const paths = srcModules.reduce((prev, next) => {
    const currentPath = `${moduleRoot}${next}`;
    if (fs.statSync(currentPath).isDirectory()) {
        prev[next] = path.join(__dirname, currentPath + "/");
    }
    return prev;
}, {});

export default defineConfig({
    test: {
        environment: "jsdom",
        coverage: {
            provider: "v8",
            reporter: ['text', 'html'], 
            include: [
                "src/",
            ]
        }
    },
    plugins: [
        react({
            babel: {
                plugins: [["@babel/plugin-proposal-decorators", {loose: true, version: "2022-03"}]],
            },
        }),
        checker({
            typescript: true,
            eslint: {
                lintCommand: "eslint ./example/**/*.{ts,tsx} --cache",
            },
        }),
        StyleLintPlugin(),
        // basicSSL(),
    ],
    esbuild: {
        // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
        logOverride: {"this-is-undefined-in-esm": "silent"},
        tsconfigRaw: require("./tsconfig.json"),
    },
    build: {
        rollupOptions: {
            output: {
                // 这个时候会把所有的模块都区分开
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString();
                    }
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    resolve: {
        alias: [
            ...Object.keys(paths).map(find => ({find, replacement: paths[find]})),
            {find: /^~/, replacement: ""},
            // {
            //     find: "../src",
            //     replacement: "../src",
            // },
        ],
    },
    server: {
        host: "localhost",
        port: 2233,
        // https: true,
        proxy: proxyContext,
    },
});
