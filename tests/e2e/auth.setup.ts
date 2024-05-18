import {test as setup} from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup.skip('authenticate', async ({page}) => {
    //add steps

    await page.context().storageState({path: authFile});
});