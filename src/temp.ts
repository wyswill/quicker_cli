export const temp = {
  proto: (name: string) => `
  syntax = "proto3";
  package ${name};

  message helloReq {
  }
  message helloRsp {
  }
  service ${name}_service {
    rpc hello(helloReq) returns (helloRsp);
  }
  `,
  testFill: (name: string) => `
  import path from 'path';
  import { promisify } from 'util';
  import { ${name} } from '../src/rpc/bundle';
  import RpcQuery from './base';
  const rq = new RpcQuery({
    host: 'localhost:50051',
    packge: '${name}',
  });
  const client = rq.getClient<${name}_service>();
  client.hello = promisify(client.hello);
  async function asd() {
    const res = await client.hello();
    console.log(res);
  }
  asd();  
  `,
};
