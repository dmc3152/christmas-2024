import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'https://bluesea.com:3030/graphql',
    documents: './src/**/*.graphql',
    generates: {
        './graphql/generated.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
        }
    }
}
export default config