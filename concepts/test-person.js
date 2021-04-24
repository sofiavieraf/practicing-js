(function(){
	'use strict';

	function mockNow( year, month, day, callback ) {
		var oldDate = Date;

		// NOTE: This is a double of the Date object, we stub 2 methods:
		//  - The constructor
		//  - now()
		// If there's another way to get the current time this test will
		// fail, even if the method is working correctly.
		window.Date = function () { return new oldDate( year, month, day ) };
		window.Date.now = function() { return (new Date()).getTime(); }

		try {
			callback();
		} catch ( e ) {
			window.Date = oldDate;
			throw e;
		}

		window.Date = oldDate;
	}

	function personWithEmail( email ) {
		var person = new Person({
			name: 'Some Name',
			birthdate: new Date(),
			email: email
		});

		assertEq( person.email, email );
	}

	function personWithPhone( phone ) {
		var person1 = new Person({
			name: 'Some Name',
			birthdate: new Date(),
			phone: phone
		});

		var person2 = new Person({
			name: 'Some Name',
			birthdate: new Date(),
			cellphone: phone
		});

		assertEq( person1.phone, phone );
		assertEq( person2.cellphone, phone );
	}

	var mcfly = {
		name: 'Martin Seamus McFly',
		birthdate: new Date( 1968, 10, 6, 3, 12, 13 ),
		cellphone: '+54 11 1234 4321',
		phone: '+54 237 1234 4312',
		email: 'martin.mcfly@gmail.com',
		address: 'Juan B. Justo 1234',
	};

	var tests = [
		'when first parameter is a dictionary, it should use it to initialize its properties', function() {
			var person = new Person( mcfly );

			assertEq( person.name, mcfly.name );
			assertEq( person.birthdate, mcfly.birthdate );
			assertEq( person.cellphone, mcfly.cellphone );
			assertEq( person.phone, mcfly.phone );
			assertEq( person.email, mcfly.email );
			assertEq( person.address, mcfly.address );
		},

		'when first parameter is a string it should initialize in order name, birthdate, cellphone, phone, email, address', function() {
			var parameters = {
				name: 'Martin Seamus McFly',
				birthdate: new Date( 1968, 10, 6, 3, 12, 13 ),
				cellphone: '+54 11 1234 4321',
				phone: '+54 237 1234 4312',
				email: 'martin.mcfly@gmail.com',
				address: 'Juan B. Justo 1234',
			};

			var person = new Person( parameters.name, parameters.birthdate, parameters.cellphone, parameters.phone, parameters.email, parameters.address );

			assertEq( person.name, parameters.name );
			assertEq( person.birthdate, parameters.birthdate );
			assertEq( person.cellphone, parameters.cellphone );
			assertEq( person.phone, parameters.phone );
			assertEq( person.email, parameters.email );
			assertEq( person.address, parameters.address );
		},

		'when first parameters is a date it should initialize in order birthdate, name, cellphone, phone, email, address', function() {
			var parameters = {
				name: 'Martin Seamus McFly',
				birthdate: new Date( 1968, 10, 6, 3, 12, 13 ),
				cellphone: '+54 11 1234 4321',
				phone: '+54 237 1234 4312',
				email: 'martin.mcfly@gmail.com',
				address: 'Juan B. Justo 1234',
			};

			var person = new Person( parameters.birthdate, parameters.name, parameters.cellphone, parameters.phone, parameters.email, parameters.address );

			assertEq( person.name, parameters.name );
			assertEq( person.birthdate, parameters.birthdate );
			assertEq( person.cellphone, parameters.cellphone );
			assertEq( person.phone, parameters.phone );
			assertEq( person.email, parameters.email );
			assertEq( person.address, parameters.address );
		},

		'when name or birthdate are not given to the constructor, it should fail to construct the object', function() {
			assertNoException( function() { new Person( 'Hi', new Date() ); } );
			assertNoException( function() { new Person( { name: 'Hi', birthdate: (new Date()) } ); } );

			assertException( function() { new Person( 'Hi' ); });
			assertException( function() { new Person(); });
			assertException( function() { new Person( { name: 'Hi' } ); } );
			assertException( function() { new Person( { email: 'hi@email.com' } ); } );
		},

		'when the email address has user, @, domain and is composed of valid characters, the validation should pass', function() {
			personWithEmail( 'user@domain' )
			personWithEmail( 'user@domain.com' )
			personWithEmail( 'user@domain.com.ar' )
			personWithEmail( 'user.with.very.long.name@very_large.i.think.domain.com' )
			personWithEmail( 'MyUser12345.+asdf-_asdf@myDomain_asdf+1234.adfs-daf.com.ar' )
		},

		'when the email is empty, the validation should fail', function() {
			assertException( TypeError, personWithEmail.bind( this, '' ) );
		},

		'when the email address has no @, the validation should fail', function() {
			assertException( TypeError, personWithEmail.bind( this, 'email.without.at.sign' ) );
		},

		'when the email address has no user, the validation should fail', function() {
			assertException( TypeError, personWithEmail.bind( this, '@domain.com' ) );
		},

		'when the email address has no domain, the validation should fail', function() {
			assertException( TypeError, personWithEmail.bind( this, 'email.with@' ) );
		},

		'when phone numbers have letters or symbols, validation should fail ', function() {
			assertException( TypeError, personWithPhone.bind( this, '+54 11a1234 4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '+54-11-12z4-4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '+54 e 11 - 1234 - 4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '(+54) 11 2o34 4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '(+54) 11 2!34 4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '(+54) 1# 2134 4321' ) );
			assertException( TypeError, personWithPhone.bind( this, '(+54) 11 2134 43&1' ) );
		},

		'when phone numbers have numbers and regular separators, validation shouls pass', function() {
			personWithPhone( '+54 11 1234 4321' );
			personWithPhone( '+54-11-1234-4321' );
			personWithPhone( '+54 - 11 - 1234 - 4321' );
			personWithPhone( '(+54) 11 1234 4321' );
			personWithPhone( '+54 11 1234 4321' );
			personWithPhone( '+541112344321' );
			personWithPhone( '541112344321' );
			personWithPhone( '54 - 11 - 1234 - 4321' );
			personWithPhone( '54-11-1234-4321' );
			personWithPhone( '54 11 1234 4321' );
			personWithPhone( '0237 466 2941' );
			personWithPhone( '0237-464-2941' );
			personWithPhone( '+542374642491' );
			personWithPhone( '54491432' );
		},

		'when phone numbers have less than 8 numbers, validation should fail', function() {
			assertException( TypeError, personWithPhone.bind( this, '' ) );
			assertException( TypeError, personWithPhone.bind( this, '+' ) );
			assertException( TypeError, personWithPhone.bind( this, '4' ) );
			assertException( TypeError, personWithPhone.bind( this, '5491' ) );
			assertException( TypeError, personWithPhone.bind( this, '5491432' ) );
		},

		'ageAt() method should return the age of the person at the exact date given', function() {
			var person = new Person( mcfly );
			assertEq( person.ageAt( new Date( 1985, 0, 1 ) ), 16 );
			assertEq( person.ageAt( new Date( 1985, 10, 6, 3, 12, 12 ) ), 16, 'One second before his birthdate he should be 16' );
			assertEq( person.ageAt( new Date( 1985, 10, 6, 3, 12, 13 ) ), 17, 'At the exact second of his birthdate he should be 17' );
		},

		'age should return the age as of now', function() {
			var person = new Person( mcfly );

			mockNow( 1985, 0, 1, function() {
				assertEq( person.age, 16 );
			});
		},

		'A newly created person should have no friends nor friendship requests', function() {
			var person = new Person( 'A Person', new Date() );

			assertEq( person.friendCount, 0 );
			assertEq( person.friendshipRequestCount, 0 );
		},

		'A person may send a friendship request to another', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			person1.requestFriendshipTo( person2 );

			assertEq( person1.friendCount, 0 );
			assertEq( person1.friendshipRequestCount, 0 );

			assertEq( person2.friendCount, 0 );
			assertEq( person2.friendshipRequestCount, 1 );
			assert( person2.hasPendingFriendshipRequestFrom( person1 ) );
		},

		'Friendship requests should not be repeated', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			person1.requestFriendshipTo( person2 );
			person1.requestFriendshipTo( person2 );
			person1.requestFriendshipTo( person2 );
			person1.requestFriendshipTo( person2 );

			assertEq( person1.friendCount, 0 );
			assertEq( person1.friendshipRequestCount, 0 );
			assertEq( person2.friendCount, 0 );
			assertEq( person2.friendshipRequestCount, 1 );
			assert( person2.hasPendingFriendshipRequestFrom( person1 ) );
		},

		'When two people request friendship, the friendship is automatically given', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			person1.requestFriendshipTo( person2 );
			person2.requestFriendshipTo( person1 );

			assertEq( person1.friendshipRequestCount, 0 );
			assertEq( person2.friendshipRequestCount, 0 );
			assertEq( person1.friendCount, 1 );
			assertEq( person2.friendCount, 1 );
			assert( person1.isFriendOf( person2 ) );
			assert( person2.isFriendOf( person1 ) );
		},

		'A friendship request to a friend should do nothing', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			person1.requestFriendshipTo( person2 );
			person2.acceptFriendshipRequestFrom( person1 );
			person1.requestFriendshipTo( person2 );

			assertEq( person1.friendshipRequestCount, 0 );
			assertEq( person2.friendshipRequestCount, 0 );
		},

		'When a person accepts a friendship request, both people become friends', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			person1.requestFriendshipTo( person2 );
			person2.acceptFriendshipRequestFrom( person1 );

			assertEq( person1.friendCount, 1 );
			assertEq( person2.friendCount, 1 );

			assertEq( person1.friendshipRequestCount, 0 );
			assertEq( person2.friendshipRequestCount, 0 );

			assert( person1.isFriendOf( person2 ) );
			assert( person2.isFriendOf( person1 ) );
		},

		'A person cannot accept a friendship request that doesn\'t exist', function() {
			var person1 = new Person( 'A Person', new Date() );
			var person2 = new Person( 'Another Person', new Date() );

			assertException( RangeError, function() {
				person1.acceptFriendshipRequestFrom( person2 );
			});

			assertEq( person1.friendCount, 0 );
			assertEq( person2.friendCount, 0 );

			assertEq( person1.friendshipRequestCount, 0 );
			assertEq( person2.friendshipRequestCount, 0 );
		},

		'Jesus is friend of everyone', function() {
			var person1 = new Person( 'A Person', new Date() );
			assert( Person.Jesus.isFriendOf( person1 ) );
		},

		'Jesus was born December 25th, Year 1', function() {
			var christmasEve = new Date( 2000, 11, 24 );
			var christmas = new Date( 2000, 11, 25 );

			assertEq( Person.Jesus.ageAt( christmasEve ), 1998 );
			assertEq( Person.Jesus.ageAt( christmas ), 1999 );
		},

		'Jesus accepts all friend requests', function() {
			var person1 = new Person( 'A Person', new Date() );

			person1.requestFriendshipTo( Person.Jesus );
			assert( person1.isFriendOf( Person.Jesus ) );
		},

		'Satan is friend of no-one and won\'t accept any friend request', function() {
			var person1 = new Person( 'A Person', new Date() );

			assertNot( Person.Satan.isFriendOf( person1 ) );

			person1.requestFriendshipTo( Person.Satan );
			assertNot( Person.Satan.hasPendingFriendshipRequestFrom( person1 ) );

			Person.Satan.acceptFriendshipRequestFrom( person1 );
			assertNot( Person.Satan.isFriendOf( person1 ) );
			assertNot( person1.isFriendOf( Person.Satan ) );
		},

		'Satan does not send friend requests', function() {
			var person1 = new Person( 'A Person', new Date() );
			Person.Satan.requestFriendshipTo( person1 );
			assertNot( person1.hasPendingFriendshipRequestFrom( Person.Satan ) );
		},

		'friendsIterator() method gives an iterator to enumrate friends of current person', function() {
			var person1 = new Person( 'Person 1', new Date() );
			var person2 = new Person( 'Person 2', new Date() );
			var person3 = new Person( 'Person 3', new Date() );
			var person4 = new Person( 'Person 3', new Date() );
			var friendsOfPerson4 = [ person1, person2, person3 ] ;

			friendsOfPerson4.forEach( function( p ) {
				p.requestFriendshipTo( person4 );
				person4.acceptFriendshipRequestFrom( p );
			});

			var iterator = person4.friendsIterator();
			assert( iterator.hasNext ); assertEq( iterator.next, person1 );
			assert( iterator.hasNext ); assertEq( iterator.next, person2 );
			assert( iterator.hasNext ); assertEq( iterator.next, person3 );
		},

		'friendsIterator() maybe called multiple times, and should have a separate state for each', function() {
			var person1 = new Person( 'Person 1', new Date() );
			var person2 = new Person( 'Person 2', new Date() );
			var person3 = new Person( 'Person 3', new Date() );
			var person4 = new Person( 'Person 3', new Date() );
			var friendsOfPerson4 = [ person1, person2, person3 ] ;

			friendsOfPerson4.forEach( function( p ) {
				p.requestFriendshipTo( person4 );
				person4.acceptFriendshipRequestFrom( p );
			});

			var iterator1 = person4.friendsIterator();
			var iterator2 = person4.friendsIterator();

			assertEq( iterator1.next, person1 );
			assertEq( iterator1.next, person2 );
			assertEq( iterator2.next, person1 );
			assertEq( iterator1.next, person3 );
			assertNot( iterator1.hasNext );
			assertEq( iterator2.next, person2 );
			assertEq( iterator2.next, person3 );
			assertNot( iterator2.hasNext );
		},

		'forEachFriend() method iterates over all friends', function() {
			var person1 = new Person( 'Person 1', new Date() );
			var person2 = new Person( 'Person 2', new Date() );
			var person3 = new Person( 'Person 3', new Date() );
			var person4 = new Person( 'Person 3', new Date() );
			var friendsOfPerson4 = [ person1, person2, person3 ] ;

			friendsOfPerson4.forEach( function( p ) {
				p.requestFriendshipTo( person4 );
				person4.acceptFriendshipRequestFrom( p );
			});

			person4.forEachFriend( function( friend, index ) {
				assertEq( friend, friendsOfPerson4[ index ] );
			});
		},

		'toString() method should print name and age', function() {
			var person = new Person( 'Person 1', new Date( 1987, 10, 1 ) );

			mockNow( 2016, 2, 1, function() {
				assertEq( person.toString(), 'Person 1 (28 years)' );
			});
		},

		'toString() method should be lexically scoped', function() {
			var person = new Person( 'Person 1', new Date( 1987, 10, 1 ) );
			var toString = person.toString;

			mockNow( 2016, 2, 1, function() {
				assertEq( toString(), 'Person 1 (28 years)' )
			});
		},

		'X-Men constructor has name, birthdate, and a list of superpowers', function() {
			var birthdate1 = new Date( 2000, 1, 1 );
			var birthdate2 = new Date( 1998, 1, 1 );

			var wolverine = new XMen( 'Wolverine', birthdate1, 'claws', 'regeneration' );
			var xavier = new XMen( 'Charles Xavier', birthdate2, 'telepathy', 'astral projection', 'weelchair' );

			assertEq( wolverine.name, 'Wolverine' );
			assertEq( wolverine.birthdate, birthdate1 );
			assertEq( wolverine.superPowerCount, 2 );
			assert( wolverine.hasSuperPower( 'claws' ) );
			assert( wolverine.hasSuperPower( 'regeneration' ) );

			assertEq( xavier.name, 'Charles Xavier' );
			assertEq( xavier.birthdate, birthdate2 );
			assertEq( xavier.superPowerCount, 3 );
			assert( xavier.hasSuperPower( 'telepathy' ) );
			assert( xavier.hasSuperPower( 'astral projection' ) );
			assert( xavier.hasSuperPower( 'weelchair' ) );
		},

		'X-Men are people too', function() {
			var person = new Person( 'Normal Person', new Date() );
			var wolverine = new XMen( 'Wolverine', new Date() );
			var xavier = new XMen( 'Charles Xavier', new Date() );

			person.requestFriendshipTo( xavier );
			xavier.acceptFriendshipRequestFrom( person );

			xavier.requestFriendshipTo( wolverine );
			wolverine.acceptFriendshipRequestFrom( xavier );

			assert( xavier.isFriendOf( person ) );
			assert( xavier.isFriendOf( wolverine ) );
			assert( person.isFriendOf( xavier ) );
			assert( wolverine.isFriendOf( xavier ) );
		},

		'X-Men constructor is XMen function', function() {
			var wolverine = new XMen( 'Wolverine', new Date() );
			assertEq( wolverine.constructor, XMen );
		},

		'X-Men age is always +100', function() {
			var wolverine = new XMen( 'Wolverine', new Date( 2000, 5, 5 ) );
			var xavier = new XMen( 'Charles Xavier', new Date( 1998, 4, 5 ) );

			mockNow( 2016, 5, 3, function() {
				assertEq( wolverine.age, 115 );
				assertEq( xavier.age, 118 );
			});
		},

		'X-Men toString() adds the [X-Men] tag', function() {
			var wolverine = new XMen( 'Wolverine', new Date( 2000, 5, 5 ) );

			mockNow( 2016, 5, 3, function() {
				assertEq( wolverine.toString(), 'Wolverine (115 years) [X-Men]' );
			});
		},
	];

	for ( var i = 0, n = tests.length; i < n; i += 2 ) {
		var testObject = {
			name: tests[ i ],
			test: tests[ i + 1 ]
		};

		testRunner.add( testObject );
	}
})();
