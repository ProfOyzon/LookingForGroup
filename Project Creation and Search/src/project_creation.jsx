const React = require('react');
const ReactDOM = require('react-dom');
import {createRoot} from 'react-dom/client';

const ProjectCreator = (props) =>
{
  return (
    <>
    <div id="id-box">
      <label for="id">User: </label>
      <select id="id" name="id">
        <option value="-1">Select a user</option>
      </select>
    </div>

    <div id="title-box">
      <label for="title">Project Title: </label>
      <input type="text" id="title" name="title" />
    </div>

    <div id="size-box">
      <label for="size">Project Size: </label>
      <select id="size" name="size">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>

    <div id="desc-box">
      <label for="description">Description: </label>
      <textarea id="description" name="description"></textarea>
    </div>

    <div id="img-box">
      <input type="file" id="image" name="image" accept="image/*" />
    </div>

    <div id="keywords-box">
      <h3>Project Keywords</h3>
      <div id="keyword-container">

      </div>
      <input type="text" id="keyword" list="keyword-list" name="keyword"/>
      <datalist id="keyword-list">
        <option value="Game">Game</option>
        <option value="2d">2d</option>
        <option value="3d">3d</option>
        <option value="Analog">Analog</option>
        <option value="Digital">Digital</option>
        <option value="Casual">Casual</option>
      </datalist>
      <button type="button" id="keyword-submit" name="keyword-submit">Add keyword</button>
    </div>

    <div id="roles-box">
      <h3>Project Roles</h3>
      <button type="button" id="add-role">Add new role type</button>
      <div id="roles">

      </div>
    </div>

    <div id="prefs-box">
      <h3>Project Preferences</h3>
      <textarea id="preferences" name="preferences"></textarea>
    </div>

    <div id="links-box">
      <h3>Related Links</h3>
      <div id="link-container">

      </div>
      <input type="text" id="link-input" name="link-input"/>
      <button type="button" id="link-submit">Add link</button>
    </div>

    <button type="button" id="submit" name="submit">Create Project</button>
    <p>...This html was brought to you by React.js</p>
    </>
  );
}

const init = () =>
{
  const ProjectForm = createRoot(document.getElementById('project-form'));
  ProjectForm.render(<ProjectCreator />);
  console.log('is this even running?');
}

window.onload = init;