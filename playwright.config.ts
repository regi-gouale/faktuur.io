import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Timeout pour chaque test
  timeout: 30 * 1000,

  // Timeout pour chaque assertion
  expect: {
    timeout: 5000,
  },

  // Options de rapport
  fullyParallel: true,

  // Échec du build CI si des tests sont marqués comme .only
  forbidOnly: !!process.env.CI,

  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers en parallèle
  workers: process.env.CI ? 1 : undefined,

  // Reporter à utiliser
  reporter: process.env.CI ? [['html'], ['github']] : [['html'], ['list']],

  // Options partagées pour tous les projets
  use: {
    // URL de base pour les tests
    baseURL: 'http://localhost:3000',

    // Capture de traces uniquement en cas d'échec
    trace: 'on-first-retry',

    // Screenshots
    screenshot: 'only-on-failure',

    // Vidéos
    video: 'retain-on-failure',
  },

  // Configurer les différents navigateurs
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests sur mobile (optionnel)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Démarrer le serveur de développement avant les tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
