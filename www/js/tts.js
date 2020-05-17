'use strict';
var useWebTTS = true;
class TTS {
	constructor() {
		this.synth = window.speechSynthesis;
	}

	speak(text) {
		if (useWebTTS) {
			var utterThis = new SpeechSynthesisUtterance(text);
			this.synth.speak(utterThis);
		} else {
			document.getElementById("speech").innerHTML = ""
			var para = document.createElement("p")
			para.appendChild(document.createTextNode(text))
			document.getElementById("speech").appendChild(para)
			return;
		}

	} // end speak()
} // end class

