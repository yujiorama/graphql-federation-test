import {readFileSync} from "fs";
import {resolve} from "path";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {ApolloServerPluginInlineTraceDisabled} from '@apollo/server/plugin/disabled';
import gql from "graphql-tag";
import resolvers from "./resolvers/index.js";
import {ItemDatasource, TagDatasource} from "./datasource.js";

// スキーマをファイルから読み込む
const schemaPath = resolve(process.env.SCHEMA_PATH || "../graph/schema.graphqls");
const typeDefs = readFileSync(schemaPath, "utf-8");

export interface MyContext {
    dataSources: {
        itemDataSource: ItemDatasource;
        tagDataSource: TagDatasource;
    }
}

// アクセスログを出力するためのプラグイン
const logAccessPlugin = {
    async requestDidStart(requestContext: any) {
        const {request} = requestContext;
        const startTime = new Date();
        console.log(`[${startTime.toISOString()}] Incoming request:`);
        console.log(`  Query: ${request.query}`);
        console.log(`  Variables: ${JSON.stringify(request.variables)}`);
        console.log(`  Headers: ${JSON.stringify(request.http?.headers)}`);

        return {
            async willSendResponse(responseContext: any) {
                const endTime = new Date();
                const duration = endTime.getTime() - startTime.getTime();
                console.log(`[${endTime.toISOString()}] Request processed in ${duration}ms`);
                console.log(`  Response: ${JSON.stringify(responseContext.response)}`);
            },
        };
    },
};

const server = new ApolloServer<MyContext>({
    typeDefs: gql(typeDefs),
    resolvers: resolvers,
    plugins: [ApolloServerPluginInlineTraceDisabled(), logAccessPlugin],
});

const endpointPath = process.env.ENDPOINT_PATH || "/graphql";
const endpointPort = process.env.PORT || "4001";

const serverOptions = {
    context: async ({req}) => {
        return {
            dataSources: {
                itemDataSource: new ItemDatasource(),
                tagDataSource: new TagDatasource(),
            }
        };
    },
    listen: {
        path: endpointPath,
        port: parseInt(endpointPort),
    }
}

const {url} = await startStandaloneServer(server, serverOptions);

console.log(`🚀  Server ready at ${url}`);
