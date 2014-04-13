var websocket = new WebSocket('ws://');

websocket.binaryType = 'arraybuffer';

websocket.onmessage = function(msg) {
	var arrayBuffer = msg.data;
	var bytes = new Uint8Array(arrayBuffer);
	$('#image-id').setAttribute('src','data:image/png;base64,' + encode(bytes));
}

if (websocket.bufferedAmount < 'THRESHOLD') {
	websocket.send('JSON_or_XML');
}