import {plugIn} from 'plugIn.js';
/*导航高亮*/
var highLight = function () {
    let getLeadArray = (lead) => {
        let newArray = [];
        lead
            .find('a')
            .each(function () {
                newArray.push($(this).getElementBaseText().replace(/\s+/g, "").toUpperCase());
            })
        return newArray;
    };

    var navFun = {
        top: (topNav = ".navbox", point = "a", active = "active", lead = "#lead") => {
            topNav = $(topNav);
            lead = $(lead);
            topNav
                .find(point)
                .removeCLass(active); //清除旧active
            lead.length == 0
                ? topNav
                    .find('a')
                    .eq(0)
                    .addClass(active)
                : true; //网站首页

            for (let i of topNav[0].querySelectorAll(point)) {
                getLeadArray(lead).splice(0, 1) //去除首页干扰
                    .haveElement($(i).getElementBaseText().replace(/\s+/g, "").toUpperCase())
                    ? i.className += ` ${active}`
                    : true;
            }
        },
        left: (leftNav = ".navbox", point = "a", active = "active", lead = "#lead", slide = false, slideSwitch = ".slide-toggle", slideActive = ".slide-active") => {
            leftNav = $(leftNav);
            lead = $(lead);
            leftNav
                .find(point)
                .removeCLass(active)
            if (slide) {
                leftNav
                    .find(slideSwitch)
                    .removeCLass(slideActive)
            } //清除旧active
            for (let i of leftNav[0].querySelectorAll(point)) {
                if (getLeadArray(lead).haveElement($(i).getElementBaseText().replace(/\s+/g, "").toUpperCase())) {
                    i.className += ` ${active}`
                    if (slide) {
                        i
                            .parent()
                            .children(slideSwitch)
                            .addClass(slideActive)
                    }
                }

            }
        }
    };
}
export {highLight};