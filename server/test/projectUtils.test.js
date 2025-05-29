import util from '../utils/projectUtils';

/* - - - GETs - - - */

test('Get all projects', async () => {
  const r = await util.getProjects();

  console.log(r);

  expect(r).not.toBe("400");
});

test('Get project by ID', async () => {
  const r = await util.getByID(3);

  console.log(r);

  expect(r).not.toBe("400");
});

test('Get project pics', async () => {
  const r = await util.getPics(3);

  console.log(r);

  expect(r).not.toBe("400");
});

/* - - - POSTs - - - */

/* - - - PUTs - - - */

/* - - - DELETEs - - - */
