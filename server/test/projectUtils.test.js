import util from '../utils/projectUtils.js';

/* - - - POSTs - - - */

// createNewProject
test('Create a new project', async () => {
  const r = await util.createNewProject(
    28,
    'Mistah Bones Game',
    'MISTAH BONES',
    'MISTAH BONESSSSSS',
    'Victory',
    'Eternal',
    'You',
    [
      {
        id: 0,
      },
    ],
    [
      {
        id: 1,
        position: 0,
      },
    ],
    [],
    [
      {
        id: 28,
        titleId: 7,
      },
    ],
    [],
  );

  console.log('Create project: ' + r);

  expect(r).not.toBe('400');
});

// addPic
test('Add picture to project', async () => {
  const r = await util.addPic(/* TODO */);

  console.log('Add picture: ' + r);

  expect(r).not.toBe('400');
});

// addMember
test('Add member to project', async () => {
  const r = await util.addMember(5, 18, 3, 1);

  console.log('Add member: ' + r);

  expect(r).not.toBe('400');
});

/* - - - PUTs - - - */

// updateProject
test('Update project', async () => {
  const r = await util.updateProject(5, {hook: "Howdy, I'm MISTAH BONES!"});

  console.log('Update project: ' + r);

  expect(r).not.toBe('400');
});

// updateProjectThumbnail
test('Update thumbnail', async () => {
  const r = await util.updateThumbnail(/* TODO */);

  console.log('Update thumbnail: ' + r);

  expect(r).not.toBe('400');
});

// updatePicPositions
test('Update picture positions', async () => {
  const r = await util.updatePicPositions(/* TODO */);

  console.log('Update pic positions: ' + r);

  expect(r).not.toBe('400');
});

// updateMember
test('Update member', async () => {
  const r = await util.updateMember(5, 18, 2, 1);

  console.log('Update member: ' + r);

  expect(r).not.toBe('400');
});

/* - - - GETs - - - */

// getProjects
test('Get all projects', async () => {
  const r = await util.getProjects();

  console.log('All projects: ' + r);

  expect(r).not.toBe('400');
});

// getByID
test('Get project by ID', async () => {
  const r = await util.getByID(5);

  console.log('Project by ID: ' + r);

  expect(r).not.toBe('400');
});

// getPics
test('Get project pics', async () => {
  const r = await util.getPics(5);

  console.log('Picture: ' + r);

  expect(r).not.toBe('400');
});

/* - - - DELETEs - - - */

// deletePic
test('Delete picture', async () => {
  const r = await util.deletePic(5, /* TODO */);

  console.log('Delete picture: ' + r);

  expect(r).not.toBe('400');
});

// deleteMember
test('Delete member', async () => {
  const r = await util.deleteMember(5, 18);

  console.log('Delete member: ' + r);

  expect(r).not.toBe('400');
});

// deleteProject
test('Delete project', async () => {
  const r = await util.deleteProject(6);

  console.log('Delete project: ' + r);

  expect(r).not.toBe('400');
});
