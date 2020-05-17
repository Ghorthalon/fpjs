function mainMenu() {
	var nameItem = new EditItem(0, "Name", "");
	var classItem = new SelectorItem(1, "Character", ["fragwad", "buttersauce", "pug", "frork", "Thorgfloof", "Thimblehead", "Momphfumble", "Clotthimble", "Muckdumb", "Lumpsnark", "Gog", "Morg"]);
	var connectItem = new MenuItem(2, "Connect");

	var mainMenu = new Menu("Pregame menu", [nameItem, classItem, connectItem]);
	mainMenu.run(function (event) {
		if (event.selected == 2 && event.items[0].value != "") {
			localPlayer.name = event.items[0].value;
			localPlayer.voice = event.items[1].value + 1;
			mainMenu.destroy();
			connect("", event.items[0].value, event.items[1].value + 1);
			setupKeys();
			gameLoop();
		}
	});
}
