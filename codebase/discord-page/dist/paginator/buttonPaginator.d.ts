import { ButtonPaginatorOptions } from "../types";
import { Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
import Paginator from "./base/paginator";
export default class ButtonPaginator extends Paginator {
    protected readonly options: ButtonPaginatorOptions;
    constructor(options: ButtonPaginatorOptions);
    private static buildCustomId;
    private static parseCustomId;
    private buildComponents;
    private awaitInteraction;
    spawn(channel: TextChannel | NewsChannel | ThreadChannel): Promise<Message>;
}
