import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const root = 'http://127.0.0.1:8000'
const browser = await chromium.connectOverCDP(process.env.CDP_URL || 'http://127.0.0.1:54799')
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 })
const page = await context.newPage()
const errors = [], checks = []
page.on('pageerror', error => errors.push(error.message))
const out = '.impeccable/review/presentation'
await fs.mkdir(out, { recursive: true })
const pages = [['overview', 'Ümumi mənzərə'], ['tools', 'Alətlər və məqsədlər'], ['trust', 'Etibar və seçimlər']]
const record = name => { checks.push(name); console.log(`PASS ${name}`) }
const ready = () => page.locator('.data-content:not(.is-loading)').waitFor()
const choose = async (label, name) => {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name, exact: true }).click()
  await ready()
}
try {
  await page.goto(root)
  await ready()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1100 : 844 })
    for (const theme of ['dark', 'light']) {
      const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
      if (dark !== (theme === 'dark')) await page.getByRole('button', { name: dark ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç' }).click()
      for (const [id, name] of pages) {
        await page.goto(`${root}/#${id}`)
        await page.getByRole('heading', { level: 1, name, exact: true }).waitFor()
        await ready()
        await page.evaluate(() => document.fonts.ready)
        assert.equal(await page.locator('nav[aria-label="Əsas naviqasiya"] a').count(), 3)
        assert.equal(await page.locator('.presentation-grid>.panel').count(), 2)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
        assert.equal(/\p{Extended_Pictographic}/u.test(await page.locator('body').innerText()), false)
        await page.screenshot({ path: `${out}/${width}-${theme}-${id}.png`, fullPage: true, animations: 'disabled' })
        record(`${id}: ${width}px ${theme}, three destinations and two main panels`)
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto(`${root}/#overview`)
  await ready()
  assert.equal(await page.locator('.metric-value').first().innerText(), '126')
  assert.match(await page.locator('.presentation-facts').innerText(), /93 \/ 108/)
  assert.match(await page.locator('.presentation-facts').innerText(), /50 \/ 126/)
  await page.getByRole('button', { name: 'Növbəti', exact: true }).click()
  await page.getByRole('heading', { level: 1, name: 'Alətlər və məqsədlər' }).waitFor()
  assert.equal(await page.locator('.podium-grid .podium').count(), 3)
  assert.match(await page.locator('.podium-grid').innerText(), /105 \/ 108/)
  assert.equal(await page.locator('.tool-comparison tbody tr').count(), 8)
  assert.equal(await page.locator('.podium img,.tool-comparison img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), true)
  assert.equal(await page.locator('.podium-grid').evaluate(el => el.getBoundingClientRect().bottom) <= await page.locator('.tool-comparison').evaluate(el => el.getBoundingClientRect().top), true)
  await page.getByRole('button', { name: 'Növbəti', exact: true }).click()
  await page.getByRole('heading', { level: 1, name: 'Etibar və seçimlər' }).waitFor()
  assert.match(await page.locator('.trust-summary').innerText(), /3.56/)
  assert.match(await page.locator('.presentation-grid>.panel').nth(1).innerText(), /114 cavab/)
  assert.match(await page.locator('.presentation-grid>.panel').nth(1).innerText(), /119 cavab/)
  assert.match(await page.locator('.presentation-grid>.panel').nth(1).innerText(), /24 cavab/)
  assert.equal(await page.getByRole('button', { name: 'Növbəti', exact: true }).count(), 0)
  record('Presentation sequence, source counts and final step are correct')
  await page.goto(`${root}/#comparisons`)
  await page.getByRole('heading', { level: 1, name: 'Etibar və seçimlər' }).waitFor()
  record('Old comparisons link opens the consolidated trust view')
  await page.getByRole('button', { name: 'Yan paneli kiçilt', exact: true }).click()
  await page.reload()
  await ready()
  assert.equal(await page.locator('.sidebar--minimized').count(), 1)
  await page.getByRole('button', { name: 'Yan paneli genişləndir', exact: true }).click()
  record('Sidebar minimization still persists')
  await page.getByRole('button', { name: 'Filtrlər', exact: true }).click()
  await choose('AI istifadə statusu', 'Xeyr')
  assert.match(await page.locator('.trust-summary').innerText(), /—/)
  await page.getByRole('button', { name: 'Bütün filtrləri sil' }).click()
  await ready()
  record('Optional filters retain correct zero-AI and reset behavior')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'CSV hesabatı' }).click()
  const download = await downloadPromise
  await download.saveAs(`${out}/export.csv`)
  assert.match(await fs.readFile(`${out}/export.csv`, 'utf8'), /ChatGPT,105,108/)
  record('Full aggregate CSV remains available')
  const api = await (await page.request.get(`${root}/api/dashboard`)).json()
  const covered = new Set()
  for (const [id] of pages) {
    await page.goto(`${root}/#${id}`)
    await ready()
    assert.equal(await page.locator('.all-responses').getAttribute('open'), null)
    await page.locator('.all-responses>summary').click()
    const fields = await page.locator('[data-question]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-question')))
    for (const field of fields) {
      assert.equal(covered.has(field), false, `Duplicate question ${field}`)
      covered.add(field)
      const table = page.locator(`[data-question="${field}"] tbody`)
      assert.equal(await table.locator('tr').count(), api.distributions[field].length)
      for (const [index, row] of api.distributions[field].entries()) {
        assert.match(await table.locator('tr').nth(index).innerText(), new RegExp(`${row.count} / ${row.base}`))
        const displayedPercent = await table.locator('tr').nth(index).locator('td').last().innerText()
        assert.equal(Number.parseFloat(displayedPercent.replace(',', '.')), Math.round(row.percent * 10) / 10)
      }
    }
    await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur() })
    await page.screenshot({ path: `${out}/all-responses-${id}.png`, fullPage: true, animations: 'disabled' })
  }
  assert.deepEqual([...covered].sort(), Object.keys(api.questionMeta).sort())
  assert.equal(covered.size, 20)
  record('All 20 substantive CSV questions and every response category are accessible with correct counts/bases')
  record('Three ranked logo cards sit above the complete eight-row tool comparison, with loaded local logos')
  await page.setViewportSize({ width: 390, height: 844 })
  for (const theme of ['dark', 'light']) {
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    if (dark !== (theme === 'dark')) await page.getByRole('button', { name: dark ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç' }).click()
    for (const [id] of pages) {
      await page.goto(`${root}/#${id}`)
      await ready()
      const detail = page.locator('.all-responses')
      if (!await detail.getAttribute('open')) await detail.locator('summary').click()
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur() })
      await page.screenshot({ path: `${out}/390-${theme}-all-responses-${id}.png`, fullPage: true, animations: 'disabled' })
    }
  }
  record('Expanded complete-response tables fit mobile in both themes')
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [id] of pages) {
      await page.goto(`${root}/#${id}`)
      await ready()
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    }
  }
  record('All three views fit additional 320px, 768px and 1024px widths')
  assert.deepEqual(errors, [])
  record('No browser page errors')
  await fs.writeFile(`${out}/checks.json`, JSON.stringify({ checks, errors }, null, 2))
} finally { await context.close(); await browser.close() }
