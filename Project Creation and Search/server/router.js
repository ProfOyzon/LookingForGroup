const router = (app) => {
  app.get('/project-creator', (req, res) => {
    res.render('project_creation');
  });
  app.get('/profile-creator', (req, res) => {
    res.render('profile_creation')
  });
  app.get('/search', (req, res) => {
    res.render('search')
  })
  app.get('/', (req, res) => {
    res.render('project_creation');
  });
}

module.exports = router;