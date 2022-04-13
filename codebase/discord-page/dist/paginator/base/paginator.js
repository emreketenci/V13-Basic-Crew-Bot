"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Paginator {
    constructor(options, baseOptions) {
        const resolvedOptions = Object.assign(Object.assign({}, baseOptions), options);
        if (resolvedOptions.pages.length === 0 || resolvedOptions.userIds.length === 0)
            throw new Error('The page and userIds options are mandatory');
        this.options = resolvedOptions;
        this.actualPage = 1;
    }
    static buildMessageOptions(data) {
        if (typeof data === 'string')
            return { content: data };
        return { embeds: [new discord_js_1.MessageEmbed(data)] };
    }
    getPageCount() {
        var _a;
        const { pages, pageCount } = this.options;
        return (_a = pageCount === null || pageCount === void 0 ? void 0 : pageCount.replace('{current}', `${this.actualPage}`).replace('{total}', `${pages.length}`)) !== null && _a !== void 0 ? _a : ' ';
    }
    addPageCountInMessageOptions(page) {
        const opt = Paginator.buildMessageOptions(page);
        if (!this.options.pageCount)
            return opt;
        if (opt.content)
            opt.content = `${opt.content}\n\n${this.getPageCount()}`;
        if (opt.embeds && opt.embeds[0]) {
            if (!opt.embeds[0].footer)
                opt.embeds[0].footer = {};
            opt.embeds[0].footer.text =
                `${opt.embeds[0].footer.text ? opt.embeds[0].footer.text + ' • ' : ''}${this.getPageCount()}`;
        }
        return opt;
    }
    static responseOnInteraction(i) {
        i.client.api.interactions(i.id, i.token).callback.post({
            data: {
                type: 6,
                data: {
                    flags: null,
                },
            },
        });
    }
}
exports.default = Paginator;
