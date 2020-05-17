
"use strict";
if (speech == undefined) var speech = new TTS(); var useWebTTS = false;
if (runningMenu == undefined) var runningMenu = 0;
class Menu {
	constructor(name, menuData) {
		this.menuData = menuData;
		this.cursor = 0;
		this.name = name;
		this.sndKeyChar = sono.create("sounds/ui/keyChar.ogg");
		this.sndKeyDelete = sono.create("sounds/ui/keyDelete.ogg");
		this.sndSliderLeft = sono.create("sounds/ui/menuSliderLeft.ogg");
		this.sndSliderRight = sono.create("sounds/ui/menuSliderRight.ogg");
		this.sndBoundary = sono.create("sounds/ui/menuBoundary.ogg");
		this.sndChoose = sono.create("sounds/ui/menuChoose.ogg");
		this.sndMove = sono.create("sounds/ui/menuMove.ogg");
		this.sndOpen = sono.create("sounds/ui/menuOpen.ogg");
		this.sndSelector = sono.create("sounds/ui/menuSelector.ogg");
		this.sndWrap = sono.create("sounds/ui/menuWrap.ogg");
		this.selectCallback = null;




	}




	nextItem() {

		if (this.cursor < this.menuData.length - 1) this.cursor++;
		this.sndMove.play();
		this.menuData[this.cursor].speak();
	}
	previousItem() {
		if (this.cursor > 0) this.cursor--;
		this.sndMove.play();
		this.menuData[this.cursor].speak();
	}

	increase() {
		if (this.menuData[this.cursor].type == MenuTypes.SLIDER || this.menuData[this.cursor].type == MenuTypes.SELECTOR) {
			this.menuData[this.cursor].increase();
			if (this.menuData[this.cursor].type == MenuTypes.SLIDER) {
				this.sndSliderRight.play();
			} else {
				this.sndSelector.play();
			}
		}

	}

	decrease() {
		if (this.menuData[this.cursor].type == MenuTypes.SLIDER || this.menuData[this.cursor].type == MenuTypes.SELECTOR) {
			this.menuData[this.cursor].decrease();
			if (this.menuData[this.cursor].type == MenuTypes.SLIDER) {
				this.sndSliderLeft.play();
			} else {
				this.sndSelector.play();
			}

		}
	}

	insertCharacter(char) {
		if (this.menuData[this.cursor].type == MenuTypes.EDIT) {
			this.menuData[this.cursor].addChar(String.fromCharCode(char));
			this.sndKeyChar.play();
		}
	}

	removeCharacter() {
		if (this.menuData[this.cursor].type == MenuTypes.EDIT) {
			this.menuData[this.cursor].removeChar();
			this.sndKeyDelete.play();
		}
	}
	handleInput(event) {


		runningMenu.insertCharacter(event.which);


	}

	destroy() {
		if (!this.sndChoose.playing) {
			this.sndKeyChar.destroy();
			this.sndKeyDelete.destroy();
			this.sndSliderLeft.destroy();
			this.sndSliderRight.destroy();
			this.sndBoundary.destroy();
			this.sndChoose.destroy();
			this.sndMove.destroy();
			this.sndOpen.destroy();
			this.sndSelector.destroy();
			this.sndWrap.destroy();
		}
		runningMenu = null;
		$(document).off("keydown");
		$(document).off("keypress");
	}

	handleKeys(event) {

		// console.log(this.menuData.length);
		switch (event.which) {
			case KeyEvent.DOM_VK_RETURN:
				runningMenu.select();
				break;

			case KeyEvent.DOM_VK_BACK_SPACE:
				runningMenu.removeCharacter();
				break;

			case KeyEvent.DOM_VK_DOWN:

				runningMenu.nextItem();
				break;
			case KeyEvent.DOM_VK_UP:
				runningMenu.previousItem();
				break;
			case KeyEvent.DOM_VK_RIGHT:

				runningMenu.increase();


				break;
			case KeyEvent.DOM_VK_LEFT:

				runningMenu.decrease();

				break;
		}
	}

	run(callback) {
		this.selectCallback = callback;
		$(document).on("keypress", this.handleInput);
		$(document).on("keydown", this.handleKeys);
		console.log(this.name);
		speech.speak(this.name);
		this.sndOpen.play();
		runningMenu = this;
	}

	select() {
		var selected = this.menuData[this.cursor].id;
		var items = [];
		for (var i = 0; i < this.menuData.length; i++) {
			var addItem = null;
			if (this.menuData[i].type == MenuTypes.SLIDER) {
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].currentValue
				}
			}
			if (this.menuData[i].type == MenuTypes.EDIT) {
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].text
				}
			}
			if (this.menuData[i].type == MenuTypes.SELECTOR) {
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].currentOption
				}
			}
			items.push(addItem);
		}

		var toReturn = {
			selected: selected,
			items: items
		}
		this.sndChoose.play();

		this.selectCallback(toReturn);
	}

}
