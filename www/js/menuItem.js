"use strict";
var MenuTypes = {
	NORMAL: 0,
	SELECTOR: 1,
	SLIDER: 2,
	EDIT: 3
}

class MenuItem {
	constructor(id, name) {
		this.name = name;
		this.id = id;
		this.type = MenuTypes.NORMAL;
	}

	speak() {
		speech.speak(this.name);
	}

	select() {
		return this.id;
	}

}




class SelectorItem extends MenuItem {
	constructor(id, name, options, defaultOption = 0) {
		super();
		this.id = id;
		this.name = name;
		this.options = options;
		this.type = MenuTypes.SELECTOR;
		this.currentOption = defaultOption;
	}

	speak() {
		speech.speak(this.name + ". Selector. Set to " + this.options[this.currentOption]);
	}

	increase() {
		if (this.currentOption < this.options.length - 1) this.currentOption++;
		speech.speak(this.options[this.currentOption]);
	}

	decrease() {
		if (this.currentOption > 0) this.currentOption--;
		speech.speak(this.options[this.currentOption]);
	}

	select() {
		return this.id;
	}
}


class SliderItem extends MenuItem {
	constructor(id, name, from, to, currentValue = 0) {
		super();
		this.id = id;
		this.name = name;
		this.minValue = from;
		this.maxValue = to;
		this.currentValue = currentValue;
		this.type = MenuTypes.SLIDER;
	}

	speak() {
		speech.speak(this.name + ". Slider. Set to " + this.currentValue);
	}

	increase() {
		if (this.currentValue < this.maxValue) this.currentValue++;
		speech.speak(this.currentValue);
	}

	decrease() {
		if (this.currentValue > this.minValue) this.currentValue--;
		speech.speak(this.currentValue);
	}

	select() {
		return this.id;
	}

}


class EditItem extends MenuItem {
	constructor(id, name, defaultText = "") {
		super();
		this.id = id;
		this.name = name;
		this.text = defaultText;
		this.type = MenuTypes.EDIT;
	}

	speak() {
		speech.speak(this.name + ". Editable. " + (this.text == "" ? "Nothing entered." : "Set to " + this.text));
	}

	addChar(char) {
		this.text += char;
		speech.speak(char);
	}

	removeChar() {
		this.text = this.text.substring(0, this.text.length - 1);
		speech.speak(this.text);

	}

	select() {
		return this.text;
	}


}


