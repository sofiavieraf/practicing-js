(function () {
	'use strict';

	var _tests = Object.create( null );
	var _runTests = Object.create( null );
	var _testsToRun = [];

	function getSource() {
		var capturedStack = null

		try {
			throw new Error();
		} catch ( e ) {
			capturedStack = e.stack;
		}

		return capturedStack.split( '\n' )[ 4 ].trim();
	}

	function TestFailed( message, source ) {
		this.message = message;
		this.source = source;
	}

	function TestSkipped( source ) {
		this.source = source;
	}

	function testSkipped() {
		return new TestSkipped( getSource() );
	}

	function testFailed( message ) {
		return new TestFailed( message, getSource() );
	}

	window.testRunner = {
		add: function( test ) {
			_tests[ test.name || test.test.name ] = test;
		},

		run: function() {
			var test, testName;
			_runTests = Object.create( null );

			for ( testName in _tests ) {
				test = _tests[ testName ];

				if ( test.setUp )
					test.setUp();

				try {
					(test.test || test)();
					_runTests[ testName ] = 'OK';
				} catch ( e ) {
					if ( e instanceof TestFailed )
						_runTests[ testName ] = 'FAILED|' + e.message + '<br>' + e.source;
					else if ( e instanceof TestSkipped )
						_runTests[ testName ] = 'SKIPPED|' + e.source;
					else
						_runTests[ testName ] = 'ERROR|' + e.stack.split( '\n' ).join( '<br>' );
				}

				if ( test.tearDown )
					test.tearDown();
			}
		},

		forEachTest: function( callback ) {
			for ( var testName in _tests )
				callback( testName, _tests[ testName ] );
		},

		forEachRunTest:  function( callback ) {
			for ( var testName in _runTests )
				callback( testName, _runTests[ testName ] );
		}
	};

	window.assertEq = function( actual, expected, message ) {
		if ( message === undefined )
			message = expected + ' == ' + actual;

		if ( actual !== expected )
			throw testFailed( message + '<br>Expected "' + expected + '" but got "' + actual + '"' );
	};

	window.assertNotEq = function( actual, notExpected, message ) {
		if ( message === undefined )
			message = notExpected + ' !== ' + actual;

		if ( actual === notExpected )
			throw testFailed( message + '<br>Did not expect "' + notExpected + '", but got "' + actual + '"' );
	};

	window.assert = function( value, message ) {
		if ( message === undefined )
			message = value + ' should be true';

		if ( !value )
			throw testFailed( message + '<br>Expected "true" but got "' + value + '"' );
	};

	window.assertNot = function( value, message ) {
		if ( message === undefined )
			message = value + ' should not be true';

		if ( value )
			throw testFailed( message + '<br>Expected "false" but got "' + value + '"' );
	}

	window.assertNoException = function( func, message ) {
		if ( message === undefined )
			message = 'Should not raise exception';

		try {
			func();
		} catch ( e ) {
			throw testFailed( message + '<br>' + e.message );
		}
	};

	window.assertException = function( type, func, message ) {
		if ( !Error.isPrototypeOf( type ) ) {
			func = type;
			type = null;
		}

		if ( message === undefined ) {
			if ( type === null )
				message = 'Should raise exception of any type';
			else
				message = 'Should raise exception of type ' + type.name;
		}


		try {
			func();
		} catch( e ) {
			if ( !type || e.constructor === type )
				return;
		}

		throw testFailed( message );
	};

	window.skipTest = function() {
		throw testSkipped();
	};
})();
