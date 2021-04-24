 class Person {
	 constructor (...args) {
		if (args.length  === 1) {
			const datos = args[0];

			if (datos.name === undefined || datos.birthdate === undefined) {
				throw new Exception("No name no birthdate");
			}

			this.name = datos.name;
			this.birthdate = datos.birthdate;
			this.cellphone = datos.cellphone;
			this.phone = datos.phone;
			this.email = datos.email;
			this.address = datos.address;
		}

		if (args.length !== 1) {
			if (args[0] instanceof Date) {
				if (args[1] === undefined) {
					throw new Exception("No name no birthdate");
				}

				this.birthdate = args[0];
				this.name = args[1];
				this.cellphone = args[2];
				this.phone = args[3];
				this.email = args[4];
				this.address = args[5];
			} else {
				if (args[1] === undefined || args[0] === undefined) {
					throw new Exception("No name no birthdate");
				}

				this.name = args[0];
				this.birthdate = args[1];
				this.cellphone = args[2];
				this.phone = args[3];
				this.email = args[4];
				this.address = args[5];
			}
		}
	 }
 }