"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "repoName",
        message: "Repo Name: ",
        default: this.options.defaultName
      }
    ]).then(props => {
      this.props = { ...props, ...this.props };
    });
  }

  install() {
    let opts = { cwd: this.options.path };

    // 1. Authenticate with Github
    let status = this.spawnCommandSync("gh", ["auth", "status"], {
      stdio: [process.stderr]
    });
    const output = status.output.toString();

    if (output.indexOf("not logged in") > -1) {
      this.spawnCommandSync("gh", ["auth", "login", "-w"]);
    }

    // Init the repo, commit ever
    this.spawnCommandSync("git", ["init"], opts);
    this.spawnCommandSync("git", ["add", "."], opts);
    this.spawnCommandSync(
      "git",
      ["commit", '-m "Initializing repo with yeoman"'],
      opts
    );
    this.spawnCommandSync("git", ["branch", "develop"], opts);
    this.spawnCommandSync("git", ["checkout", "develop"], opts);
    this.spawnCommandSync(
      "gh",
      ["repo", "create", this.props.repoName, "--private", "--confirm"],
      opts
    );
    this.spawnCommandSync("git", ["push", "origin", "master"], opts);
    this.spawnCommandSync("git", ["push", "origin", "develop"], opts);
  }
};
