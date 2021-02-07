#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo'); //从git仓库下载
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora'); //控制台的输出颜色
const chalk = require('chalk');
const symbols = require('log-symbols');
program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .action(async name => {
    if (!fs.existsSync(name)) {
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
      console.log(template_url);
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
            author: answers.author
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
    else {
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  });
program.parse(process.argv);
