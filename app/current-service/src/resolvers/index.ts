import { Resolvers } from "../generated/resolvers-types";
import {tagResolvers, itemResolvers, queryResolvers} from "./queries.js";
import {mutationResolvers} from "./mutations.js";

const resolvers: Resolvers = {
    Query: {
        ...queryResolvers,
    },
    Mutation: {
        ...mutationResolvers,
    },
    Tag: {
        ...tagResolvers,
    },
    Item: {
        ...itemResolvers,
    },
    AddItemPayload: {
        item: (payload) => payload.item,
        ok: (payload) => payload.ok,
    },
    AddTagToItemPayload: {
        item: (payload) => payload.item,
        ok: (payload) => payload.ok,
    },
    CreateTagPayload: {
        tag: (payload) => payload.tag,
        ok: (payload) => payload.ok,
    },
};

export default resolvers;
