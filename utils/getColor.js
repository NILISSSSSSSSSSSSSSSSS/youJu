

export class ColorUtils {
	static PALETTESIZE = 10;
	static RGBaster = {};
	static canvasId = "";
	static imagePath = "";
	static options = {};
	static retrySum = 100;// enough? too much? It needs more experiences.
	static colorTimeVal = null;

	static makeRGB(name) {
		return ['rgb(', name, ')'].join('');
	}

	static mapPalette(palette) {
		let arr = [];
		for (let prop in palette) { arr.push(this.frmtPobj(prop, palette[prop])) };
		arr.sort(function (a, b) { return (b.count - a.count) });
		return arr;
	}

	static fitPalette(arr, fitSize) {
		if (arr.length > fitSize) {
			return arr.slice(0, fitSize);
		} 
		
		for (let i = arr.length - 1; i < fitSize - 1; i++) { 
			arr.push(this.frmtPobj('0,0,0', 0)) 
		};
		return arr;
	}

	static frmtPobj(a, b) {
		return { name: this.makeRGB(a), count: b };
	}


	/**
	 * 获取主色调
	 * @imagePath 路径
	 * @canvasId canvas ID
	 * @opts {success: 成功回调, width: 宽, height: 高}
	 */
	static colors(imagePath, canvasId, opts) {
		this.canvasId = canvasId;
		this.imagePath = imagePath;
		this.options = opts;

		let width=opts.width||150, height=opts.height||100;
		const ctx = uni.createCanvasContext(canvasId);
		ctx.drawImage(imagePath, 0, 0, width, height);
		ctx.draw();
		clearTimeout(this.colorTimeVal);
		this.colorTimeVal = null;
		let that = this;
		
		this.colorTimeVal = setTimeout(() => {
			if(!that.colorTimeVal) return;
			
			that.getImgData(width, height, function() {
				that.getImgData(width, height,);
			});
		}, 800);
	}
	
	static getImgData(width, height, callback = function() {}) {
		let that = this;
		uni.canvasGetImageData({
			canvasId: this.canvasId,
			x: 0,
			y: 0,
			width: width,
			height: height,
			success(res) {
				// console.log(res.width);
				// console.log(res.height);
				// console.log(res.data instanceof Uint8ClampedArray);
				// console.log(res.data.length); // res.width * res.height * 4
				that.calculate(res.data, that.options);
			},
			fail(err) {
				callback(err);
			}
		});
	}

	static calculate(data, opts) {
		opts = opts || {};
		let exclude = opts.exclude || [], paletteSize = opts.paletteSize || this.PALETTESIZE;
		// for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
		let colorCounts = {},
		rgbString = '',
		rgb = [],
		colors = {
			dominant: { name: '', count: 0 },
			palette: []
		};

		for (let i = 0; i < data.length; i += 4) {
			rgb[0] = data[i];
			rgb[1] = data[i + 1];
			rgb[2] = data[i + 2];
			rgbString = rgb.join(",");
	
			// skip undefined data and transparent pixels
			if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) continue;
	
			if (exclude.indexOf(this.makeRGB(rgbString)) != -1) continue;
			
			// Ignore those colors in the exclude list.
			if (rgbString in colorCounts) {
					colorCounts[rgbString] = colorCounts[rgbString] + 1;
					continue;
			}
			
			colorCounts[rgbString] = 1;
		}

		if (opts.success) {
			let palette = this.fitPalette(this.mapPalette(colorCounts), paletteSize + 1);

			//图片未加载完
			if (palette[0].name == palette[1].name && palette[1].name=="rgb(0,0,0)") {
				if (this.retrySum-- <= 0) {
					// console.log("retrySum: " + this.retrySum);
					palette.length = 0;
					palette.push(this.frmtPobj("0,0,0", 0));
					palette.push(this.frmtPobj("0,0,0", 1));
				} else {
					this.colors(this.imagePath, this.canvasId, this.options);
				}
			}

			opts.success({
				dominant: palette[0].name,
				secondary: palette[1].name,
				palette: palette.map(function (c) { return c.name; }).slice(1)
			});
		}
	}

	/**
	 * invert color
	 * @oldColor rgb(0,0,0)
	 */
	static invertColor(oldColor) {
		let tempArr = oldColor.slice(4, oldColor.length-1).split(",");
		return "rgb("+(255-tempArr[0])+","+(255-tempArr[1])+","+(255-tempArr[2])+")";
	}

	/**
	 * rgb转16进制
	 */
	static rgbToHex(rgb) {
		// rgb(x, y, z)
		let color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
		let hex = "#";

		for (let i = 0; i < 3; i++) {
			// 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
			// 'color[i]' 是数组，要转换成字符串.
			// 如果结果是一位数，就在前面补零。例如： A变成0A
			hex += ("0" + Number(color[i]).toString(16)).slice(-2);
		}
		return hex;
	}

	/**
	 * 明暗色调
	 */
	static isLight(rgb) {
		let color = rgb.toString().match(/\d+/g);
		console.log("color: "+color);
		return (
			0.213 * color[0] +
			0.715 * color[1] +
			0.072 * color[2] >
			255 / 2
		);
	}
};

