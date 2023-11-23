   
    /*---------------------------/
   /                            /
  /       Fetch Override       / 
 /                            /
/---------------------------*/

fetch = function( a, b = {} ) {

    const Handler = {

        // return correct Proxy property value
        get: function( target, prop ) { return target[prop] },
        
        // proxy setter function
        set : function( obj, prop, val ) {
        
            //Define Argument Variables
            var object = obj,
            property = prop,
            value = val;
                
            //Set Property
            object[property] = value;
        
            while(object.length !== 0) {

                //Set XmlHttp Variable and define callbacks
                var xhttp = new XMLHttpRequest();
                xhttp.onload  = object[0].callback.bind(this,true);  // successful callback
                xhttp.onabort = object[0].callback.bind(this,false); // unsuccessful callback
                xhttp.onerror = object[0].callback.bind(this,false); // unsuccessful callback
        
                if ( JSON.stringify( value.options ) != "" ) {

                    //Set headers of POST request using foreach iterator
                    xhttp.open( "POST", value.url );
                    Object.getOwnPropertyNames( value.options ).forEach( ( _property ) => {
                        xhttp.setRequestHeader( _property, value.options[_property] );
                    });

                } else {

                    //Set Headers for GET request manually
                    xhttp.open( "GET", value.url );
                    xhttp.setRequestHeader("headers", { "Content-Type" : "application/json" });
                    xhttp.setRequestHeader("credentials","include");
                    xhttp.setRequestHeader("cache","no-cache");
                    xhttp.setRequestHeader("mode","no-cors");
                    xhttp.setRequestHeader("referrerPolicy","no-referrer");

                }
        
                //send request
                xhttp.send();
                object.splice(0,1);
        
            }
    
            //indicate success to avoid proxy 'set' trap
            return true;

        }

    }

    //Define main 'queue' proxy
    queue = new Proxy([],Handler);

    var url, msg, promise;
    try { url = new URL(a) } catch(_) { console.warn("Argument is not a url"); return false };
    if (url.protocol !== "http:" && url.protocol !== "https:") { console.warn("Incorrect Protocol"); return false };
    msg = { url : a, options : b }; // Set Message object

    promise = new Promise( ( resolve, reject ) => {            
        msg.callback = function( status, data ) { if (status) { resolve(data) } else { reject(data) } };
        queue[queue.length] = msg;
    });

    return promise;

}