const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.MainButton.show();
tg.MainButton.text = 'Корзина';

let chatId;
if (typeof tg.initDataUnsafe.id != "undefined") {
    chatId = tg.initDataUnsafe.id;
} else {
    chatId = 111111111;
}

export function HookTelegram () {
    return {
        tg,
        chatId
    }
}