"use strict";
const Generator = require("yeoman-generator");
const { parse, addImport, generate } = require("../../utilities/Parser");

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      {
        type: "input",
        name: "serviceName",
        message: "Service name: "
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("service.js"),
      this.destinationPath(`src/services/${this.props.serviceName}.js`),
      this.props
    );

    const source = this.fs.read(this.destinationPath('src/App.js'));

    const ast = parse(source);

    addImport(ast, this.props.serviceName, `./Services/${this.props.serviceName}`);
    
    const code = generate(ast, source);

    this.fs.write(this.destinationPath('src/App.js'), code);
  }
};
