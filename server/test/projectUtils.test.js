import util from '../utils/projectUtils.js';

/* - - - POSTs - - - */

// createNewProject (valid)
test('Create a new project - valid', async () => {
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

  console.log('Create project valid: ' + r);

  expect(r).not.toBe('400');
});
// createNewProject (invalid)
test('Create a new project - invalid', async () => {
  const r = await util.createNewProject();

  console.log('Create project invalid: ' + r);

  expect(r).toBe('400');
});

// addPic (valid)
test('Add picture to project - valid', async () => {
  const r = await util.addPic(/* TODO */);

  console.log('Add picture valid: ' + r);

  expect(r).not.toBe('400');
});
// addPic (invalid)
test('Add picture to project - invalid', async () => {
  const r = await util.addPic();

  console.log('Add picture invalid: ' + r);

  expect(r).toBe('400');
});

// addMember (valid)
test('Add member to project - valid', async () => {
  const r = await util.addMember(5, 18, 3, 1);

  console.log('Add member valid: ' + r);

  expect(r).not.toBe('400');
});
// addMember (invalid)
test('Add member to project - invalid', async () => {
  const r = await util.addMember();

  console.log('Add member invalid: ' + r);

  expect(r).toBe('400');
});

/* - - - PUTs - - - */

// updateProject (valid)
test('Update project - valid', async () => {
  const r = await util.updateProject(5, {hook: "Howdy, I'm MISTAH BONES!"});

  console.log('Update project valid: ' + r);

  expect(r).not.toBe('400');
});
// updateProject (invalid)
test('Update project - invalid', async () => {
  const r = await util.updateProject();

  console.log('Update project invalid: ' + r);

  expect(r).toBe('400');
});

// updateProjectThumbnail (valid)
test('Update thumbnail - valid', async () => {
  const r = await util.updateThumbnail(/* TODO */);

  console.log('Update thumbnail valid: ' + r);

  expect(r).not.toBe('400');
});
// updateProjectThumbnail (invalid)
test('Update thumbnail - invalid', async () => {
  const r = await util.updateThumbnail();

  console.log('Update thumbnail invalid: ' + r);

  expect(r).toBe('400');
});

// updatePicPositions (valid)
test('Update picture positions - valid', async () => {
  const r = await util.updatePicPositions(/* TODO */);

  console.log('Update pic positions valid: ' + r);

  expect(r).not.toBe('400');
});
// updatePicPositions (invalid)
test('Update picture positions - invalid', async () => {
  const r = await util.updatePicPositions();

  console.log('Update pic positions invalid: ' + r);

  expect(r).toBe('400');
});

// updateMember (valid)
test('Update member - valid', async () => {
  const r = await util.updateMember(5, 18, 2, 1);

  console.log('Update member valid: ' + r);

  expect(r).not.toBe('400');
});
// updateMember (invalid)
test('Update member - invalid', async () => {
  const r = await util.updateMember();

  console.log('Update member invalid: ' + r);

  expect(r).toBe('400');
});

/* - - - GETs - - - */

// getProjects
test('Get all projects', async () => {
  const r = await util.getProjects();

  console.log('All projects: ' + r);

  expect(r).not.toBe('400');
});

// getByID (valid)
test('Get project by ID - valid', async () => {
  const r = await util.getByID(5);

  console.log('Project by ID valid: ' + r);

  expect(r).not.toBe('400');
});
// getByID (invalid)
test('Get project by ID - invalid', async () => {
  const r = await util.getByID();

  console.log('Project by ID invalid: ' + r);

  expect(r).toBe('400');
});

// getPics (valid)
test('Get project pics - valid', async () => {
  const r = await util.getPics(5);

  console.log('Picture valid: ' + r);

  expect(r).not.toBe('400');
});
// getPics (invalid)
test('Get project pics - invalid', async () => {
  const r = await util.getPics();

  console.log('Picture invalid: ' + r);

  expect(r).toBe('400');
});

/* - - - DELETEs - - - */

// deletePic (valid)
test('Delete picture - valid', async () => {
  const r = await util.deletePic(5, /* TODO */);

  console.log('Delete picture valid: ' + r);

  expect(r).not.toBe('400');
});
// deletePic (invalid)
test('Delete picture - invalid', async () => {
  const r = await util.deletePic();

  console.log('Delete picture invalid: ' + r);

  expect(r).toBe('400');
});

// deleteMember (valid)
test('Delete member - valid', async () => {
  const r = await util.deleteMember(5, 18);

  console.log('Delete member valid: ' + r);

  expect(r).not.toBe('400');
});
// deleteMember (invalid)
test('Delete member - invalid', async () => {
  const r = await util.deleteMember();

  console.log('Delete member invalid: ' + r);

  expect(r).toBe('400');
});

// deleteProject (valid)
test('Delete project - valid', async () => {
  const r = await util.deleteProject(6);

  console.log('Delete project valid: ' + r);

  expect(r).not.toBe('400');
});
// deleteProject (invalid)
test('Delete project - invalid', async () => {
  const r = await util.deleteProject();

  console.log('Delete project invalid: ' + r);

  expect(r).toBe('400');
});
