class SpawnPoint extends GameObject {
	constructor(x, y, z, name) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = name;
		this.type = Types.SPAWNPOINT;
	}


}
