var socket = io.connect();

//Listens for a msg sent from server with keyword 'power'
//This is called after power has been calculated
socket.on('power', function (msg) {
    var data = JSON.parse(msg);
    //Displays power values in the gauge
    Gauge.Collection.get('power_canvas_id').setValue(data.power);
    //Displays current values in the gauge
    Gauge.Collection.get('current_canvas_id').setValue(data.current); 
});

//When the button "Turn plug on/Turn plug off" is pressed, a notification is sent to the server to act
function control_relay(){
    socket.emit('control_relay', {value: 0});   
}

//Listens for a msg sent from server with keyword 'control_relay'
//This is called to change the message on the button "Turn plug on/Turn plug off" and change it's colour
socket.on('control_relay', function(relayState) {
    var button = $('#relay_button');
    if(relayState.value === false) {        
        button.html('Turn plug off');
        button.css('background-color', 'red');
    }
    else if(relayState.value === true) {
        //button.attr("onclick", "control_relay('on')"); 
        button.html("Turn plug on");
        button.css('background-color', 'limegreen');
    }
});

//Listens for a msg sent from server with keyword 'updateVoltageOption'
//This is to update the display of the selected voltage 
socket.on('updateVoltageOption', function (voltage){
   var header = $('#mainsVoltageh1');   
   switch(voltage){            
        case 110:
            header.html("110 V");
            break;
        case 120:
            header.html("120 V");
            break;
        case 127:
            header.html("127 V");
            break;
        case 220:
            header.html("220 V");
            break;
        case 230:
            header.html("230 V");
            break;
        case 240:
            header.html("240 V");
            break;
        default:
            header.html("230 V");
            break;            
    }
});

//Listens for a msg sent from server with keyword 'calibration_response'
//This is to update the calibrate button message from "Calibrating..." to "Calibrate" after calibration is done 
socket.on('calibration_response', function() {
    var calibrateButton = $('#calibrate_button');    
    calibrateButton.html('Calibrate');
    
});

//Sends to the server the value of the new selected mains voltage
function changeOption(value){
    var Vrms = value;    
    switch(Vrms){
            
        case "voltage_110":
            socket.emit("voltageOption", 110);
            break;
        case "voltage_120":
            socket.emit("voltageOption", 120);
            break;
        case "voltage_127":
            socket.emit("voltageOption", 127);
            break;
        case "voltage_220":
            socket.emit("voltageOption", 220);
            break;
        case "voltage_230":
            socket.emit("voltageOption", 230);
            break;
        case "voltage_240":
            socket.emit("voltageOption", 240);
            break;
        default:
            socket.emit("voltageOption", 230);
            break;            
    }    
}

//Requests a calibration to the server
function calibrate_request(){
    var calibrateButton = $('#calibrate_button');    
    calibrateButton.html('Calibrating...');
    socket.emit('calibrate');    
}