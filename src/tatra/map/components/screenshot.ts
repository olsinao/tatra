import { baseComponent } from "./baseComponent";
import { utils } from "../../utils";
import { props } from "../props";
import { Navigation } from "../../page/Navigation";
import { hash } from "../hash";

export class screenshot extends baseComponent {
	public static id		: string = 'screenshot';
	public static label		: string = 'Screenshot';
    public static draggable : boolean = true;

    public static open () {
        super.open();
        let mh = (document.getElementById('map') as HTMLDivElement).clientHeight  - 250;
        let mw = ((document.getElementById('map') as HTMLDivElement).clientWidth- 300) / 2 - 40;
        if (mh < 0) { mh = 0;}
        if (mw < 0) { mw = 0;}
        this.position(mw, mh );
    }

    public static createWindow () {
        super.createWindow();
        
		let el = document.getElementById(`lmvControls_${this.id}_Content`) as HTMLDivElement;
        if (! el) { return; }
        el.innerHTML = `
            <p>
                Download current map view into jpg file.
            </p>
            <table style="width:100%;">
                <tr>
                    <td>
                        <input type="checkbox" checked id="lmvCtrlBtns_${this.id}_header"> Header
                        <br>
                        <input type="checkbox" checked id="lmvCtrlBtns_${this.id}_timestamp"> Timestamp
                        <br>
                        <input type="checkbox" checked id="lmvCtrlBtns_${this.id}_scalebar"> Scalebar
                    </td>
                    <td>
                        <button id="lmvControlsBtn_${this.id}_whole"><i class="fa fa-download fa-lg"></i> Download image</button>
                    </td>
                </tr>
            </table>
            <a id="lmvControlsBtn_${this.id}_a" href="" style="color:#eee;" download="screenshot.png"></a>
        `;
//        utils.setClick(`lmvControlsBtn_${this.id}_whole`, () => this.saveImage());
        utils.setClick(`lmvControlsBtn_${this.id}_whole`, () => this.saveImage());
    }

    public static saveImage () {
        let showHeader = (document.getElementById(`lmvCtrlBtns_${this.id}_header`) as HTMLInputElement).checked;
        let showTimestamp = (document.getElementById(`lmvCtrlBtns_${this.id}_timestamp`) as HTMLInputElement).checked;
        let showScaleline = (document.getElementById(`lmvCtrlBtns_${this.id}_scalebar`) as HTMLInputElement).checked;
        let canvases = document.querySelectorAll('.ol-layer canvas');
        if (canvases.length == 0) {
            console.log("Error obtaining map canvas");
            return;
        }
        let image = document.createElement('canvas');
        let size = props.map.getSize();
        image.width = size[0];
        image.height = size[1];
        let context = image.getContext('2d');
        for (let i=0; i<canvases.length; i++) {
            let canvas = canvases[i] as HTMLCanvasElement;
            if (canvas.width > 0) {
                let opacity = (canvas.parentNode as HTMLElement).style.opacity;
                context.globalAlpha = opacity === '' ? 1 : Number(opacity);
                let transform = canvas.style.transform;
                // Get the transform parameters from the style's transform matrix
                let matrix = transform
                  .match(/^matrix\(([^\(]*)\)$/)[1]
                  .split(',')
                  .map(Number);
                // Apply the transform to the export map context
                CanvasRenderingContext2D.prototype.setTransform.apply(context, matrix);
                context.drawImage(canvas, 0, 0);
            }
        }
        CanvasRenderingContext2D.prototype.setTransform.apply(context, [1, 0, 0, 1, 0, 0]);
        if (showScaleline) { this.drawScaleline(image); }
        if (showTimestamp) { this.addTimestamp(image, (new Date().toString()));}
        if (showHeader) { this.addLogo(image); }

        let dates = '';
        if (hash.datesToString()) {
            dates = (hash.datesToString() as string).replace('d:', '').replace('..', '_');
        }
        let location = hash.locationToString();
        let name = `${props.config.properties.applicationName}_${dates}[${location}].jpg`;
        
        if (navigator.msSaveBlob) {
            // link download attribuute does not work on MS browsers
            navigator.msSaveBlob(image.msToBlob(), name);
        } else {
            let link = document.getElementById(`lmvControlsBtn_${this.id}_a`) as HTMLAnchorElement;
            link.download = name;
            link.href = image.toDataURL("image/jpeg");
            link.click();
        }
    }

    public static addTimestamp (canvas : HTMLCanvasElement, text : string) {
        let ctx = canvas.getContext('2d');
        if (! ctx) { return; }
        let x = canvas.width - 10;
        let y = canvas.height - 10;
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        this.writeTranparentText(ctx, text, x, y);        

        let text1 = document.getElementById('lmvFeatureInfo1');
        let text2 = document.getElementById('lmvFeatureInfo2');
        if (text1) {
            y = y - 20;
            this.writeTranparentText(ctx, text1.innerText, x, y);  
        }
        if (text2) {
            y = y - 20;
            this.writeTranparentText(ctx, text2.innerText, x, y);  
        }
    }

    public static addLogo (canvas : HTMLCanvasElement) {
        let ctx = canvas.getContext('2d');
        if (!ctx || !props.config) { return;}
        let logo = document.getElementById('lmvMaxLabelImg') as HTMLCanvasElement;
        let w = 50;
        let h = 40;
        if (logo.style.width) { w = Number(logo.style.width.replace('px', ''));}
        if (logo.style.height) { h = Number(logo.style.height.replace('px', ''));}
        ctx.drawImage(logo, 10, 10, w, h);
        let x = w + 20;
        let y = 30;
        let text = 'test';
        ctx.font = '24px "Titillium Web", sans-serif';
        ctx.textAlign = "left";
        this.writeTranparentText(ctx, props.config.properties.applicationName, x, y);
        
        x = 70;
        y = 46;
        if (Navigation.settings.app.singleLabel) {
            text = Navigation.settings.app.singleLabel;
        } else if ( Navigation.settings.app.doubleLongLabel) {
            text = Navigation.settings.app.doubleLongLabel;
        }
        text.replace('&amp;', '&');
        ctx.font = '14px "Titillium Web", sans-serif';
        ctx.textAlign = "left";
        this.writeTranparentText(ctx, text, x, y);

    }

    private static writeTranparentText (ctx:CanvasRenderingContext2D ,text: string, x : number, y : number) {
        ctx.fillStyle = "rgba(30,30,30,0.8)";
        ctx.fillText(text,x-1,y-1);        
        ctx.fillText(text,x-1,y+1);        
        ctx.fillText(text,x+1,y-1);        
        ctx.fillText(text,x+1,y+1);        
        ctx.fillStyle = "rgba(240,240,240, 0.85)";
        ctx.fillText(text,x,y); 
    }

    private static drawScaleline (canvas : HTMLCanvasElement) {
        let ctx = canvas.getContext('2d');
        if (! ctx) { return; }

        let x = 20;
        let y = canvas.height - 50;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        let els = document.querySelectorAll('.ol-scale-line-inner');
        let _width = 0;
        for (let i=0; i<els.length; i++) {
            let el = els[i] as HTMLDivElement;
            let width = el.offsetWidth;
            if (_width < width) {
                _width = width;
            }
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(x, y - 15 + i*20 , width, 20);
        }
        ctx.strokeStyle = 'rgba(250,250,250, 1)';
        ctx.fillStyle = 'rgba(250,250,250, 1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y+5);
        ctx.lineTo(x+_width, y+5);
        ctx.stroke();

		for (let i=0; i<els.length; i++) {
            let el = els[i] as HTMLDivElement;
            let text = el.innerHTML;
            let width = el.offsetWidth;
            this.writeTranparentText(ctx, text, x + width / 2, y + 20*i);
        }
    }

}
