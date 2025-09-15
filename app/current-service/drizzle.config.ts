import '@dotenvx/dotenvx/config';
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/datasource/schema.ts",
    dialect: "sqlite",
    dbCredentials: {url: process.env.DATABASE_URL},
});
