"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const { snakeCase } = require("snake-case");

module.exports = class extends Generator {
  initializing() {}

  async prompting() {
    this.log(`Welcome to ${chalk.red("d-constructor")}.`);

    var prompts = [
      {
        type: "input",
        name: "appName",
        message: "Readable API Name: "
      }
    ];

    let answers1 = await this.prompt(prompts);

    prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Project Name: ",
        default: snakeCase(answers1.appName)
      }
    ];

    let answers2 = await this.prompt(prompts);

    this.props = {
      ...answers1,
      ...answers2,
      path: `./${answers2.projectName}`
    };

    this.composeWith("dc:repo", {
      path: this.props.path,
      defaultName: this.props.projectName
    });
  }

  async writing() {
    this.fs.copyTpl(
      this.templatePath("**/!(_)*"),
      this.props.path,
      null,
      null,
      { globOptions: { dot: true } }
    );
  }

  install() {
    this.spawnCommandSync("npm", ["install"], { cwd: this.props.path });
  }
};
