import util from '../utils/projectUtils'

test("Get all projects", () => {
    expect(util.getProjects()).not.toBe("400");
});

