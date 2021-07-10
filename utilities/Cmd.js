const { exec } = require("child_process");

module.exports = {
  login: () => {
    return new Promise((resolve, reject) => {
      exec("gh auth login -w", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }

        resolve(stdout);
      });
    });
  },

  createRepo: name => {
    return new Promise((resolve, reject) => {
      exec(
        `gh repo create ${name} --confirm --private`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }

          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }

          resolve(stdout);
        }
      );
    });
  }
};
