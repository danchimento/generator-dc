"use strict";
const Generator = require("yeoman-generator");
const fs = require("fs");
const { parse, addCode } = require("../../utilities/Parser");

module.exports = class extends Generator {
  prompting() {

    let projects = fs.readdirSync(this.destinationRoot());
    const prompts = [];

    prompts.push({
      type: "list",
      name: "project",
      message: "API project: ",
      choices: projects
    })
    prompts.push({
      type: 'list',
      name: 'method',
      message: 'Method: ',
      default: 'get',
      choices: ['get', 'post', 'put', 'delete']
    })
    prompts.push({
      type: 'input',
      name: 'route',
      message: 'Route: ',
      default: '/endpoint'
    })

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    let filePath = this.destinationPath(`/${this.props.project}`);
    this.fs.copyTpl(this.templatePath('endpoint.js'), filePath, this.props);
    
    let code = this.fs.read(filePath);
    let ast = parse(code);

    addCode(ast, code);

    this.fs.delete(filePath);
  }

  install() {
    this.npmInstall();
  }
};
