import { PaginatorOptions } from "../../types";
import { Interaction, MessageEmbed, MessageOptions } from "discord.js";
export default class Paginator {
    protected readonly options: PaginatorOptions;
    protected actualPage: number;
    constructor(options: PaginatorOptions, baseOptions: PaginatorOptions);
    protected static buildMessageOptions(data: string | MessageEmbed): MessageOptions;
    protected getPageCount(): string;
    protected addPageCountInMessageOptions(page: string | MessageEmbed): MessageOptions;
    protected static responseOnInteraction(i: Interaction): void;
}
