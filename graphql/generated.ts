import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type Buzzer = {
  __typename?: 'Buzzer';
  allowUserToClearResponse: Scalars['Boolean']['output'];
  creator: UnauthenticatedUser;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presses: Array<BuzzerPresses>;
  state: BuzzerState;
};

export type BuzzerAvailability = {
  __typename?: 'BuzzerAvailability';
  isAvailable: Scalars['Boolean']['output'];
  reason?: Maybe<Array<Scalars['String']['output']>>;
};

export type BuzzerPresses = {
  __typename?: 'BuzzerPresses';
  pressedAt: Scalars['DateTime']['output'];
  user: UnauthenticatedUser;
};

export enum BuzzerState {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type Mutation = {
  __typename?: 'Mutation';
  signInAsUnauthenticatedUser?: Maybe<UnauthenticatedUser>;
  updateUnauthenticatedUser?: Maybe<UnauthenticatedUser>;
};


export type MutationSignInAsUnauthenticatedUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationUpdateUnauthenticatedUserArgs = {
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  buzzer?: Maybe<Buzzer>;
  unauthenticatedSelf?: Maybe<UnauthenticatedUser>;
  user?: Maybe<UnauthenticatedUser>;
};


export type QueryBuzzerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  buzzerAvailability: BuzzerAvailability;
  countdown: Scalars['Int']['output'];
};


export type SubscriptionBuzzerAvailabilityArgs = {
  code: Scalars['String']['input'];
};


export type SubscriptionCountdownArgs = {
  from: Scalars['Int']['input'];
};

export type UnauthenticatedUser = {
  __typename?: 'UnauthenticatedUser';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GetBuzzerByIdQueryVariables = Exact<{
  buzzerId: Scalars['ID']['input'];
}>;


export type GetBuzzerByIdQuery = { __typename?: 'Query', buzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, creator: { __typename?: 'UnauthenticatedUser', id: string, name: string }, presses: Array<{ __typename?: 'BuzzerPresses', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type GetUnauthenticatedSelfQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnauthenticatedSelfQuery = { __typename?: 'Query', unauthenticatedSelf?: { __typename?: 'UnauthenticatedUser', id: string, name: string } | null };

export type SignInAsUnauthenticatedUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SignInAsUnauthenticatedUserMutation = { __typename?: 'Mutation', signInAsUnauthenticatedUser?: { __typename?: 'UnauthenticatedUser', id: string, name: string } | null };

export type UpdateUnauthenticatedUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UpdateUnauthenticatedUserMutation = { __typename?: 'Mutation', updateUnauthenticatedUser?: { __typename?: 'UnauthenticatedUser', id: string, name: string } | null };

export type SubscriptionSubscriptionVariables = Exact<{
  from: Scalars['Int']['input'];
}>;


export type SubscriptionSubscription = { __typename?: 'Subscription', countdown: number };

export type BuzzerAvailabilitySubscriptionVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type BuzzerAvailabilitySubscription = { __typename?: 'Subscription', buzzerAvailability: { __typename?: 'BuzzerAvailability', isAvailable: boolean, reason?: Array<string> | null } };

export const GetBuzzerByIdDocument = gql`
    query GetBuzzerById($buzzerId: ID!) {
  buzzer(id: $buzzerId) {
    id
    name
    creator {
      id
      name
    }
    state
    allowUserToClearResponse
    presses {
      user {
        id
        name
      }
      pressedAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuzzerByIdGQL extends Apollo.Query<GetBuzzerByIdQuery, GetBuzzerByIdQueryVariables> {
    document = GetBuzzerByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUnauthenticatedSelfDocument = gql`
    query GetUnauthenticatedSelf {
  unauthenticatedSelf {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUnauthenticatedSelfGQL extends Apollo.Query<GetUnauthenticatedSelfQuery, GetUnauthenticatedSelfQueryVariables> {
    document = GetUnauthenticatedSelfDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignInAsUnauthenticatedUserDocument = gql`
    mutation SignInAsUnauthenticatedUser($name: String!) {
  signInAsUnauthenticatedUser(name: $name) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignInAsUnauthenticatedUserGQL extends Apollo.Mutation<SignInAsUnauthenticatedUserMutation, SignInAsUnauthenticatedUserMutationVariables> {
    document = SignInAsUnauthenticatedUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUnauthenticatedUserDocument = gql`
    mutation UpdateUnauthenticatedUser($name: String!) {
  updateUnauthenticatedUser(name: $name) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUnauthenticatedUserGQL extends Apollo.Mutation<UpdateUnauthenticatedUserMutation, UpdateUnauthenticatedUserMutationVariables> {
    document = UpdateUnauthenticatedUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SubscriptionDocument = gql`
    subscription Subscription($from: Int!) {
  countdown(from: $from)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SubscriptionGQL extends Apollo.Subscription<SubscriptionSubscription, SubscriptionSubscriptionVariables> {
    document = SubscriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BuzzerAvailabilityDocument = gql`
    subscription BuzzerAvailability($code: String!) {
  buzzerAvailability(code: $code) {
    isAvailable
    reason
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BuzzerAvailabilityGQL extends Apollo.Subscription<BuzzerAvailabilitySubscription, BuzzerAvailabilitySubscriptionVariables> {
    document = BuzzerAvailabilityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }