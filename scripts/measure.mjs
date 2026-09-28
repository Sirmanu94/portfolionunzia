import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5173/');
for(const id of ['about','work','contact']){
 const el=page.locator('#'+id);
 await el.scrollIntoViewIfNeeded();
 await page.screenshot({path:'verification/before-'+id+'.png'});
}
console.log(await page.evaluate(()=>['.hero','#about','#work','.more-work','#workflow','.skills','#contact'].map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return{selector,height:Math.round(r.height),top:Math.round(r.top+scrollY),paddingTop:s.paddingTop,paddingBottom:s.paddingBottom}})));
console.log(await page.evaluate(()=>['.creative-wall','.wall-gorillas','.wall-letizia','.wall-serra','.wall-postural'].map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return{selector,width:r.width,height:r.height,top:r.top,display:s.display,opacity:s.opacity,gridColumn:s.gridColumn,gridRow:s.gridRow}})));
await browser.close();
