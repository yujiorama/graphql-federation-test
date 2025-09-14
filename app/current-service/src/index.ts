import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {ApolloServerPluginInlineTraceDisabled} from '@apollo/server/plugin/disabled';
import gql from "graphql-tag";
import {newMyResolvers} from "./resolver/index.js";
import {MyDataSource, newMyDataSource} from "./datasource/index.js";
import {fileURLToPath} from "node:url";
import * as path from "path";
import * as fs from "fs";

// スキーマをファイルから読み込む
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = process.env.SCHEMA_PATH ?? path.resolve(__dirname, "../graph/schema.graphqls");
const typeDefs = fs.readFileSync(schemaPath, "utf-8");

export interface MyContext {
    dataSource: MyDataSource;
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
    resolvers: newMyResolvers(),
    plugins: [ApolloServerPluginInlineTraceDisabled(), logAccessPlugin],
});

const endpointPath = process.env.ENDPOINT_PATH || "/graphql";
const endpointPort = process.env.PORT || "4001";

const serverOptions = {
    context: async ({req}) => {
        return {
            dataSource: newMyDataSource(),
        };
    },
    listen: {
        path: endpointPath,
        port: parseInt(endpointPort),
    }
}

const {url} = await startStandaloneServer(server, serverOptions);

console.log(`🚀  Server ready at ${url}`);
