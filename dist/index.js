#!/usr/bin/env/node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const commander_1 = __importDefault(require("commander"));
const utile_1 = __importDefault(require("./utile"));
console.log(commander_1.default.opts());
commander_1.default.version(require("../package").version, "-v, --version");
commander_1.default.command("init-client <name>").action(async (name) => {
    utile_1.default.checkFile(name);
    const { project, type, author } = await inquirer_1.default.prompt([
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
    const spinner = ora_1.default("初始化项目中...").start();
    let breath = `${project}_${type}`;
    utile_1.default.cloneGit(spinner, breath, author, name);
});
commander_1.default.command("init-server <name>").action(async (name) => {
    utile_1.default.checkFile(name);
    const { author } = await inquirer_1.default.prompt([
        {
            name: "author",
            message: "请输入作者名称",
        },
    ]);
    const spinner = ora_1.default("初始化项目中...").start();
    let breath = `server`;
    utile_1.default.cloneGit(spinner, breath, author, name);
});
commander_1.default.parse(process.argv);
