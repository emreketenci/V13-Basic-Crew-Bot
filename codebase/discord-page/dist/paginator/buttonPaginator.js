"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const paginator_1 = __importDefault(require("./base/paginator"));
class ButtonPaginator extends paginator_1.default {
    constructor(options) {
        const baseOptions = {
            pages: [],
            userIds: [],
            emojis: {
                first: '⬅️',
                previous: '◀️',
                remove: '🇽',
                next: '▶️',
                last: '➡️'
            },
            styles: {
                first: 'SUCCESS',
                previous: 'SECONDARY',
                remove: 'DANGER',
                next: 'SECONDARY',
                last: 'SUCCESS',
            },
            pageCount: `Page {current}/{total}`,
            filter: (userId, userIds) => userIds.includes(userId),
            time: 60000
        };
        super(options, baseOptions);
    }
    static buildCustomId(number = null) {
        if (number === null)
            return `DISCORD_PAGINATOR_ID.DELETE`;
        return `${Date.now()}${Math.floor(Math.random() * 0xffffff) + 1}_DISCORD_PAGINATOR_ID.PAGE=${number}`;
    }
    static parseCustomId(customId) {
        const matches = [...customId.matchAll(/([0-9]+_)?DISCORD_PAGINATOR_ID.(DELETE|PAGE=([0-9]+))/g)];
        if (matches.length === 0)
            return false;
        if (matches[0][2] === 'DELETE')
            return 'DELETE';
        return parseInt(matches[0][3]);
    }
    buildComponents() {
        const { pages, emojis, styles } = this.options;
        if (!emojis || !styles)
            return {};
        const first = new discord_js_1.MessageButton()
            .setDisabled([1, 2].includes(this.actualPage))
            .setEmoji(emojis.first)
            .setStyle(styles.first)
            .setCustomId(ButtonPaginator.buildCustomId(1));
        const previous = new discord_js_1.MessageButton()
            .setDisabled(this.actualPage === 1)
            .setEmoji(emojis.previous)
            .setStyle(styles.previous)
            .setCustomId(ButtonPaginator.buildCustomId(this.actualPage - 1));
        const remove = new discord_js_1.MessageButton()
            .setEmoji(emojis.remove)
            .setStyle(styles.remove)
            .setCustomId(ButtonPaginator.buildCustomId());
        const next = new discord_js_1.MessageButton()
            .setDisabled(this.actualPage === pages.length)
            .setEmoji(emojis.next)
            .setStyle(styles.next)
            .setCustomId(ButtonPaginator.buildCustomId(this.actualPage + 1));
        const last = new discord_js_1.MessageButton()
            .setDisabled([pages.length - 1, pages.length].includes(this.actualPage))
            .setEmoji(emojis.last)
            .setStyle(styles.last)
            .setCustomId(ButtonPaginator.buildCustomId(pages.length));
        return { components: [(new discord_js_1.MessageActionRow()).addComponents(first, previous, remove, next, last)] };
    }
    awaitInteraction(message) {
        const { pages, userIds, filter, time } = this.options;
        if (!filter || !time)
            return message;
        message.awaitMessageComponent({ filter: button => filter(button.user.id, userIds), componentType: 'BUTTON', time })
            .then((button) => __awaiter(this, void 0, void 0, function* () {
            const parsedId = ButtonPaginator.parseCustomId(button.customId);
            if (parsedId === false)
                return;
            if (parsedId === 'DELETE')
                return message.delete();
            if (typeof parsedId !== 'number')
                return;
            this.actualPage = parsedId;
            paginator_1.default.responseOnInteraction(button);
            return message.edit(Object.assign(Object.assign({}, this.addPageCountInMessageOptions(pages[this.actualPage - 1])), this.buildComponents()))
                .then(this.awaitInteraction.bind(this));
        }))
            .catch(error => error.message === 'Collector received no interactions before ending with reason: time' ? null : console.error(error));
        return message;
    }
    spawn(channel) {
        const { pages } = this.options;
        return channel.send(Object.assign(Object.assign({}, this.addPageCountInMessageOptions(pages[this.actualPage - 1])), this.buildComponents()))
            .then(this.awaitInteraction.bind(this));
    }

    getMessageArgs() {
        const { pages } = this.options;
        return Object.assign(Object.assign({}, this.addPageCountInMessageOptions(pages[this.actualPage - 1])), this.buildComponents())
    }
}
exports.default = ButtonPaginator;
