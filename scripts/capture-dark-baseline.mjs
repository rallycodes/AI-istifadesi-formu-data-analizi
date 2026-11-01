import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const browser=await chromium.connectOverCDP('http://127.0.0.1:54799')
const context=await browser.newContext({viewport:{width:1440,height:1100}})
const page=await context.newPage()
await page.goto('http://127.0.0.1:8000/#tools')
await page.locator('.data-content:not(.is-loading)').waitFor()
if(!await page.evaluate(()=>document.documentElement.classList.contains('dark'))) await page.getByRole('button',{name:'Qaranlıq rejimə keç'}).click()
await page.screenshot({path:'.impeccable/review/light-refresh/dark-before.png',fullPage:true,animations:'disabled'})
const styles=await page.evaluate(()=>Object.fromEntries(['body','.sidebar','.topbar','.panel','.podium','.podium-value','.bar-track','.export-button','h1'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,Object.fromEntries(['backgroundColor','backgroundImage','color','fontFamily','fontSize','fontWeight','borderRadius','boxShadow','borderColor'].map(k=>[k,s[k]]))]})))
await fs.writeFile('.impeccable/review/light-refresh/dark-before.json',JSON.stringify(styles,null,2))
await context.close();await browser.close()
