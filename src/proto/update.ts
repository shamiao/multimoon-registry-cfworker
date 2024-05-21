// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.175.1
//   protoc               v5.26.1
// source: update.proto

/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { File, Toolchain } from "./toolchain";

export const protobufPackage = "multimoon";

export interface CheckUpdateReq {
  arch: string;
  name: string;
}

export interface CheckUpdateRep {
  shouldUpdate: boolean;
}

export interface UpdateReq {
  arch: string;
  name: string;
  toolchain: Toolchain | undefined;
}

export interface UpdateRep {
}

export interface UploadFileReq {
  arch: string;
  name: string;
  type: string;
  file: File | undefined;
}

export interface UploadFileRep {
  path: string;
}

function createBaseCheckUpdateReq(): CheckUpdateReq {
  return { arch: "", name: "" };
}

export const CheckUpdateReq = {
  encode(message: CheckUpdateReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arch !== "") {
      writer.uint32(10).string(message.arch);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckUpdateReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckUpdateReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.arch = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckUpdateReq {
    return {
      arch: isSet(object.arch) ? globalThis.String(object.arch) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
    };
  },

  toJSON(message: CheckUpdateReq): unknown {
    const obj: any = {};
    if (message.arch !== "") {
      obj.arch = message.arch;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckUpdateReq>, I>>(base?: I): CheckUpdateReq {
    return CheckUpdateReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckUpdateReq>, I>>(object: I): CheckUpdateReq {
    const message = createBaseCheckUpdateReq();
    message.arch = object.arch ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCheckUpdateRep(): CheckUpdateRep {
  return { shouldUpdate: false };
}

export const CheckUpdateRep = {
  encode(message: CheckUpdateRep, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.shouldUpdate !== false) {
      writer.uint32(8).bool(message.shouldUpdate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckUpdateRep {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckUpdateRep();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.shouldUpdate = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckUpdateRep {
    return { shouldUpdate: isSet(object.shouldUpdate) ? globalThis.Boolean(object.shouldUpdate) : false };
  },

  toJSON(message: CheckUpdateRep): unknown {
    const obj: any = {};
    if (message.shouldUpdate !== false) {
      obj.shouldUpdate = message.shouldUpdate;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckUpdateRep>, I>>(base?: I): CheckUpdateRep {
    return CheckUpdateRep.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckUpdateRep>, I>>(object: I): CheckUpdateRep {
    const message = createBaseCheckUpdateRep();
    message.shouldUpdate = object.shouldUpdate ?? false;
    return message;
  },
};

function createBaseUpdateReq(): UpdateReq {
  return { arch: "", name: "", toolchain: undefined };
}

export const UpdateReq = {
  encode(message: UpdateReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arch !== "") {
      writer.uint32(10).string(message.arch);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.toolchain !== undefined) {
      Toolchain.encode(message.toolchain, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.arch = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.toolchain = Toolchain.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateReq {
    return {
      arch: isSet(object.arch) ? globalThis.String(object.arch) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      toolchain: isSet(object.toolchain) ? Toolchain.fromJSON(object.toolchain) : undefined,
    };
  },

  toJSON(message: UpdateReq): unknown {
    const obj: any = {};
    if (message.arch !== "") {
      obj.arch = message.arch;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.toolchain !== undefined) {
      obj.toolchain = Toolchain.toJSON(message.toolchain);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateReq>, I>>(base?: I): UpdateReq {
    return UpdateReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateReq>, I>>(object: I): UpdateReq {
    const message = createBaseUpdateReq();
    message.arch = object.arch ?? "";
    message.name = object.name ?? "";
    message.toolchain = (object.toolchain !== undefined && object.toolchain !== null)
      ? Toolchain.fromPartial(object.toolchain)
      : undefined;
    return message;
  },
};

function createBaseUpdateRep(): UpdateRep {
  return {};
}

export const UpdateRep = {
  encode(_: UpdateRep, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateRep {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateRep();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): UpdateRep {
    return {};
  },

  toJSON(_: UpdateRep): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateRep>, I>>(base?: I): UpdateRep {
    return UpdateRep.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateRep>, I>>(_: I): UpdateRep {
    const message = createBaseUpdateRep();
    return message;
  },
};

function createBaseUploadFileReq(): UploadFileReq {
  return { arch: "", name: "", type: "", file: undefined };
}

export const UploadFileReq = {
  encode(message: UploadFileReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arch !== "") {
      writer.uint32(10).string(message.arch);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.file !== undefined) {
      File.encode(message.file, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadFileReq {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadFileReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.arch = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.type = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.file = File.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadFileReq {
    return {
      arch: isSet(object.arch) ? globalThis.String(object.arch) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      file: isSet(object.file) ? File.fromJSON(object.file) : undefined,
    };
  },

  toJSON(message: UploadFileReq): unknown {
    const obj: any = {};
    if (message.arch !== "") {
      obj.arch = message.arch;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.type !== "") {
      obj.type = message.type;
    }
    if (message.file !== undefined) {
      obj.file = File.toJSON(message.file);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadFileReq>, I>>(base?: I): UploadFileReq {
    return UploadFileReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadFileReq>, I>>(object: I): UploadFileReq {
    const message = createBaseUploadFileReq();
    message.arch = object.arch ?? "";
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    message.file = (object.file !== undefined && object.file !== null) ? File.fromPartial(object.file) : undefined;
    return message;
  },
};

function createBaseUploadFileRep(): UploadFileRep {
  return { path: "" };
}

export const UploadFileRep = {
  encode(message: UploadFileRep, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.path !== "") {
      writer.uint32(10).string(message.path);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadFileRep {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadFileRep();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.path = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadFileRep {
    return { path: isSet(object.path) ? globalThis.String(object.path) : "" };
  },

  toJSON(message: UploadFileRep): unknown {
    const obj: any = {};
    if (message.path !== "") {
      obj.path = message.path;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadFileRep>, I>>(base?: I): UploadFileRep {
    return UploadFileRep.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadFileRep>, I>>(object: I): UploadFileRep {
    const message = createBaseUploadFileRep();
    message.path = object.path ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
