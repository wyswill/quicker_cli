/*
 * @LastEditors: wyswill
 * @Description: utils
 * @Date: 2021-04-01 15:42:34
 * @LastEditTime: 2021-04-01 15:48:35
 */
import chalk from 'chalk';
import download from 'download-git-repo'; //从git仓库下载
import fs from 'fs';
import symbols from 'log-symbols';
import { Ora } from 'ora';
import os from 'os';
import { temp } from './temp';

export default class Util {
  static homePath: string = os.homedir();

  static checkFile(name: string) {
    if (fs.existsSync(name)) {
      console.log(symbols.error, chalk.red('项目已存在'));
      process.exit(-1);
    }
  }

  static cloneGit(spinner: Ora, breath: string, author: string, name: string) {
    const template_url = `direct:https://github.com/wyswill/vue-project-templeates.git#${breath}`;
    download(template_url, name, { clone: true }, (err: any) => {
      if (err) {
        spinner.fail();
        console.log(symbols.error, chalk.red(err));
      } else {
        spinner.succeed();
        const fileName = `${name}/package.json`;
        const meta = { name, author };
        if (fs.existsSync(fileName)) {
          const content = fs.readFileSync(fileName).toString();
          const result = JSON.parse(content);
          fs.writeFileSync(
            fileName,
            JSON.stringify(Object.assign(result, meta), null, 2),
          );
        }
        if (breath === 'server_grpc') {
          const protoUrl = `${name}/src/rpc/${name}.proto`,
            testFile = `${name}/test/${name}.test.ts`;
          fs.mkdirSync(`${name}/src/rpc`);
          fs.writeFileSync(protoUrl, temp.proto(name), { flag: 'w+' });
          fs.writeFileSync(testFile, temp.testFill(name), { flag: 'w+' });
        }
        console.log(symbols.success, chalk.green('项目初始化完成'));
        console.log(
          symbols.success,
          chalk.green(`cd ${name} && npm run install`),
        );
      }
    });
  }
}
