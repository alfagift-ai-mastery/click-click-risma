import { expect, test, type Page } from '@playwright/test'
import { DUMMY_USER } from '../src/auth/authenticate'
import { MESSAGES } from '../src/auth/validation'

function trackConsoleProblems(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      problems.push(`${msg.type()}: ${msg.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  return problems
}

async function fillAndSubmit(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const greeting = `Halo, ${DUMMY_USER.email}`

test('opening the dashboard directly without login redirects to the landing (B1.2)', async ({ page }) => {
  const problems = trackConsoleProblems(page)
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByLabel('Email')).toBeVisible()
  expect(problems).toEqual([])
})

test('landing shows the hero, features, steps, and footer (A1)', async ({ page }) => {
  const problems = trackConsoleProblems(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /plan, track/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'How it works', exact: true })).toBeVisible()
  await expect(page.locator('footer')).toContainText('RismaClick')
  expect(problems).toEqual([])
})

test('Sign in link scrolls the login form into view (A1.4)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign in', exact: true }).click()
  await expect(page.getByLabel('Email')).toBeInViewport()
  await expect(page).toHaveURL(/#login$/)
})

test('empty input shows validation messages and does not redirect (A2.3)', async ({ page }) => {
  const problems = trackConsoleProblems(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByText(MESSAGES.emailRequired)).toBeVisible()
  await expect(page.getByText(MESSAGES.passwordRequired)).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
  expect(problems).toEqual([])
})

test('wrong credentials show an error and do not redirect (A3.2)', async ({ page }) => {
  const problems = trackConsoleProblems(page)
  await page.goto('/')
  await fillAndSubmit(page, DUMMY_USER.email, 'Wrong1234!')

  await expect(page.getByRole('alert')).toHaveText(MESSAGES.invalidCredentials)
  await expect(page).toHaveURL(/\/$/)
  expect(problems).toEqual([])
})

test('correct credentials open the dashboard, survive refresh, and clear with a new tab (A3.4, B1.3, B2)', async ({
  page,
  context,
}) => {
  const problems = trackConsoleProblems(page)
  await page.goto('/')
  await fillAndSubmit(page, DUMMY_USER.email, DUMMY_USER.password)

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { level: 1, name: greeting })).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { level: 1, name: greeting })).toBeVisible()

  // sessionStorage tidak dibagi antar tab: tab baru harus diarahkan ke landing.
  const otherTab = await context.newPage()
  await otherTab.goto('/dashboard')
  await expect(otherTab).toHaveURL(/\/$/)

  expect(problems).toEqual([])
})

test('logged-in user opening / goes straight to the dashboard (A3.6)', async ({ page }) => {
  await page.goto('/')
  await fillAndSubmit(page, DUMMY_USER.email, DUMMY_USER.password)
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.goto('/')
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('dashboard shows stat cards, project table and recent tasks (B2.4–B2.6)', async ({ page }) => {
  await page.goto('/')
  await fillAndSubmit(page, DUMMY_USER.email, DUMMY_USER.password)
  await expect(page.getByText('Total projects', { exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Website Redesign' })).toBeVisible()
  await expect(page.getByText('Design landing page wireframes')).toBeVisible()
})

test('submit button is disabled while credentials are being checked (A3.5)', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill(DUMMY_USER.email)
  await page.getByLabel('Password').fill(DUMMY_USER.password)
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByRole('button', { name: 'Logging in…' })).toBeDisabled()
  await expect(page).toHaveURL(/\/dashboard$/)
})

test.describe('mobile 375px (C1)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  const hasHorizontalScroll = (page: Page) =>
    page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)

  test('landing has no horizontal scrolling', async ({ page }) => {
    const problems = trackConsoleProblems(page)
    await page.goto('/')
    await expect(page.getByLabel('Email')).toBeVisible()
    expect(await hasHorizontalScroll(page)).toBe(false)
    expect(problems).toEqual([])
  })

  test('full flow works, and the sidebar can be opened on the dashboard', async ({ page }) => {
    const problems = trackConsoleProblems(page)
    await page.goto('/')
    await fillAndSubmit(page, DUMMY_USER.email, DUMMY_USER.password)
    await expect(page.getByRole('heading', { level: 1, name: greeting })).toBeVisible()
    expect(await hasHorizontalScroll(page)).toBe(false)

    const menu = page.getByRole('button', { name: 'Menu', exact: true })
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByLabel('Sidebar')).toBeVisible()

    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(page.getByLabel('Sidebar')).toBeHidden()
    expect(problems).toEqual([])
  })
})
