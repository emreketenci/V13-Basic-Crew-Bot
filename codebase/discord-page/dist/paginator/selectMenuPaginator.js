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
const paginator_1 = __importDefault(require("./base/paginator"));
const discord_js_1 = require("discord.js");
class SelectMenuPaginator extends paginator_1.default {
    constructor(options) {
        const baseOptions = {
            pages: [],
            userIds: [],
            emojis: {
                current: '▶️',
                other: '🟦',
                remove: '🇽',
            },
            placeholder: `Select the page`,
            pageLabel: `Page {number}`,
            removeLabel: `Remove`,
            pageCount: `Page {current}/{total}`,
            filter: (userId, userIds) => userIds.includes(userId),
            time: 60000
        };
        super(options, baseOptions);
        this.customId = `${Date.now()}${Math.floor(Math.random() * 0xffffff) + 1}_DISCORD_PAGINATOR_ID.SELECT_MENU`;
    }
    buildComponents() {
        const { pages, emojis, placeholder, pageLabel, removeLabel } = this.options;
        if (!emojis || !placeholder || !pageLabel || !removeLabel)
            return {};
        const smo = [];
        for (let i = 1; i <= pages.length; i++) {
            smo.push({
                label: pageLabel.replace('{number}', `${i}`),
                value: `${i}`,
                emoji: this.actualPage === i ? emojis.current : emojis.other,
            });
        }
        smo.push({
            label: removeLabel,
            value: 'DELETE',
            emoji: emojis.remove
        });
        const selectMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId(this.customId)
            .setPlaceholder(placeholder)
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(smo);
        return { components: [(new discord_js_1.MessageActionRow()).addComponents(selectMenu)] };
    }
    awaitInteraction(message) {
        const { pages, userIds, filter, time } = this.options;
        if (!filter || !time)
            return message;
        message.awaitMessageComponent({ filter: button => filter(button.user.id, userIds), componentType: 'SELECT_MENU', time })
            .then((selectMenu) => __awaiter(this, void 0, void 0, function* () {
            const { values } = selectMenu;
            if (values[0] === 'DELETE')
                return message.delete();
            this.actualPage = parseInt(values[0]);
            paginator_1.default.responseOnInteraction(selectMenu);
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
}
exports.default = SelectMenuPaginator;
