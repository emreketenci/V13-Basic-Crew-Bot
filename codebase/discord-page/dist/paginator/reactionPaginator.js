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
class ReactionPaginator extends paginator_1.default {
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
            pageCount: `Page {current}/{total}`,
            filter: (userId, userIds) => userIds.includes(userId),
            time: 60000
        };
        super(options, baseOptions);
    }
    getReversedEmojis() {
        const { emojis } = this.options;
        if (!emojis)
            return {};
        const reversedEmojis = {};
        for (const key in emojis) {
            reversedEmojis[emojis[key]] = key;
        }
        return reversedEmojis;
    }
    awaitReaction(message) {
        const { pages, userIds, emojis, filter, time } = this.options;
        if (!emojis || !filter || !time)
            return message;
        message.awaitReactions({
            filter: reaction => {
                var _a;
                const emojisValue = Object.values(emojis);
                if (!emojisValue.includes(reaction.emoji.name) &&
                    !emojisValue.includes(reaction.emoji.id) &&
                    !emojisValue.map(e => e.id).includes(reaction.emoji.id))
                    return false;
                return filter(((_a = reaction.users.cache.toJSON()[1]) !== null && _a !== void 0 ? _a : {}).id, userIds);
            },
            time,
            maxUsers: 1,
            maxEmojis: 1
        })
            .then(collection => {
            var _a, _b;
            const mr = collection.first();
            if (!mr)
                return;
            mr.users.remove(mr.users.cache.find(u => !u.bot && userIds.includes(u.id))).catch(console.error);
            const reversedEmojis = this.getReversedEmojis();
            if (reversedEmojis[(_a = mr.emoji.id) !== null && _a !== void 0 ? _a : mr.emoji.name] === 'remove')
                return message.delete();
            switch (reversedEmojis[(_b = mr.emoji.id) !== null && _b !== void 0 ? _b : mr.emoji.name]) {
                case 'first': {
                    this.actualPage = 1;
                    break;
                }
                case 'previous': {
                    this.actualPage = this.actualPage - 1 === 0 ? 1 : this.actualPage - 1;
                    break;
                }
                case 'next': {
                    this.actualPage = this.actualPage + 1 > pages.length ? pages.length : this.actualPage + 1;
                    break;
                }
                case 'last': {
                    this.actualPage = pages.length;
                    break;
                }
            }
            return message.edit(this.addPageCountInMessageOptions(pages[this.actualPage - 1]))
                .then(this.awaitReaction.bind(this));
        })
            .catch(console.error);
        return message;
    }
    spawn(channel) {
        const { pages } = this.options;
        return channel.send(this.addPageCountInMessageOptions(pages[this.actualPage - 1]))
            .then((message) => __awaiter(this, void 0, void 0, function* () {
            const { emojis } = this.options;
            for (const name in emojis) {
                yield message.react(emojis[name]);
            }
            return this.awaitReaction(message);
        }));
    }
}
exports.default = ReactionPaginator;
