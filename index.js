#!/usr/bin/env node
const fs = require('fs');
const download = require('download-git-repo'); //从git仓库下载
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora'); //控制台的输出颜色
const chalk = require('chalk');
const symbols = require('log-symbols');
let program = require('commander');
program
  .version(require('./package').version, '-v, --version');
program.command('init-client <name>').action(async name => {
  await checkFile(name);
  const answers = await inquirer.prompt([
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
  const spinner = ora('初始化项目中...');
  spinner.start();
  const {project, type, author} = answers;
  let breath = `${project}_${type}`;
  let template_url = `direct:https://github.com/wyswill/vue-project-templeates.git#${breath}`;
  await clone(spinner, template_url, name, author);
});
program.command('init-server <name>').action(async name => {
  await checkFile(name);
  const {author} = await inquirer.prompt([
                                           {
                                             name   : 'author',
                                             message: '请输入作者名称'
                                           }
                                         ]);
  const spinner = ora('初始化项目中...');
  spinner.start();
  let template_url = `direct:https://github.com/wyswill/vue-project-templeates.git#server`;
  await clone(spinner, template_url, name, author);
});


program.parse(process.argv);

async function clone(spinner, template_url, name, author = '') {
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
        author
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
}

async function checkFile(name) {
  if (fs.existsSync(name)) {
    console.log(symbols.error, chalk.red('项目已存在'));
    process.exit(-1);
  }
}
