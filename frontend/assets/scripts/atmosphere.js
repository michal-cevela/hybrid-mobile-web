function subscriber(){
  
     var socket = $.atmosphere;
     var subSocket;
     var model = [] ;
     
     var obj = {
    		 getModel : function(){ return model ; },
    		 subscribe : function(){ 
    			  var request = { url : document.location.toString()+'atmosphere/?channelId=12351',
    					     transport : 'websocket' ,
    					     fallbackTransport: 'long-polling',   
    					     'enableXDR': true,
    					     'withCredentials': true,
    					     'transport' : 'long-polling'
    			         };
    			         
    			     request.onMessage = function (response) {
    			             detectedTransport = response.transport;
    			             if (response.status == 200) {
    			                 var data = response.responseBody;
 
    			                 try {
    			                     var result = $.parseJSON(data);
    			                     model.push(result); 
    			                     
    			                 } catch (err) {
    			                     alert("Exception: " + err)
    			                 }
    			             }
    			         };
 
    			         subSocket = socket.subscribe(request);
    		 }
     }
     
     return obj; 
}