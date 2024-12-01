import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://bluesea.com:3000/graphql',
    documents: './src/**/*.graphql',
    generates: {
        './graphql/generated.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
        }
    }
}
export default config