import { ApplicationConfig, provideExperimentalZonelessChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, Observable, Operation, split } from '@apollo/client/core';
import { Kind, OperationTypeNode, print } from 'graphql';
import { createClient, ClientOptions, Client, ExecutionResult } from 'graphql-sse';
import { getMainDefinition } from '@apollo/client/utilities';


class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public override request(operation: Operation): Observable<ExecutionResult> {
    return new Observable((sink) => {
      return this.client.subscribe<ExecutionResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        },
      );
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const http = httpLink.create({
        uri: 'https://bluesea.com:3000/graphql',
        withCredentials: true,
      });

      const sse = new SSELink({
        url: 'https://bluesea.com:3000/graphql',
        credentials: 'include',
      });

      const link = split(
        // Split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        sse,
        http,
      );

      return {
        link,
        cache: new InMemoryCache(),
        // other options...
      };
    })
  ]
};
