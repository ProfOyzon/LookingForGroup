import pool from '../config/database.js';

const dirname = import.meta.dirname;

/**
 * Retirves all projects the user is a member of
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param res - response
 * @returns res.status - {status:200, data:projects} if success, else {status:400|401, error:...}
 */
const getMyProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (`${req.session.userId}` !== `${id}`) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  try {
    // Get projects the user is a member of
    const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, p.user_id, p.created_at, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ?
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is a member of',
    });
  }
};

/**
 * Retirves all public visible projects the user is a member of
 * @param req - req.params.id - user ID
 * @param res - response
 * @returns res.status - {status:200, data:projects} if success, else {status:400, error:...}
 */
const getVisibleProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get projects the user is a member and is set to be publicly visible
    const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, p.created_at, g.project_types, t.tags, f.followers
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id
                JOIN (SELECT pf.project_id, JSON_ARRAYAGG(JSON_OBJECT('id', pf.user_id)) AS followers
                    FROM project_followings pf
                    GROUP BY pf.project_id) f
                ON p.project_id = f.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ? AND profile_visibility = "public"
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    // Format the follower section so it doesn't provide IDs
    projects.forEach((project) => {
      let followers = project.followers;

      project.followers = {
        count: followers.length,
        isFollowing: followers.find((follower) => req.session.userId === follower.id) !== undefined,
      };
    });

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error:
        'An error occurred while getting projects the user is a member of and that are publicly visible',
    });
  }
};

/**
 * Changes the visibility of a users project (public or private)
 * @param req - req.params.id - user ID, req.session - seesion user ID
 * @param req - req.body - {projId, visibility}
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateProjectVisibility = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const { projectId, visibility } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projectId || projectId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  } else if (!visibility) {
    return res.status(400).json({
      status: 400,
      error: 'Missing a visibility',
    });
  }

  try {
    // Update a project visibility on user profiles
    const sql = 'UPDATE members SET profile_visibility = ? WHERE project_id = ? AND user_id = ?';
    const values = [visibility, projectId, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the visibility of a project on a user's profile",
    });
  }
};

/**
 * Gets all projects the user is following
 * @param req - req.params.id - user ID
 * @param res - response
 * @returns res.status - {status:200, data:projects} if success, else {status:400, error:...}
 */
const getProjectFollowing = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get projects the user is following
    const sql = `SELECT p.*, pf.followed_at
            FROM project_followings pf
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON pf.project_id = p.project_id
            WHERE pf.user_id = ?
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is following',
    });
  }
};

/**
 * Adds a link between a project and user that indicates the user is “following” that project to database.
 * @param req - req.params.id - user ID, req.body.projectId - project ID to follow
 * @param res - response
 * @returns res.status - {status:201} if success, else {status:400|401, error:...}
 */
const addProjectFollowing = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const projectId = parseInt(req.body.projectId);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projectId || projectId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  }

  try {
    // Add a project the user decided to follow
    await pool.query('INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)', [
      id,
      projectId,
    ]);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a project the user wants to follow',
    });
  }
};

/**
 * Removes a link between a project and user that indicates the user is not “following” that project anymore from database.
 * @param req - req.params.id - user ID, req.params.projectId - project ID to unfollow
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const deleteProjectFollowing = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const projId = parseInt(req.params.projId);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projId || projId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  }

  try {
    // Delete a project the user was following
    await pool.query('DELETE FROM project_followings WHERE user_id = ? AND project_id = ?', [
      id,
      projId,
    ]);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a project the user wants to unfollow',
    });
  }
};

/**
 * Gets all other users the user is following
 * @param req - req.params.id - user ID
 * @param res - response
 * @returns res.status - {status:200, data:users} if success, else {status:400, error:...}
 */
const getUserFollowing = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get people the user is following
    const sql = `SELECT u.*, uf.followed_at 
            FROM user_followings uf
            JOIN (SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, s.skills
                FROM users u
                    LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                    FROM job_titles jt) jt
                        ON u.job_title_id = jt.title_id
                    LEFT JOIN (SELECT m.major_id, m.label AS major
                    FROM majors m) m
                        ON u.major_id = m.major_id
                    LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                        "position", us.position)) AS skills
                        FROM user_skills us 
                        JOIN skills s 
                            ON us.skill_id = s.skill_id
                        GROUP BY us.user_id) s
                    ON u.user_id = s.user_id
                GROUP BY u.user_id) u
            ON uf.following_id = u.user_id
            WHERE uf.user_id = ?
        `;
    const values = [id];
    const [users] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting people the user is following',
    });
  }
};

/**
 * Adds a link between two users to indicate one is “following” the other in database
 * @param req - req.params.id - user ID, req.body.userId - ID of target user to follow
 * @param res - response
 * @returns res.status - {status:201} if success, else {status:400|401, error:...}
 */
const addUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!userId || userId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
  }

  try {
    // Add entry to track user following a person
    await pool.query('INSERT INTO user_followings (user_id, following_id) VALUES (?, ?)', [
      id,
      userId,
    ]);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a person the user wants to follow',
    });
  }
};

/**
 * Removes a link between two user to indicate one is not “following” the other anymore from database.
 * @param req - req.params.id - user ID, req.body.userId - ID of target user to unfollow
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const deleteUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!userId || userId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
  }

  try {
    // Delete entry tracking the user following a person
    await pool.query('DELETE FROM user_followings WHERE user_id = ? AND following_id = ?', [
      id,
      userId,
    ]);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a person the user wants to unfollow',
    });
  }
};

// Removed due to Vite compilation error, still need to be added at some point
// blockUser,
// unblockUser,
// reportUser,

// Block a user
export default {
  login,
  getAuth,
  logout,
  signup,
  createUser,
  requestPasswordReset,
  resetPassword,
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUsernameBySession,
  updateUser,
  deleteUser,
  updateProfilePicture,
  getAccount,
  updateEmail,
  updateUsername,
  updatePassword,
  updateUserVisibility,
  getMyProjects,
  getVisibleProjects,
  updateProjectVisibility,
  getProjectFollowing,
  addProjectFollowing,
  deleteProjectFollowing,
  getUserFollowing,
  addUserFollowing,
  deleteUserFollowing,
};
