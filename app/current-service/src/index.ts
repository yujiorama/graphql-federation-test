import '@dotenvx/dotenvx/config';
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {ApolloServerPluginInlineTraceDisabled} from '@apollo/server/plugin/disabled';
import gql from "graphql-tag";
import {newMyResolvers} from "./resolver/index.js";
import {MyDataSource, newMyDataSource} from "./datasource/index.js";
import { initDb } from "./datasource/db.js";
import {fileURLToPath} from "node:url";
import * as path from "path";
import * as fs from "fs";
import {ApolloLoggerPlugin} from "apollo-server-logging";

// スキーマをファイルから読み込む
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = process.env.SCHEMA_PATH ?? path.resolve(__dirname, "../graph/schema.graphqls");
const typeDefs = fs.readFileSync(schemaPath, "utf-8");

// DB 初期化（マイグレーション & シード適用）
const database = await initDb();

export interface MyContext {
    dataSource: MyDataSource;
}

const server = new ApolloServer<MyContext>({
    typeDefs: gql(typeDefs),
    resolvers: newMyResolvers(),
    plugins: [ApolloServerPluginInlineTraceDisabled(), ApolloLoggerPlugin({})],
});

const endpointPath = process.env.ENDPOINT_PATH || "/graphql";
const endpointPort = process.env.PORT || "4001";

const serverOptions = {
    context: async () => {
        return {
            dataSource: newMyDataSource(database),
        };
    },
    listen: {
        path: endpointPath,
        port: parseInt(endpointPort),
    }
}

const {url} = await startStandaloneServer(server, serverOptions);

console.log(`🚀  Server ready at ${url}`);
