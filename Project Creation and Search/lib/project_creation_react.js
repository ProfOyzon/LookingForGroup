const React = require('react');
const ReactDOM = require('react-dom');
import { createRoot } from 'react-dom/client';
const ProjectCreator = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "id-box"
  }, /*#__PURE__*/React.createElement("label", {
    for: "id"
  }, "User: "), /*#__PURE__*/React.createElement("select", {
    id: "id",
    name: "id"
  }, /*#__PURE__*/React.createElement("option", {
    value: "-1"
  }, "Select a user"))), /*#__PURE__*/React.createElement("div", {
    id: "title-box"
  }, /*#__PURE__*/React.createElement("label", {
    for: "title"
  }, "Project Title: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "title",
    name: "title"
  })), /*#__PURE__*/React.createElement("div", {
    id: "size-box"
  }, /*#__PURE__*/React.createElement("label", {
    for: "size"
  }, "Project Size: "), /*#__PURE__*/React.createElement("select", {
    id: "size",
    name: "size"
  }, /*#__PURE__*/React.createElement("option", {
    value: "small"
  }, "Small"), /*#__PURE__*/React.createElement("option", {
    value: "medium"
  }, "Medium"), /*#__PURE__*/React.createElement("option", {
    value: "large"
  }, "Large"))), /*#__PURE__*/React.createElement("div", {
    id: "desc-box"
  }, /*#__PURE__*/React.createElement("label", {
    for: "description"
  }, "Description: "), /*#__PURE__*/React.createElement("textarea", {
    id: "description",
    name: "description"
  })), /*#__PURE__*/React.createElement("div", {
    id: "img-box"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "image",
    name: "image",
    accept: "image/*"
  })), /*#__PURE__*/React.createElement("div", {
    id: "keywords-box"
  }, /*#__PURE__*/React.createElement("h3", null, "Project Keywords"), /*#__PURE__*/React.createElement("div", {
    id: "keyword-container"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "keyword",
    list: "keyword-list",
    name: "keyword"
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "keyword-list"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Game"
  }, "Game"), /*#__PURE__*/React.createElement("option", {
    value: "2d"
  }, "2d"), /*#__PURE__*/React.createElement("option", {
    value: "3d"
  }, "3d"), /*#__PURE__*/React.createElement("option", {
    value: "Analog"
  }, "Analog"), /*#__PURE__*/React.createElement("option", {
    value: "Digital"
  }, "Digital"), /*#__PURE__*/React.createElement("option", {
    value: "Casual"
  }, "Casual")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    id: "keyword-submit",
    name: "keyword-submit"
  }, "Add keyword")), /*#__PURE__*/React.createElement("div", {
    id: "roles-box"
  }, /*#__PURE__*/React.createElement("h3", null, "Project Roles"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    id: "add-role"
  }, "Add new role type"), /*#__PURE__*/React.createElement("div", {
    id: "roles"
  })), /*#__PURE__*/React.createElement("div", {
    id: "prefs-box"
  }, /*#__PURE__*/React.createElement("h3", null, "Project Preferences"), /*#__PURE__*/React.createElement("textarea", {
    id: "preferences",
    name: "preferences"
  })), /*#__PURE__*/React.createElement("div", {
    id: "links-box"
  }, /*#__PURE__*/React.createElement("h3", null, "Related Links"), /*#__PURE__*/React.createElement("div", {
    id: "link-container"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "link-input",
    name: "link-input"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    id: "link-submit"
  }, "Add link")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    id: "submit",
    name: "submit"
  }, "Create Project"), /*#__PURE__*/React.createElement("p", null, "...This html was brought to you by React.js"));
};
const init = () => {
  const ProjectForm = createRoot(document.getElementById('project-form'));
  ProjectForm.render( /*#__PURE__*/React.createElement(ProjectCreator, null));
  console.log('is this even running?');
};
window.onload = init;