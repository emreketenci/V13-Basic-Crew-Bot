import Paginator from "./base/paginator";
import { ReactionPaginatorOptions, SelectMenuPaginatorOptions } from "../types";
import { Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
export default class ReactionPaginator extends Paginator {
    protected readonly options: SelectMenuPaginatorOptions;
    constructor(options: ReactionPaginatorOptions);
    private getReversedEmojis;
    private awaitReaction;
    spawn(channel: TextChannel | NewsChannel | ThreadChannel): Promise<Message>;
}
