#!/usr/bin/env/node
/*
 * @LastEditors: wyswill
 * @Description: 主文件
 * @Date: 2021-04-01 15:25:17
 * @LastEditTime: 2021-04-01 16:06:47
 */
import inquirer from "inquirer";
import ora from "ora"; //控制台的输出颜色
import program from "commander";
import Util from "./utile";
import _ from "lodash";
program.version(require("../package").version, "-v, --version");
program.command("init-client <name>").action(async name => {
  Util.checkFile(name);
  const { project, type, author } = await inquirer.prompt([
    {
      message: "选择要创建的项目框架：",
      name: "project",
      type: "list",
      choices: ["vue", "react"],
    },
    {
      message: "选择项目类型:",
      name: "type",
      type: "list",
      choices: ["project", "admin"],
    },
    {
      name: "author",
      message: "请输入作者名称",
    },
  ]);
  const spinner = ora("初始化项目中...").start();
  let breath = `${project}_${type}`;
  Util.cloneGit(spinner, breath, author, name);
});
program.command("init-server <name>").action(async name => {
  Util.checkFile(name);
  const { author } = await inquirer.prompt([
    {
      name: "author",
      message: "请输入作者名称",
    },
  ]);
  const spinner = ora("初始化项目中...").start();
  let breath = `server`;
  Util.cloneGit(spinner, breath, author, name);
});

program.parse(process.argv);
