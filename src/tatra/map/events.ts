export class events {
    
    public static readonly EVENT_BASEMAP_CHANGE         : string = "basemap_change";
    public static readonly EVENT_COLOR_PALETTE_LOADED   : string = "color_palette_loaded";
    public static readonly EVENT_COLOR_UPDATE           : string = "color_update";
    public static readonly EVENT_CONTROL_BTN            : string = "control_btn";
    public static readonly EVENT_CONTROL_DISABLED       : string = "control_btn_disabled";
    public static readonly EVENT_CONTROL_SET            : string = "control_set";
    public static readonly EVENT_GEOJSON_LOADED         : string = "geojson_loaded";
    public static readonly EVENT_GROUP_CONTENT_CHANGE   : string = "group_content_change";
    public static readonly EVENT_HASH_UPDATE            : string = "hash_update";
    public static readonly EVENT_INFO_CLICK             : string = "info_click";
    public static readonly EVENT_LAYER_DATE_UPDATE      : string = "layerDateUpdate";
    public static readonly EVENT_LAYER_HIDDEN           : string = "layerHidden";
    public static readonly EVENT_LAYER_RANGE_UPDATE     : string = "layerRangeUpdate";
    public static readonly EVENT_LAYERS_REFRESH         : string = "layersRefresh";
    public static readonly EVENT_LAYER_VISIBLE          : string = "layerUpdate";
    public static readonly EVENT_LEGEND_CLICK           : string = "legend_click";
    public static readonly EVENT_MAP_EXTENT_CHANGE      : string = "map_extent_change";
    public static readonly EVENT_MAPVIEWER_READY        : string = "mapviewer_ready";
    public static readonly EVENT_MENU_CLOSE             : string = "menu_close";
    public static readonly EVENT_MENU_CLOSEABLE         : string = "menu_closeable";
    public static readonly EVENT_MENU_RESIZE            : string = "menu_resize";
    public static readonly EVENT_SELECTION_UPDATE       : string = "selection_update";
    public static readonly EVENT_TOOL_RESULT_UPDATE     : string = "tool_result_update";
    public static readonly EVENT_UI_LAYER_UPDATE        : string = "ui_layer_update"; 
    
    public static updateHash () {
        document.dispatchEvent(new CustomEvent(events.EVENT_HASH_UPDATE));
    }

    public static controlButtonClicked (id : string, state : boolean) {
        document.dispatchEvent(new CustomEvent(events.EVENT_CONTROL_BTN, {
            detail: {
                id : id,
                visible: state
            },
        }));
    }

    public static controlDisabledClicked (id : string) {
        document.dispatchEvent(new CustomEvent(events.EVENT_CONTROL_DISABLED, {
            detail: {
                id : id
            },
        }));
    }

    public static setControlState(id: string, state: boolean) {
        document.dispatchEvent(new CustomEvent(events.EVENT_CONTROL_SET, {
            detail: {
                id : id,
                state : state
            },
        }));
    }

    public static infoClicked (id:string) {
        document.dispatchEvent(new CustomEvent(events.EVENT_INFO_CLICK, {
            detail: {
                infoId : id
            }
        }));
    }
    public static legendClicked (id:string) {
        document.dispatchEvent(new CustomEvent(events.EVENT_LEGEND_CLICK, {
            detail: {
                infoId : id
            }
        }));
    }
    
    public static menuClose (menuId : string) {
        document.dispatchEvent(new CustomEvent(events.EVENT_MENU_CLOSE, {
            detail: {
                menuId: menuId
            }
        }));
    }

    public static menuCloseAble (menuId : string) {
        document.dispatchEvent(new CustomEvent(events.EVENT_MENU_CLOSEABLE, {
            detail: {
                menuId: menuId
            }
        }));
    }

    public static dispatch (evt : string) {
        document.dispatchEvent(new CustomEvent(evt));
    }

    public static dispatchLayer (evt : string, id : string) {
        document.dispatchEvent(new CustomEvent(evt, {
            detail: {
                id: id,
            },
        }));
    }
        
    public static selectionUpdate (id: string, internal : boolean = false) {
        document.dispatchEvent(new CustomEvent(events.EVENT_SELECTION_UPDATE, {
            detail: {
                id: id,
                internal : internal
            }
        }));
    }
};
