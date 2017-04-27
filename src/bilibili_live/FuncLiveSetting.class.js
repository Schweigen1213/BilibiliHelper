/* globals ModuleConsole,ModuleDom,ModuleNotify,ModuleStore */
class FuncLiveSetting {
    static init() {
        if(!Live.option.live || !Live.option.live) {
            return;
        }
        this.funcList = {
            gift: {name: '礼物信息', click: this.gift_click, state: true},
            vip: {name: '老爷进场', click: this.vip_click, state: true},
            super_gift: {name: '礼物连击', click: this.super_gift_click, state: true}
        };
        this.initDOM();
    }

    static initDOM() {
        this.liveSettingButton = $('<a>').addClass('f-right live-btn ghost').attr('id', 'bh-live-setting-btn').text('直播设置');
        this.liveSettingPanel = $('<div>').addClass('live-hover-panel arrow-bottom show').attr('id', 'bh-live-setting-panel').hide();
        this.liveSettingPanel.append($('<h4>').addClass('bh-title').text('直播设置')).append($('<hr>'));
        let ul = $('<ul>');
        for(let key in this.funcList) {
            let li = $('<li>').addClass('clear-float');
            li.append($('<span>').text(this.funcList[key].name));
            li.append($('<a>').addClass('link bili-link f-right bh-live-setting-btn').attr('key', key).text('隐藏'));
            ul.append(li);
        }
        this.liveSettingPanel.append(ul);
        $('.profile-ctrl').append(this.liveSettingPanel).append(this.liveSettingButton);

        this.liveSettingPanel.on('click', (event) => event.stopPropagation());
        $(document).on('click', () => this.liveSettingPanel.fadeOut(300));
        this.liveSettingButton.on('click', (event) => {
            this.liveSettingPanel.fadeToggle(300);
            event.stopPropagation();
        });
        $('.bh-live-setting-btn').on('click', (event) => {
            let button = $(event.currentTarget);
            this.funcList[button.attr('key')].click.call(this);
            button.text(this.funcList[button.attr('key')].state ? '显示' : '隐藏');
            this.funcList[button.attr('key')].state = !this.funcList[button.attr('key')].state;
        });
    }

    static gift_click() {
        if(this.funcList['gift'].state) {
            this.gift_css = Live.addStylesheetByText('.gift-msg{display:none !important;}');
        } else {
            this.gift_css.remove();
            this.chatListScrollToBottom();
        }
    }
    static vip_click() {
        if(this.funcList['vip'].state) {
            this.vip_css = Live.addStylesheetByText('.system-msg{display:none !important;}');
        } else {
            this.vip_css.remove();
            this.chatListScrollToBottom();
        }
    }
    static super_gift_click() {
        $('#super-gift-ctnr-haruna').toggleClass('hide');
    }

    static chatListScrollToBottom() {
        $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight);
    }
}