import { JSON } from "json-as/assembly";
import { Deps } from "./deps";
import { ExternalApi, ExternalQuerier, ExternalStorage } from "./imports";
import { Region } from "./memory";
import { Reply, Response } from "./results";
import { Env, MessageInfo } from "./types";

export function allocate(size: usize): u32 {
  return Region.alloc(size) as u32;
}

export function deallocate(pointer: u32): void {
  Region.consumeRegion(pointer);
}

export function doInstantiate<M>(instantiateFn: (deps: Deps, env: Env, info: MessageInfo, msg: M) => Response, envPtr: u32, infoPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const infoBytes = Region.consumeRegion(infoPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const info = JSON.parse<MessageInfo>(String.UTF8.decode(infoBytes.buffer));
  const msg = JSON.parse<M>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = instantiateFn(deps, env, info, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

export function doExecute<M>(executeFn: (deps: Deps, env: Env, info: MessageInfo, msg: M) => Response, envPtr: u32, infoPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const infoBytes = Region.consumeRegion(infoPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const info = JSON.parse<MessageInfo>(String.UTF8.decode(infoBytes.buffer));
  const msg = JSON.parse<M>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = executeFn(deps, env, info, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

export function doMigrate<M>(migrateFn: (deps: Deps, env: Env, msg: M) => Response, envPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const msg = JSON.parse<M>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = migrateFn(deps, env, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

export function doSudo<M>(sudoFn: (deps: Deps, env: Env, msg: M) => Response, envPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const msg = JSON.parse<M>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = sudoFn(deps, env, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

export function doReply(replyFn: (deps: Deps, env: Env, msg: Reply) => Response, envPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const msg = JSON.parse<Reply>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = replyFn(deps, env, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

export function doQuery<M>(queryFn: (deps: Deps, env: Env, msg: M) => Response, envPtr: u32, msgPtr: u32): u32 {
  const envBytes = Region.consumeRegion(envPtr);
  const msgBytes = Region.consumeRegion(msgPtr);

  const env = JSON.parse<Env>(String.UTF8.decode(envBytes.buffer));
  const msg = JSON.parse<M>(String.UTF8.decode(msgBytes.buffer));

  const deps = makeDependencies();
  const res = queryFn(deps, env, msg);
  const v = Uint8Array.wrap(String.UTF8.encode(JSON.stringify(res)));
  return Region.releaseBuffer(v);
}

function makeDependencies(): Deps {
  return new Deps(new ExternalStorage(), new ExternalApi(), new ExternalQuerier());
}