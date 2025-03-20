import { commonEventManager } from "./eventManager";
import events from "./events";
import localStorageItems from "./localStorageItems";

export default class {
    constructor(eventManager = commonEventManager) {
        eventManager.subscribe(events.changeLang, lang => {
            this.update({ lang });
            localStorage.setItem(localStorageItems.langId, lang);
        });
    }
}
