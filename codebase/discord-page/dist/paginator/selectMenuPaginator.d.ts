import { SelectMenuPaginatorOptions } from "../types";
import Paginator from "./base/paginator";
import { Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
export default class SelectMenuPaginator extends Paginator {
    protected readonly options: SelectMenuPaginatorOptions;
    private readonly customId;
    constructor(options: SelectMenuPaginatorOptions);
    private buildComponents;
    private awaitInteraction;
    spawn(channel: TextChannel | NewsChannel | ThreadChannel): Promise<Message>;
}
