import util from '../utils/projectUtils';

test('Get all projects', async () => {
  const r = await util.getProjects();

  expect(r).not.toBe('400');

  console.log(r);
});
