import util from '../utils/projectUtils';

/* - - - POSTs - - - */

// createNewProject
test('Create a new project', async () => {
  const r = await util.createNewProject(/* TODO */);
  
  console.log("Create project: " + r);

  expect(r).not.toBe("400");
});

// addPic
test ('Add picture to project', async () => {
  const r = await util.addPic( /* TODO */);

  console.log("Add picture: " + r);

  expect(r).not.toBe("400");
});

// addMember
test('Add member to project', async () => {
  const r = await util.addMember(/* TODO */);

  console.log("Add member: " + r);

  expect(r).not.toBe("400");
});

/* - - - PUTs - - - */

// updateProject
test('Update project', async () => {
  const r = await util.updateProject( /* TODO */);

  console.log("Update project: " + r);

  expect(r).not.toBe("400");
});

// updateProjectThumbnail
test('Update thumbnail', async () => {
  const r = await util.updateThumbnail(/* TODO */);

  console.log("Update thumbnail: " + r);

  expect(r).not.toBe("400");
});

// updatePicPositions
test('Update picture positions', async () => {
  const r = await util.updatePicPositions(/* TODO */);

  console.log("Update pic positions: " + r);

  expect(r).not.toBe("400");
});

// updateMember
test('Update member', async () => {
  const r = await util.updateMember(/* TODO */);

  console.log("Update member: " + r);

  expect(r).not.toBe("400");
});

/* - - - GETs - - - */

// getProjects
test('Get all projects', async () => {
  const r = await util.getProjects();

  console.log("All projects: " + r);

  expect(r).not.toBe("400");
});

// getByID
test('Get project by ID', async () => {
  const r = await util.getByID(3);

  console.log("Project by ID: " + r);

  expect(r).not.toBe("400");
});

// getPics
test('Get project pics', async () => {
  const r = await util.getPics(3);

  console.log("Picture: " + r);

  expect(r).not.toBe("400");
});

/* - - - DELETEs - - - */

// deletePic
test('Delete picture', async () => {
  const r = await util.deletePic(/* TODO */);

  console.log("Delete picture: " + r);

  expect(r).not.toBe("400");
});

// deleteMember
test('Delete member', async () => {
  const r = await util.deleteMember(/* TODO */);

  console.log("Delete member: " + r);

  expect(r).not.toBe("400");
});

// deleteProject
test('Delete project', async () => {
  const r = await util.deleteProject(/* TODO */);

  console.log("Delete project: " + r);

  expect(r).not.toBe("400");
});