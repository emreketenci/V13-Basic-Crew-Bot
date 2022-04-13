import { EmojiIdentifierResolvable, MessageButtonStyleResolvable, MessageEmbed } from 'discord.js';
import { Snowflake } from "discord-api-types";
export declare type PaginatorOptions = ButtonPaginatorOptions | SelectMenuPaginatorOptions | ReactionPaginatorOptions;
export declare type ButtonPaginatorOptions = {
    pages: Array<string | MessageEmbed>;
    userIds: Array<Snowflake>;
    emojis?: {
        first: EmojiIdentifierResolvable;
        previous: EmojiIdentifierResolvable;
        remove: EmojiIdentifierResolvable;
        next: EmojiIdentifierResolvable;
        last: EmojiIdentifierResolvable;
    };
    styles?: {
        first: MessageButtonStyleResolvable;
        previous: MessageButtonStyleResolvable;
        remove: MessageButtonStyleResolvable;
        next: MessageButtonStyleResolvable;
        last: MessageButtonStyleResolvable;
    };
    pageCount?: string | null;
    filter?: (userId: Snowflake, userIds: Array<Snowflake>) => boolean;
    time?: number;
};
export declare type SelectMenuPaginatorOptions = {
    pages: Array<string | MessageEmbed>;
    userIds: Array<Snowflake>;
    emojis?: {
        current: EmojiIdentifierResolvable;
        other: EmojiIdentifierResolvable;
        remove: EmojiIdentifierResolvable;
    };
    placeholder?: string;
    pageLabel?: string;
    removeLabel?: string;
    pageCount?: string | null;
    filter?: (userId: Snowflake, userIds: Array<Snowflake>) => boolean;
    time?: number;
};
export declare type ReactionPaginatorOptions = {
    pages: Array<string | MessageEmbed>;
    userIds: Array<Snowflake>;
    emojis?: {
        first: EmojiIdentifierResolvable;
        previous: EmojiIdentifierResolvable;
        remove: EmojiIdentifierResolvable;
        next: EmojiIdentifierResolvable;
        last: EmojiIdentifierResolvable;
    };
    pageCount?: string | null;
    filter?: (userId: Snowflake, userIds: Array<Snowflake>) => boolean;
    time?: number;
};
