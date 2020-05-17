class WeaponLoader {
	constructor() {

	} // end constructor

	getWeapon(name) {

		switch (name) {
			case "American-Firearms-DT45":
				return {
					name: "American-Firearms-DT45",
					damage: 10,
					speed: 10,
					automatic: true,
					rounds: 30
				}
				break;
			case "Feldtmann-Z420":
				return {
					name: "Feldtmann-Z420",
					damage: 20,
					speed: 40,
					automatic: true,
					rounds: 20
				}
				break;
			case "GGP-8MM-Machine":
				return {
					name: "GGP-8MM-Machine",
					damage: 5,
					speed: 5,
					automatic: true,
					rounds: 60
				}
				break;
			case "Schmitt-And-Smith-R666":
				return {
					name: "Schmitt-And-Smith-R666",
					damage: 15,
					speed: 20,
					automatic: true,
					rounds: 30
				}
				break;
			case "Steve-Gates-P69":
				return {
					name: "Steve-Gates-P69",
					damage: 18,
					speed: 7,
					automatic: true,
					rounds: 15
				}
				break;
			case "Vodkov-V8":
				return {
					name: "Vodkov-V8",
					damage: 20,
					speed: 20,
					automatic: true,
					rounds: 30
				}
				break;

		} // end switch
	} // end get

} // end class
