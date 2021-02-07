function logear(){
    sendDataUser($('#login #correo').val(), $('#login #usuario').val());
}

function send(){
    if($('#target').val().length > 0 ){
        sendMessagePrivate($('#message').val(), $('#usuario').val(), $('#target').val());
    }else{
        sendMessage($('#message').val(), $('#usuario').val());
    }
    
}

function getMessage(user, message){
    $('#cont_message').append('<p><strong>'+user+': </strong>'+message+'</p>');
}

function sendPrivate(){
    sendMessagePrivate($('#message').val(), $('#usuario').val(), '7uhRoxAQGKP2eN8GAAAD');
}