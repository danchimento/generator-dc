"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const { snakeCase } = require("snake-case");

module.exports = class extends Generator {
  prompting() {
    this.log(`Welcome to ${chalk.red("d-constructor")}.`);

    var prompts = [
      {
        type: "input",
        name: "appName",
        message: "Readable app Name: "
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;

      prompts = [
        {
          type: "input",
          name: "projectName",
          message: "Project Name: ",
          default: snakeCase(props.appName)
        }
      ];

      return this.prompt(prompts).then(props => {
        this.props = { ...props, ...this.props }
      });
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath(),
      this.destinationPath(`${this.props.projectName}`)
    );
  }

  install() {
    this.npmInstall();
  }
};
