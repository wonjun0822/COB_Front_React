import path from "path"
import { defineConfig } from "vite"
import vitePluginRequire from "vite-plugin-require"
import dynamicImport from "vite-plugin-dynamic-import"

import react from "@vitejs/plugin-react"

export default defineConfig({
    build: {
        outDir: 'build'
    },
    plugins: [
        react({
            include: '**/*.tsx',
        }), 
        vitePluginRequire(),
        dynamicImport()
    ],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, 'src') },
        ]
    },
})