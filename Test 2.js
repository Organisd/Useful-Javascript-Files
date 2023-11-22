const Database = window.database = function( a ) {

    const Handler = {

        get : function ( a, b ) {
    
            var target = a,
            property = b,
            result = target[property];
    
            return result;
    
        },
    
        set : async function ( a, b, c ) {
    
            var object = a,
            property = b,
            value = c;
    
            //Set Property
            object[property] = value;
    
            var object_length = Number(object.length);
    
            while (object_length > 0) {
    
                var message = object[0],
                url = message.url,
                details = {
                    method: message.method,
                    mode : "no-cors",
                    cache : "no-cache",
                    credentials : "include",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    referrerPolicy : "no-referrer",
                    body : JSON.stringify( message.data )
                },
                callback = message.callback;
    
                var request = await fetch(url,details);
                await callback(request);
                object.splice( 0, 1 );
                
            }
    
            return true;
    
        }
    
    }
    
    var queue = window.queue = new Proxy( [], Handler );

    var database_index = a;
    var database = class {

        queue_message( a, b, c, d ) {

            var adress = a,
            property = b,
            value = c,
            callback = d,
            message = {
                "url" : adress,
                "method" : "POST",
                "callback" : callback,
                "data" : []
            };

            if ( !Array.isArray( property ) || Array.isArray( value ) ) {
                
                return false;

            };

            if ( property.length !== value.length ) {

                return false;

            };

            property.forEach( ( value, index ) => {

                message.data[ value ] = value[ index ];

            } );

            var queue_length = queue.length;
            queue[ queue_length ] = message;

            return true;

        }

        constructor( a ) {

            this.database_index = a;

        }

    }

    return new database( database_index );

}


//export default Database;