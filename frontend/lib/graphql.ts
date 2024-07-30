import { RequestMiddleware, GraphQLClient } from "graphql-request";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useAuth } from "@clerk/nextjs";
import { env } from "next-runtime-env";

export function useGraphQLQuery<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): {
  queryFn: (props: { queryKey: any }) => Promise<TResult>;
} {
  const { getToken } = useAuth();
  const requestMiddleware: RequestMiddleware = async (request: any) => {
    return {
      ...request,
      headers: {
        ...request.headers,
        "content-type": "application/json",
        authorization: `Bearer ${await getToken()}`,
      },
    };
  };

  const client = new GraphQLClient(`${env("NEXT_PUBLIC_API_URL")}/graphql`, {
    requestMiddleware,
  });
  return {
    queryFn: async ({ queryKey }: { queryKey: any }) => {
      return await client.request(document, {
          ...variables,
        }
      );
    },
  };
}

export function useGraphQLMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
): {
  mutationFn: (
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
  ) => Promise<TResult>;
} {
  const { getToken } = useAuth();
  const requestMiddleware: RequestMiddleware = async (request: any) => {
    return {
      ...request,
      headers: {
        ...request.headers,
        "content-type": "application/json",
        authorization: `Bearer ${await getToken()}`,
      },
    };
  };

  const client = new GraphQLClient(`${env("NEXT_PUBLIC_API_URL")}/graphql`, {
    requestMiddleware,
  });

  return {
    mutationFn: async (
      ...[variables]: TVariables extends Record<string, never>
        ? []
        : [TVariables]
    ) => {
      console.log(variables);
      return await client.request(document, {
        ...variables,
      });
    },
  };
}