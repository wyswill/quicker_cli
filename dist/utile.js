"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const chalk_1 = __importDefault(require("chalk"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const handlebars_1 = __importDefault(require("handlebars"));
const os_1 = __importDefault(require("os"));
class Util {
    static checkFile(name) {
        if (fs_1.default.existsSync(name)) {
            console.log(log_symbols_1.default.error, chalk_1.default.red("项目已存在"));
            process.exit(-1);
        }
    }
    static cloneGit(spinner, breath, author, name) {
        let template_url = `direct:https://github.com/wyswill/vue-project-templeates.git#${breath}`;
        download_git_repo_1.default(template_url, name, { clone: true }, (err) => {
            if (err) {
                spinner.fail();
                console.log(log_symbols_1.default.error, chalk_1.default.red(err));
            }
            else {
                spinner.succeed();
                const fileName = `${name}/package.json`;
                const meta = {
                    name,
                    author: author,
                };
                if (fs_1.default.existsSync(fileName)) {
                    const content = fs_1.default.readFileSync(fileName).toString();
                    const result = handlebars_1.default.compile(content)(meta);
                    fs_1.default.writeFileSync(fileName, result);
                }
                console.log(log_symbols_1.default.success, chalk_1.default.green("项目初始化完成"));
                console.log(log_symbols_1.default.success, chalk_1.default.green(`cd ${fileName} && npm run install`));
            }
        });
    }
}
exports.default = Util;
Util.homePath = os_1.default.homedir();
