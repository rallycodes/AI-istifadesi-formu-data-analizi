import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser=await chromium.connectOverCDP('http://127.0.0.1:54799')
const context=await browser.newContext({viewport:{width:1440,height:1100}})
const page=await context.newPage()
await page.goto('http://127.0.0.1:8000/#tools')
await page.locator('.data-content:not(.is-loading)').waitFor()
if(!await page.evaluate(()=>document.documentElement.classList.contains('dark'))) await page.getByRole('button',{name:'Qaranlıq rejimə keç'}).click()
await page.screenshot({path:'.impeccable/review/light-refresh/dark-after.png',fullPage:true,animations:'disabled'})
const styles=await page.evaluate(()=>Object.fromEntries(['body','.sidebar','.topbar','.panel','.podium','.podium-value','.bar-track','.export-button','h1'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,Object.fromEntries(['backgroundColor','backgroundImage','color','fontFamily','fontSize','fontWeight','borderRadius','boxShadow','borderColor'].map(k=>[k,s[k]]))]})))
const before=JSON.parse(await fs.readFile('.impeccable/review/light-refresh/dark-before.json','utf8'))
assert.deepEqual(styles,before)
await fs.writeFile('.impeccable/review/light-refresh/dark-after.json',JSON.stringify(styles,null,2))
for(const width of [1440,1920,390]) {
 await page.setViewportSize({width,height:1100})
 for(const theme of ['dark','light']) {
  const dark=await page.evaluate(()=>document.documentElement.classList.contains('dark'))
  if(dark!==(theme==='dark')) await page.getByRole('button',{name:dark?'İşıqlı rejimə keç':'Qaranlıq rejimə keç'}).click()
  const frame=await page.locator('.app-frame').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {x:r.x,y:r.y,width:r.width,radius:s.borderRadius,border:s.borderTopWidth,margin:s.marginTop,outline:s.outlineWidth}})
  assert.equal(frame.x,0);assert.equal(frame.y,0);assert.ok(Math.abs(frame.width - await page.evaluate(() => document.documentElement.clientWidth)) < 1);assert.equal(frame.radius,'0px');assert.equal(frame.border,'0px');assert.equal(frame.margin,'0px');assert.equal(frame.outline,'0px')
 }
}
await fs.writeFile('.impeccable/review/light-refresh/theme-checks.json',JSON.stringify({darkStylePropertiesUnchanged:true,checkedSelectors:Object.keys(styles),fullscreenWidths:[1440,1920,390],bothThemes:true},null,2))
console.log('PASS: all 81 sampled dark style properties unchanged; fullscreen verified at three widths in both themes')
await context.close();await browser.close()
