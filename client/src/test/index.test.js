import util from '../api/index.ts';
import {expect, test} from 'vitest';

/**
 * 
 */
test('Test gets users', async () => { 
    const apiURL = 'https://lfg.gccis.rit/api/users';
    const result = await util.GET(apiURL);
    expect ( result.status ).toBe(200);
})