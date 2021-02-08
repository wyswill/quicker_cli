#!/usr/bin/env node
const fs = require('fs');
const download = require('download-git-repo'); //从git仓库下载
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora'); //控制台的输出颜色
const chalk = require('chalk');
const symbols = require('log-symbols');

const checkFile = (name) => {
  if (fs.existsSync(name)) {
    console.log(symbols.error, chalk.red('项目已存在'));
    process.exit(-1);
  }
};
const clone = (spinner, breath, author, name) => {
  let template_url = `direct:https://github.com/wyswill/vue-project-templeates.git#${breath}`;
  download(template_url, name, {clone: true}, err => {
    if (err) {
      spinner.fail();
      console.log(symbols.error, chalk.red(err));
    }
    else {
      spinner.succeed();
      const fileName = `${name}/package.json`;
      const meta = {
        name,
        author: author
      };
      if (fs.existsSync(fileName)) {
        const content = fs.readFileSync(fileName).toString();
        const result = handlebars.compile(content)(meta);
        fs.writeFileSync(fileName, result);
      }
      console.log(symbols.success, chalk.green('项目初始化完成'));
      console.log(
        symbols.success,
        chalk.green(`cd ${fileName} && npm run install`)
      );
    }
  });
};
program
  .version(require('./package').version, '-v, --version');
program
  .command('init-client <name>')
  .action(async name => {
    checkFile(name);
    const {project, type, author} = await inquirer.prompt([
                                                            {
                                                              message: '选择要创建的项目框架：',
                                                              name   : 'project',
                                                              type   : 'list',
                                                              choices: ['vue', 'react']
                                                            },
                                                            {
                                                              message: '选择项目类型:',
                                                              name   : 'type',
                                                              type   : 'list',
                                                              choices: ['project', 'admin']
                                                            },
                                                            {
                                                              name   : 'author',
                                                              message: '请输入作者名称'
                                                            }
                                                          ]);
    const spinner = ora('初始化项目中...').start();
    let breath = `${project}_${type}`;
    clone(spinner, breath, author, name);
  });

program.command('init-server <name>').action(async name => {
  checkFile(name);
  const {author} = await inquirer.prompt([
                                           {
                                             name   : 'author',
                                             message: '请输入作者名称'
                                           }
                                         ]);
  const spinner = ora('初始化项目中...').start();
  let breath = `server`;
  clone(spinner, breath, author, name);
});

program.parse(process.argv);
