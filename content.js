/*: ==========================================================================
* ############################################################################
* 
* YT Monetization Tracker: Written by DekitaRPG @ gmail.com
* 
* ############################################################################
* 
* This simple extension watches for youtube studio pages and then modifys
* the monetisation page to show a percentage value for towards monetization. 
* 
* ============================================================================
* Visit www.dekitarpg.com for more!
* ============================================================================
*/

// 
// CONFIGURABLES::
// 
const UPDATE_FREQUENCY = 2500; // ms
const BASIC_STRING = "Progress: {perc}%";
const TOTAL_STRING = "{perc}% Towards Monetisation!!";

// 
// DO NOT EDIT BELOW THIS POINT UNLESS YOU KNOW WHAT YOUR DOING::
// 
const numreg = /\d+/;
const TPID = 'total-perc-moneytized';
const tabl_classes = "table-container style-scope ytpp-signup-eligibility";
const curr_classes = "count style-scope ytpp-signup-eligibility";
const reqr_classes = "threshold style-scope ytpp-signup-eligibility";
const cont_classes = "text style-scope ytpp-signup-eligibility";

// 
// YTMoneytized
// main class to handle page element
// 
class YTMoneytized {
    // 
    // setup elements:
    // 
    static async setup() {
        await this.createSubPerc();
        await this.createWatPerc();
        await this.createTotPerc();
    }
    // 
    // update elements:
    // 
    static async update() {
        if (this.needRefresh()) {
            await this.setup();
        }
        await this.updateSubPerc();
        await this.updateWatPerc();
        await this.updateTotPerc();
    }
    // 
    // check need are-add elements
    // youtube removes them at various points, its annoying af!
    // 
    static needRefresh() {
        return document.getElementById(TPID) === null;
    }
    // 
    // subscriber percentages:
    // 
    static async createSubPerc() {
        this._subarea = this.scanArea("subscriber");
        if (!this._subarea) return;
        this._subperc = document.createElement('small');
        this._subarea.cont.append(this._subperc);
    }
    static async updateSubPerc() {
        if (!this._subarea) return;
        this._subperc.innerText = BASIC_STRING.replace('{perc}', this.sub_perc.toFixed(2));
    }
    static get sub_perc() {
        const {curr, reqr} = this._subarea;
        return Math.min(curr / reqr, 1.0) * 100;
    }
    // 
    // watch percentages:
    // 
    static async createWatPerc() {
        this._watarea = this.scanArea("watch-hour");
        if (!this._watarea) return;
        this._watperc = document.createElement('small');
        this._watarea.cont.append(this._watperc);
    }
    static async updateWatPerc() {
        if (!this._watarea) return;
        this._watperc.innerText = BASIC_STRING.replace('{perc}', this.wat_perc.toFixed(2));
    }
    static get wat_perc() {
        const {curr, reqr} = this._watarea;
        return Math.min(curr / reqr, 1.0) * 100;
    }
    // 
    // total percentages:
    // 
    static async createTotPerc() {
        const container = document.getElementsByClassName(tabl_classes)[0];
        if (!container) return;
        this._totarea = document.createElement('div');
        container.parentElement.parentElement.append(this._totarea);
        this._totperc = document.createElement('h1');
        this._totarea.style.color = 'rgba(255, 255, 255, 0.8)';
        this._totarea.style.paddingTop = '2rem';
        this._totarea.id = TPID;
        this._totarea.append(this._totperc);
    }
    static async updateTotPerc() {
        if (this.needRefresh()) return;
        this._totperc.innerText = TOTAL_STRING.replace('{perc}', this.tot_perc.toFixed(3));
    }
    static get tot_perc() {
        return (this.sub_perc + this.wat_perc) / 2;
    }
    // 
    // scan yt page areas for data:
    // 
    static scanArea(area_id) {
        const area = document.getElementById(area_id);
        if (!area) return null;
        const curr = area.getElementsByClassName(curr_classes)[0];
        const reqr = area.getElementsByClassName(reqr_classes)[0];
        return {
            curr: Number(curr.innerText.replace(',','').match(numreg)),
            reqr: Number(reqr.innerText.replace(',','').match(numreg)),
            cont: area.getElementsByClassName(cont_classes)[0], 
        }
    }
}

setInterval(function loop(){
    YTMoneytized.update();
}, UPDATE_FREQUENCY);

// 
// END OF CODE -- dekitarpg.com
// 