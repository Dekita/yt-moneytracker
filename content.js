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

const numreg = /\d+/;
const tabl_classes = "table-container style-scope ytpp-signup-eligibility";
const curr_classes = "count style-scope ytpp-signup-eligibility";
const reqr_classes = "threshold style-scope ytpp-signup-eligibility";
const cont_classes = "text style-scope ytpp-signup-eligibility";

let sub_data = null;
let wat_data = null;
let loaded = false;


// main script below:
document.addEventListener("DOMSubtreeModified", runPopulate);

const elements = document.getElementsByClassName('style-scope ytcp-navigation-drawer');
for (const element of elements) {
    element.addEventListener('click', function(){
        loaded = document.getElementById('total-perc-moneytized') !== null;
        runPopulate();
    });
}

function runPopulate() {
    if (loaded) return;
    if (document.getElementById('total-perc-moneytized') !== null) return;
    sub_data = scanArea("subscriber");
    wat_data = scanArea("watch-hour");
    loaded = sub_data && wat_data;
    if (loaded) {
        populatePerc(sub_data, subPerc());
        populatePerc(wat_data, watPerc());
        populateTotalPerc();
    }
}

// scans a given area for values
function scanArea(area_id) {
    const area = document.getElementById(area_id);
    if (!area) return null;
    const curr = area.getElementsByClassName(curr_classes)[0];
    const reqr = area.getElementsByClassName(reqr_classes)[0];
    return {
        curr: Number(curr.innerText.match(numreg)),
        reqr: Number(reqr.innerText.replace(',','').match(numreg)),
        cont: area.getElementsByClassName(cont_classes)[0], 
    }
}
// get percentage for sub count
function subPerc() {
    return sub_data.curr / sub_data.reqr * 100;
}
// get percetnage for watch hours
function watPerc() {
    return wat_data.curr / wat_data.reqr * 100;
}
// populate percentage for type (sub/wat)
function populatePerc(type, perc) {
    const text = document.createElement('small');
    text.innerText = `Progress: ${perc.toFixed(2)}%`;
    type.cont.append(text);
}
// populate total percentage
function populateTotalPerc() {
    const container = document.getElementsByClassName(tabl_classes)[0];
    const div = document.createElement('div');
    div.style.color = 'rgba(255, 255, 255, 0.8)';
    div.style.paddingTop = '2rem';
    div.id = 'total-perc-moneytized';
    const perc = (subPerc() + watPerc()) / 2;
    const text = document.createElement('h1');
    text.innerText = `${perc.toFixed(3)}% Towards Monetisation!!`;
    container.parentElement.parentElement.append(div);
    div.append(text);
}
