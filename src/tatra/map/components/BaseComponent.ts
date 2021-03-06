import { utils } from "../../utils";
import { tools as t } from "../tools";
import { events } from "../events";
import { controls } from "./controls";
import { draggable } from "../../aux/draggable";

export class baseComponent {
	public static initialized   : boolean = false;
    public static id            : string = "base";
    public static label         : string = "BASE";
    public static draggable     : boolean = false;
    public static clandestine   : boolean = false;
    public static className     : string = 'lmvControlsWindow';
    public static showHeader    : boolean = true;
    public static tools : Array <string> = [];
    public static currentTool   : string = '';
    public static showInfoBar   : boolean = false;
    public static isOpened      : boolean = false;
        
    public static init () {
        document.addEventListener(events.EVENT_CONTROL_BTN, (evt : Event) => this.onClick (evt as CustomEvent));
        window.addEventListener("resize", () => this.resize());
    }

    public static onClick(evt : CustomEvent) {
        if (evt.detail.id != this.id) {
            return;
        }
		if (!this.initialized) {
            this.initialized = true;
            this.createWindow();
		} 
		if (evt.detail.visible) {
			this.open();
		} else {
			this.close();		
        }
    }
	
	public static createWindow () {
		let el = document.createElement("div");
        el.setAttribute("id", "lmvControls_"+ this.id);
        if (! this.clandestine) {
            el.setAttribute("class", this.className);
        }
        let menus = document.getElementById('lmvMenus');
	    if (menus){ 
            menus.appendChild(el); 
        }
    
        if (this.clandestine) { return; }
        let str = '';
        if (this.showHeader) {
            str += `<div id="lmvCtrlHeaderLbl_${this.id}" class="lmvControlsWindowLabel">${this.label}</div>`;
        }
        str += `            
            <div id="lmv_${this.id}_CloseBtn" class="lmvControlsWindowCloseBtn">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
            <div id="lmvControls_${this.id}_Content" class="lmvControlsWindowContent">
            </div>
        `;
        el.innerHTML = str;

        if (this.showHeader) {
            this.setDraggable(`lmvCtrlHeaderLbl_${this.id}`);
        }
        
        utils.setClick(`lmv_${this.id}_CloseBtn`, () => this.onClose());
        utils.setUIAction("mousedown", "lmvControls_"+ this.id, () => controls.openWindow(this.id));
    }

    public static setDraggable (id : string) {
        if (this.draggable) {
            draggable.create("lmvControls_"+ this.id, id, 'map');
        }
    }

    public static onClose() {
        controls.setItem(this.id, false);
    }
    public static onOpen() {
        controls.setItem(this.id, true);
    }

	public static close () {
        utils.hide("lmvControls_" + this.id);
        controls.closeWindow(this.id);
        this.isOpened = false;
	}
    
    public static open () {
        utils.show("lmvControls_" + this.id);
        controls.openWindow(this.id);
        this.isOpened = true;
        //controls.setItem(this.id, true);
//        utils.analyticsTrack(this.id);
    }

    public static position (x: number, y: number) {
        let el = document.getElementById(`lmvControls_${this.id}`);
		if (el) {
			el.style.left = (x/10) + 'rem';
			el.style.top = (y/10) + 'rem';
		}
    }
    public static resize() {
        this.onClose();
    }

    public static setWindowToolLabel (id : string) {        
        let label = `${this.label} - ${t.definitions[id].label}`;
        (document.getElementById(`lmvCtrlHeaderLbl_${this.id}`) as HTMLDivElement).innerHTML = label;
        if (this.showInfoBar) {
            (document.getElementById(`${this.id}_infoBar`) as HTMLDivElement).innerHTML = `
                <span>${t.definitions[id].text}</span>: ${t.definitions[id].info}
            `;
        }
    }

    public static optionItem (id : string, parentDiv : HTMLUListElement, label : string, icon: string, handler : Function) {
        let el = document.createElement("li");
        el.setAttribute("id", `bb_${this.id}_${id}_btn`);
        el.setAttribute("class", "mapToolBtn");
        
        let iconStyle = 'bottomBarIcon';
        el.innerHTML = `
            <div>
                <span><i class="fa fa-${icon} fa-lg bottomBarBtnLabel ${iconStyle}"></i></span>
                <span class="mapToolBtnLabelTxt">${label}</span>
            </div>
        `;
        parentDiv.appendChild(el);
        el.addEventListener("click", () => handler(id));
    }

    public static setTools () {
        let tb = document.getElementById(this.id + '_toolBar') as HTMLUListElement;
        for (let i=0; i< this.tools.length; i++) {
            let tool = this.tools[i];
            this.optionItem(tool, tb, t.definitions[tool].label, t.definitions[tool].icon, (id : string) => this.onToolSelect(id));    
        }
    }

    public static onToolSelect (id : string) {    
    }

    public static updateToolbar() {
        for (let i=0; i<this.tools.length; i++) {
            let tool = this.tools[i];
            if (this.currentTool == tool) {
                utils.addClass(`bb_${this.id}_${tool}_btn`, 'mapToolBtnSelected');
            } else {
                utils.removeClass(`bb_${this.id}_${tool}_btn`, 'mapToolBtnSelected');
            }
        }        
        this.setWindowToolLabel(this.currentTool);
    }

}