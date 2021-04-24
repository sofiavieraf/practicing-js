function Person() {
	var params = {};
	if ( arguments.length == 1 ) {
		params = arguments[0];
	} else {
		if ( typeof arguments[0] === 'string' ) {
			params.name = arguments[0];
			params.birthdate = arguments[1];
		} else {
			params.name = arguments[1];
			params.birthdate = arguments[0];
		}

		if ( arguments.length >= 3 ) params.cellphone = arguments[2];
		if ( arguments.length >= 4 ) params.phone = arguments[3];
		if ( arguments.length >= 5 ) params.email = arguments[4];
		if ( arguments.length >= 6 ) params.address = arguments[5];
	}

	this.name = params.name;
	this.birthdate = params.birthdate;

	if ( params.cellphone !== null && params.cellphone !== undefined )
		this.cellphone = params.cellphone;

	if ( params.phone !== null && params.phone !== undefined )
		this.phone = params.phone;

	if ( params.email !== null && params.email !== undefined )
		this.email = params.email;

	if ( params.address !== null && params.address !== undefined )
		this.address = params.address;

	if ( !this.name || !this.birthdate )
		throw 'Name and birthdate are mandatory';

	this.friends = [];
	this.friendshipRequests = [];
	this.toString = Person.prototype.toString.bind( this );
}

Person.prototype = {
	constructor: Person,

	set email( value ) {
		var regex = /[A-Za-z0-9.+_-]+@[A-Za-z0-9.+_-]+/;

		if ( !regex.test( value ) )
			throw new TypeError( 'Email should have an @' );

		this._email = value;
	},

	get email() {
		return this._email;
	},

	set phone( value ) {
		this._phone = validatePhone( value );
	},

	get phone() {
		return this._phone;
	},

	set cellphone( value ) {
		this._cellphone = validatePhone( value );
	},

	get cellphone() {
		return this._cellphone;
	},

	ageAt: function( date ) {
		var yearDifference = date.getFullYear() - this.birthdate.getFullYear();

		var newDate = new Date( date );
		newDate.setFullYear( this.birthdate.getFullYear() );

		if ( newDate < this.birthdate )
			yearDifference--;

		return yearDifference;
	},

	get age() {
		return this.ageAt( new Date() );
	},

	requestFriendshipTo: function( aPerson ) {
		if ( this.friendshipRequests.indexOf( aPerson ) !== -1 ) {
			this.acceptFriendshipRequestFrom( aPerson );
		} else {
			if ( this.friends.indexOf( aPerson ) === -1 )
				aPerson.letsBeFriends( this );
		}
	},

	letsBeFriends: function( aPerson ) {
		if ( this.friendshipRequests.indexOf( aPerson ) === -1 )
			this.friendshipRequests.push( aPerson );
	},

	acceptFriendshipRequestFrom: function( aPerson ) {
		var index = this.friendshipRequests.indexOf( aPerson );
		if ( index === -1 )
			throw new RangeError( aPerson.name + ' has not requested friendship' );

		this.friendshipRequests.splice( index, 1 );

		this.friends.push( aPerson );
		aPerson.acceptedInvitation( this );
	},

	acceptedInvitation: function( aPerson ) {
		this.friends.push( aPerson );
	},

	isFriendOf: function( aPerson ) {
		return this.friends.indexOf( aPerson ) !== -1;
	},

	hasPendingFriendshipRequestFrom: function( aPerson ) {
		return this.friendshipRequests.indexOf( aPerson ) !== -1;
	},

	get friendCount() {
		return this.friends.length;
	},

	get friendshipRequestCount() {
		return this.friendshipRequests.length;
	},

	friendsIterator: function() {
		var current = 0;
		var self = this;

		return {
			get hasNext() { return current < self.friends.length; },
			get next() { return self.friends[ current++ ]; }
		};
	},

	forEachFriend: function( callback ) {
		var n = this.friends.length;

		for ( var i = 0; i < n; i++ )
			callback( this.friends[ i ], i );
	},

	toString: function() {
		return this.name + ' (' + this.age + ' years)';
	}
};

Person.Jesus = new Person( 'Jesus Christ', new Date( '0001-12-25' ) );
Person.Jesus.isFriendOf = function( _aPerson ) { return true; }
Person.Jesus.letsBeFriends = function( aPerson ) { aPerson.acceptedInvitation( this ); }

Person.Satan = new Person( 'Satan', new Date() );
Person.Satan.isFriendOf = function( _aPerson ) { return false; }
Person.Satan.acceptFriendshipRequestFrom = function( _aPerson ) {}
Person.Satan.hasPendingFriendshipRequestFrom = function( _aPerson ) { return false; }
Person.Satan.requestFriendshipTo = function( _aPerson ) {}

function validatePhone( phone ) {
	var numberCount = 0;
	var len = phone.length;

	for ( var i = 0; i < len; i++ ) {
		switch( phone[i] ) {
			case '+':
			case '(':
			case ')':
			case '-':
			case ' ':
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				numberCount++;
				break;
			default:
				throw new TypeError( 'Phone number is not valid, unrecognized character: "' + phone[i] + '"' );
		}
	}

	if ( numberCount < 8 )
		throw new TypeError( 'Phone number is not valid, has less than 8 characters' );

	return phone;
}

function XMen( name, birthdate ) {
	Person.call( this, name, birthdate );
	this.superPowers = [];

	for ( var i = 2; i < arguments.length; i++ )
		this.superPowers.push( arguments[ i ]  );

	delete this.toString;
}

XMen.prototype = Object.create( Person.prototype );
XMen.prototype.constructor = XMen;

XMen.prototype.hasSuperPower = function( superPower ) {
	return this.superPowers.indexOf( superPower ) !== -1;
};

XMen.prototype.toString = function() {
	return Person.prototype.toString.call( this ) + ' [X-Men]';
};

Object.defineProperty( XMen.prototype, 'superPowerCount', {
	get: function() {
		return this.superPowers.length;
	}
});

Object.defineProperty( XMen.prototype, 'age', {
	get: function() {
		var propertyDescriptor = Object.getOwnPropertyDescriptor( Person.prototype, 'age' );
		return propertyDescriptor.get.call( this ) + 100;
	}
});
