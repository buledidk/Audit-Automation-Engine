import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/__tests__/setup.js'],
          coverage: {
                  provider: 'v8',
                  reporter: ['text', 'json', 'html', 'lcov'],
                  include: ['src/**/*.{js,jsx}'],
                  exclude: [
                            'node_modules/',
                            'src/__tests__/',
                            'dist/',
                            '**/*.d.ts',
                            '**/index.js'
                          ],
                  thresholds: {
                            lines: 0,
                            functions: 0,
                            branches: 0,
                            statements: 0
                  }
          },
          include: ['src/**/*.test.{js,jsx}', 'src/**/*.spec.{js,jsx}'],
          passWithNoTests: true
    },
    resolve: {
          alias: {
                  '@': path.resolve(__dirname, './src')
          }
    }
})
