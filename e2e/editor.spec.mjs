import {test,expect} from '@playwright/test';
test('AC-06 editor renders scene, allows object mutation and undo',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('#world')).toBeVisible();
 await expect(page.locator('#sceneTitle')).toHaveText('ICEBERG JELLY');
 await expect(page.locator('#objects option')).toHaveCount(5);
 await page.locator('#objectType').selectOption('tree');
 await page.locator('#addObject').click();
 await expect(page.locator('#objects option')).toHaveCount(6);
 await page.locator('#undo').click();
 await expect(page.locator('#objects option')).toHaveCount(5);
 await page.locator('#prompt').fill('一座火山岛，火山爆发，有树木、小船与动物');
 await page.locator('#generate').click();
 await expect(page.locator('#sceneTitle')).toHaveText('VOLCANIC ISLAND');
 await page.screenshot({path:'test-results/volcano.png'});
 expect(errors).toEqual([]);
});
test('AC-08 generated HTML includes SceneSpec and can load as standalone static file',async({page})=>{
 await page.goto('/');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);
 expect(download.suggestedFilename()).toContain('.html');
 const file=await download.path();
 const html=await (await import('node:fs/promises')).readFile(file,'utf8');
 expect(html).toContain('__EXPORTED_SCENE__');
 expect(html).not.toContain("from './src/scene-spec.mjs'");
 expect(html).not.toContain("from './src/history.mjs'");
 expect(html).not.toContain("from './src/scene-operations.mjs'");
});
