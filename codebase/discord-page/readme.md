# discord-page.js

discord-page.js est une librairie permettant de créér un système de page sur des messages.

Procédure d'installation `npm i discord-page.js`

```js
const {ButtonPaginator, SelectMenuPaginator, ReactionPaginator} = require('discord-page.js');

(new ButtonPaginator({
    pages: [], // string ou MessageEmbed
    userIds: [], // Snowflake
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
})).spawn(channel);

(new SelectMenuPaginator({
    pages: [], // string ou MessageEmbed
    userIds: [], // Snowflake
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
})).spawn(channel);

(new ReactionPaginator({
    pages: [], // string ou MessageEmbed
    userIds: [], // Snowflake
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
})).spawn(channel);
```