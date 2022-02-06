<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; }
      #messages > li:nth-child(odd) { background: #efefef; }
    </style>
  </head>
<body>
    <div id="messages"></div>
    <form id="form" action="">
      <input id="input"/>
      <button type='submit' , id='send-button'>Send</button>
      <input id="ratingInput" placeholder="rating"/>
      <p id="ratingButton">submit</p>
    </form>

    <script src="/socket.io/socket.io.js"></script>
<script>
                var socket = io();

                var messages = document.getElementById('messages');
                var form = document.getElementById('form');
                var input = document.getElementById('input');
                var ratingInput = document.getElementById('ratingInput');


                console.log(document);
                const appendMessage = (message)=>{
                    const messageElement = document.createElement('div');
                    messageElement.innerText = message
                    messages.append(messageElement)
                };

                
                const name = prompt('what is your name');


                // new user added
                socket.emit('new-user',name);

                socket.emit('old-chat',name);

                //other message
                socket.on('get-old-chat',oldChat=>{
                    oldChat.forEach(oldChat=>{
                        appendMessage(`${oldChat.userName} : ${oldChat.message} `);
                    });
                    appendMessage('you joined');
                })

                //other message
                socket.on('chat-message',message=>{
                    appendMessage(`${message.name} : ${message.message} `);
                })

                // when user is connected
                socket.on('user-connected',name=>{
                    appendMessage(`${name} connected`);
                })

                // when user is disconnected
                socket.on('user-disconnected',name=>{
                    appendMessage(`${name} disconnected`);
                })

                
                if(form){
                    form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (input.value) {
                        appendMessage(`You ${input.value}`)
                        socket.emit('send-chat-message', input.value);
                        input.value = '';
                    }
                    });

                    document.getElementById("ratingButton").addEventListener('click', function(e) {
                       
                    e.preventDefault();
                    if (ratingInput.value) {
                        socket.emit('send-rating', ratingInput.value);
                        ratingInput.value = '';
                      }
                    });
                }          
</script>
  </body>
</html>
