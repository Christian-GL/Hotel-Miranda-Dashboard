
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'


export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom'
    }
})



/* =====
Ejecutar todos los tests del proyecto:
>> npm run test

Ejecutar un test concreto:
>> npm test -- src/test/carpeta/xxx.test.ts
===== */