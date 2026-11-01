import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser=await chromium.connectOverCDP('http://127.0.0.1:54799')
const context=await browser.newContext({viewport:{width:1440,height:1100}})
const page=await context.newPage()
try {
 await page.goto('http://127.0.0.1:8000/#overview');await page.locator('.data-content:not(.is-loading)').waitFor()
 if(await page.evaluate(()=>document.documentElement.classList.contains('dark'))) await page.getByRole('button',{name:'İşıqlı rejimə keç'}).click()
 await page.getByRole('button',{name:'Filtrlər',exact:true}).click()
 await page.getByRole('combobox',{name:'Yaş qrupu',exact:true}).click()
 await page.screenshot({path:'.impeccable/review/light-refresh/light-filter.png',animations:'disabled'})
 await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'Orta etibar balı haqqında məlumat',exact:true}).hover()
 await page.locator('.info-bubble').waitFor()
 await page.screenshot({path:'.impeccable/review/light-refresh/light-info.png',animations:'disabled'})
 await page.mouse.move(1,1);await page.locator('.info-bubble').waitFor({state:'hidden'})
 const pairs=await page.evaluate(()=>[
  ['body',getComputedStyle(document.body).color,getComputedStyle(document.body).backgroundColor],
  ['caption',getComputedStyle(document.querySelector('.bar-base')||document.querySelector('.presentation-note')).color,'rgb(255,255,255)'],
  ['selected navigation',getComputedStyle(document.querySelector('nav a[aria-current]')).color,getComputedStyle(document.querySelector('nav a[aria-current]')).backgroundColor],
  ['primary button',getComputedStyle(document.querySelector('.export-button')).color,getComputedStyle(document.querySelector('.export-button')).backgroundColor],
 ])
 const luminance=rgb=>rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)
 const ratios=pairs.map(([name,fg,bg])=>{let a=luminance(fg),b=luminance(bg);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=4.5,`${name} contrast ${ratio}`);return {name,foreground:fg,background:bg,ratio}})
 await fs.writeFile('.impeccable/review/light-refresh/contrast.json',JSON.stringify(ratios,null,2))
 console.log('PASS: light controls captured; four core text/background pairs meet 4.5:1')
} finally {await context.close();await browser.close()}
