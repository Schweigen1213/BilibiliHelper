/* globals ModuleStore,ModuleNotify,ModuleConsole */
class ALPlugin_Lighten {
    static init() {
        if(!Live.option.live || !Live.option.live_lighten) {
            return;
        }

        this.addEvent();
    }
    static getInfo() {
        let info = {};
        info.name = '应援棒';
        info.times = ModuleStore.getTimes('lighten');
        info.statinfo = {'应援棒': info.times};
        return info;
    }

    static addEvent() {
        Live.sendMessage({command: 'getLighten'}, (result) => {
            if(!result.showID) {
                Live.sendMessage({command: 'setLighten', showID: Live.showID});
                $(window).on('beforeunload', () => Live.sendMessage({command: 'getLighten'}, (result) => result.showID == Live.showID && Live.sendMessage({command: 'delLighten'})));
                Live.getMessage((request) => {
                    if(request.cmd && request.cmd == 'SYS_MSG' && request.msg && request.msg.includes('领取应援棒') && request.url) {
                        this.getLightenID(request.url.match(/com\/(.+)/)[1]);
                    }
                });
                this.event('enabled');
            } else {
                this.event('exist', result);
            }
        });
    }

    static event(key, param) {
        switch(key) {
            case 'enabled':
                ModuleNotify.lighten('enabled');
                ModuleConsole.lighten('enabled');
                break;
            case 'exist':
                ModuleConsole.lighten('exist', param);
                break;
            case 'award':
                ModuleStore.addTimes('lighten', 1);
                ModuleNotify.lighten('award');
                ModuleConsole.lighten('award');
                break;
        }
    }

    static getLightenID(showID) {
        Live.getRoomID(showID, (roomID) => {
            $.getJSON('//api.live.bilibili.com/activity/v1/NeedYou/getLiveInfo', {roomid: roomID}).done((result) => {
                if(result.data.length > 0) {
                    result = result.data[0];
                    if(result.type == 'need_you') {
                        this.getAward(roomID, result.lightenId);
                    } else {
                        console.log(result);
                    }
                }
            }).fail(() => Live.countdown(2, () => this.join(showID)));
        });
    }
    static getAward(roomID, lightenID) {
        $.post('//api.live.bilibili.com/activity/v1/NeedYou/getLiveAward', {roomid: roomID, lightenId: lightenID}).done((result) => {
            if(result.code === 0) {
                this.event('award');
            } else if(result.code == -400) {
            } else {
                console.log(result);
            }
        }).fail(() => Live.countdown(2, () => this.getAward(roomID, lightenID)));
    }
}
