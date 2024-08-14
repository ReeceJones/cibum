import { z } from "zod";

export function nodeId<T>() {
  return z.object({
    id: z.string(),
    data: z.custom<T>(),
  });
}

export type NodeIdObject<T> = z.infer<ReturnType<typeof nodeId<T>>>;

interface HasId {
  id: any;
}


export function asNodeIdObject<T>(data: T & HasId): NodeIdObject<T> {
  return {
    id: data.id.toString(),
    data,
  };
}
