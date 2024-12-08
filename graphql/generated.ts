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
  presses: Array<BuzzerPress>;
  state: BuzzerState;
};

export type BuzzerAvailability = {
  __typename?: 'BuzzerAvailability';
  isAvailable: Scalars['Boolean']['output'];
  isPressed: Scalars['Boolean']['output'];
};

export type BuzzerPress = {
  __typename?: 'BuzzerPress';
  pressedAt: Scalars['DateTime']['output'];
  user: UnauthenticatedUser;
};

export type BuzzerPressSubscription = {
  __typename?: 'BuzzerPressSubscription';
  action: Scalars['String']['output'];
  presses?: Maybe<Array<BuzzerPress>>;
};

export enum BuzzerState {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type ClearBuzzerPressesInput = {
  code: Scalars['String']['input'];
  userIds: Array<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  clearAllBuzzerPresses: Array<BuzzerPress>;
  clearBuzzerPresses: Array<BuzzerPress>;
  createBuzzer?: Maybe<Buzzer>;
  lockBuzzer?: Maybe<Buzzer>;
  pressBuzzer: Scalars['Boolean']['output'];
  signInAsUnauthenticatedUser?: Maybe<UnauthenticatedUser>;
  unlockBuzzer?: Maybe<Buzzer>;
  updateBuzzerCode?: Maybe<Buzzer>;
  updateUnauthenticatedUser?: Maybe<UnauthenticatedUser>;
};


export type MutationClearAllBuzzerPressesArgs = {
  code: Scalars['String']['input'];
};


export type MutationClearBuzzerPressesArgs = {
  input: ClearBuzzerPressesInput;
};


export type MutationCreateBuzzerArgs = {
  code: Scalars['String']['input'];
};


export type MutationLockBuzzerArgs = {
  code: Scalars['String']['input'];
};


export type MutationPressBuzzerArgs = {
  code: Scalars['String']['input'];
};


export type MutationSignInAsUnauthenticatedUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationUnlockBuzzerArgs = {
  code: Scalars['String']['input'];
};


export type MutationUpdateBuzzerCodeArgs = {
  code: Scalars['String']['input'];
};


export type MutationUpdateUnauthenticatedUserArgs = {
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  buzzer?: Maybe<Buzzer>;
  myBuzzer?: Maybe<Buzzer>;
  unauthenticatedSelf?: Maybe<UnauthenticatedUser>;
  user?: Maybe<UnauthenticatedUser>;
};


export type QueryBuzzerArgs = {
  code: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  buzzerAvailability: BuzzerAvailability;
  buzzerPresses: BuzzerPressSubscription;
};


export type SubscriptionBuzzerAvailabilityArgs = {
  code: Scalars['String']['input'];
};


export type SubscriptionBuzzerPressesArgs = {
  code: Scalars['String']['input'];
};

export type UnauthenticatedUser = {
  __typename?: 'UnauthenticatedUser';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type MyBuzzerQueryVariables = Exact<{ [key: string]: never; }>;


export type MyBuzzerQuery = { __typename?: 'Query', myBuzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type CreateBuzzerMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type CreateBuzzerMutation = { __typename?: 'Mutation', createBuzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type UpdateBuzzerCodeMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type UpdateBuzzerCodeMutation = { __typename?: 'Mutation', updateBuzzerCode?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type LockBuzzerMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type LockBuzzerMutation = { __typename?: 'Mutation', lockBuzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type UnlockBuzzerMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type UnlockBuzzerMutation = { __typename?: 'Mutation', unlockBuzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

export type ClearAllBuzzerPressesMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type ClearAllBuzzerPressesMutation = { __typename?: 'Mutation', clearAllBuzzerPresses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> };

export type ClearSelectedBuzzerPressesMutationVariables = Exact<{
  input: ClearBuzzerPressesInput;
}>;


export type ClearSelectedBuzzerPressesMutation = { __typename?: 'Mutation', clearBuzzerPresses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> };

export type GetBuzzerByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetBuzzerByCodeQuery = { __typename?: 'Query', buzzer?: { __typename?: 'Buzzer', id: string, name: string, state: BuzzerState, allowUserToClearResponse: boolean, creator: { __typename?: 'UnauthenticatedUser', id: string, name: string }, presses: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> } | null };

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

export type BuzzerAvailabilitySubscriptionVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type BuzzerAvailabilitySubscription = { __typename?: 'Subscription', buzzerAvailability: { __typename?: 'BuzzerAvailability', isAvailable: boolean, isPressed: boolean } };

export type PressBuzzerMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type PressBuzzerMutation = { __typename?: 'Mutation', pressBuzzer: boolean };

export type BuzzerPressesSubscriptionVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type BuzzerPressesSubscription = { __typename?: 'Subscription', buzzerPresses: { __typename?: 'BuzzerPressSubscription', action: string, presses?: Array<{ __typename?: 'BuzzerPress', pressedAt: any, user: { __typename?: 'UnauthenticatedUser', id: string, name: string } }> | null } };

export const MyBuzzerDocument = gql`
    query MyBuzzer {
  myBuzzer {
    id
    name
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
  export class MyBuzzerGQL extends Apollo.Query<MyBuzzerQuery, MyBuzzerQueryVariables> {
    document = MyBuzzerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateBuzzerDocument = gql`
    mutation CreateBuzzer($code: String!) {
  createBuzzer(code: $code) {
    id
    name
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
  export class CreateBuzzerGQL extends Apollo.Mutation<CreateBuzzerMutation, CreateBuzzerMutationVariables> {
    document = CreateBuzzerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateBuzzerCodeDocument = gql`
    mutation UpdateBuzzerCode($code: String!) {
  updateBuzzerCode(code: $code) {
    id
    name
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
  export class UpdateBuzzerCodeGQL extends Apollo.Mutation<UpdateBuzzerCodeMutation, UpdateBuzzerCodeMutationVariables> {
    document = UpdateBuzzerCodeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LockBuzzerDocument = gql`
    mutation LockBuzzer($code: String!) {
  lockBuzzer(code: $code) {
    id
    name
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
  export class LockBuzzerGQL extends Apollo.Mutation<LockBuzzerMutation, LockBuzzerMutationVariables> {
    document = LockBuzzerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnlockBuzzerDocument = gql`
    mutation UnlockBuzzer($code: String!) {
  unlockBuzzer(code: $code) {
    id
    name
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
  export class UnlockBuzzerGQL extends Apollo.Mutation<UnlockBuzzerMutation, UnlockBuzzerMutationVariables> {
    document = UnlockBuzzerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClearAllBuzzerPressesDocument = gql`
    mutation ClearAllBuzzerPresses($code: String!) {
  clearAllBuzzerPresses(code: $code) {
    user {
      id
      name
    }
    pressedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClearAllBuzzerPressesGQL extends Apollo.Mutation<ClearAllBuzzerPressesMutation, ClearAllBuzzerPressesMutationVariables> {
    document = ClearAllBuzzerPressesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClearSelectedBuzzerPressesDocument = gql`
    mutation ClearSelectedBuzzerPresses($input: ClearBuzzerPressesInput!) {
  clearBuzzerPresses(input: $input) {
    user {
      id
      name
    }
    pressedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClearSelectedBuzzerPressesGQL extends Apollo.Mutation<ClearSelectedBuzzerPressesMutation, ClearSelectedBuzzerPressesMutationVariables> {
    document = ClearSelectedBuzzerPressesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuzzerByCodeDocument = gql`
    query GetBuzzerByCode($code: String!) {
  buzzer(code: $code) {
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
  export class GetBuzzerByCodeGQL extends Apollo.Query<GetBuzzerByCodeQuery, GetBuzzerByCodeQueryVariables> {
    document = GetBuzzerByCodeDocument;
    
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
export const BuzzerAvailabilityDocument = gql`
    subscription BuzzerAvailability($code: String!) {
  buzzerAvailability(code: $code) {
    isAvailable
    isPressed
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
export const PressBuzzerDocument = gql`
    mutation PressBuzzer($code: String!) {
  pressBuzzer(code: $code)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PressBuzzerGQL extends Apollo.Mutation<PressBuzzerMutation, PressBuzzerMutationVariables> {
    document = PressBuzzerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BuzzerPressesDocument = gql`
    subscription BuzzerPresses($code: String!) {
  buzzerPresses(code: $code) {
    action
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
  export class BuzzerPressesGQL extends Apollo.Subscription<BuzzerPressesSubscription, BuzzerPressesSubscriptionVariables> {
    document = BuzzerPressesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }