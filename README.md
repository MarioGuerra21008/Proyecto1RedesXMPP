# XMPP Client for Alumchat.lol

Universidad del Valle de Guatemala

Mario Antonio Guerra Morales - 21008

# Dependencies

For this project you have to install these dependencies and modules:

* Node.js
* NPM
* express
* @xmpp/client
* body-parser
* ws (WebSocket)

# Run the project

First, you must have Node.js installed in your computer or VM. Then, run the command "**npm start**" to install node_modules.

After you do this, run in your CMD the following commands:

- npm install express
- npm install body-parser
- npm install ws
- npm install @xmpp/client

Finally, if everything is working, you will be able to run "**node server.js**" to start your XMPP client. For this, go to localhost:3000 in your browser.

# The XMPP Client itself and its features

## Login And Register

The first page that you'll see is for registration and/or log into your account.

![image](https://github.com/user-attachments/assets/f4268ae5-1ff9-47ee-9b61-4eccb950ba05)

For registration, click in the "Registrarse" button. There, you must create a new username and a password. After that, do this same process again but for log in.

![image](https://github.com/user-attachments/assets/50adcc98-5fb1-413d-90f4-965d69d407fb)

![image](https://github.com/user-attachments/assets/ccb6ad21-d98f-44b8-8ff3-75d02c443653)

![image](https://github.com/user-attachments/assets/af2780bf-1aa6-4a00-bcdb-276d711f1dcb)

![image](https://github.com/user-attachments/assets/6ef8bc2f-3730-4771-b481-8322a5e0aa14)

![image](https://github.com/user-attachments/assets/1bd900f8-4235-484e-a48c-66ea91759549)

## Add Contacts And Ask For Their Details

Once you log in succesfully, you'll see the main functions of your client. Before start sending messages to your friends, maybe you should add them as your contacts.

Let's add "gue21008test1" in our contacts. To do this, press the "Añadir contacto" button and type the username of the contact you're looking for.

![image](https://github.com/user-attachments/assets/78460235-811b-42dd-9994-5944275d93c1)

![image](https://github.com/user-attachments/assets/c474d229-752d-4a5a-9f93-5d84031c3a22)

Then, if your friend sees the notification and sends you a friend request, go to "Aceptar solicitud de amistad", write your friend's username to accept it too.

![image](https://github.com/user-attachments/assets/47bdb656-bad5-44a7-8943-45c5162f2991)

When your friend already added you to their contacts too, press "Mostrar detalles de un contacto" and write your friend's username to see their details.

![image](https://github.com/user-attachments/assets/8ebf814b-8122-4fe2-9ebb-1ef5c0930dbb)

![image](https://github.com/user-attachments/assets/b23b0073-684a-40ea-861a-b67e0a5bbf04)

And if you want to see all of your contacts roster, just press "Mostrar contactos" to see all of them.

![image](https://github.com/user-attachments/assets/4355b0d7-6219-405e-ad4f-9c89fd1c84b3)

## Send And Receive Messages

To send a message, just write a username to be the recipient, and the body of your message.

![image](https://github.com/user-attachments/assets/1cf51b2d-2351-415f-9285-1aa506e4562a)

![image](https://github.com/user-attachments/assets/6545a72f-e1e6-4b3b-972b-a8d7d7832013)

![image](https://github.com/user-attachments/assets/5a66844c-dd7d-4050-a17f-f67bea8dfb7d)

After that, your message will be received by your friend, and when they reply to you, a notification will be shown in your client's right side.

![image](https://github.com/user-attachments/assets/fa409e8f-e909-4f13-b37c-0f0a87482bb7)

(This is gue21008test1's point of view)

![image](https://github.com/user-attachments/assets/bc3ae262-f875-4387-8ac8-3727a92d82da)

## Edit Your Status And See It

You can edit your status and give yourself a presence message. For example, if you are working hard in your project, press "Establecer estado de presencia" and
choose between "online", "away", "dnd" or "offline" to change your status and an optional presence message. In this case, we'll just write "Working..."

![image](https://github.com/user-attachments/assets/e33ae6fa-4636-4fa8-9d57-f0c6ede094aa)

![image](https://github.com/user-attachments/assets/e4c7b9e9-d6ed-4bc7-8e4d-1da7a133d58b)

And to see your status, press "Ver estado actual" and you'll see your new status.

![image](https://github.com/user-attachments/assets/7b630178-5777-4af5-b843-b36650a4e93c)

## Interact In Group Chats

Press "Chats Grupales" to go to another page where you are able to create group chats, join them, and send/receive messages from them.

![image](https://github.com/user-attachments/assets/16d116bc-6ee1-46fc-bcee-6996fb2a57c8)

To create a group chat, press "Crear sala de chat grupal", then write the name of the group and that's it, your group chat has been created.

![image](https://github.com/user-attachments/assets/5549ef9d-1180-4a7a-8152-b5f7cd94be76)

![image](https://github.com/user-attachments/assets/13e80aed-1ba3-4282-8402-41eff05d4c02)

Then, send a message in your group chat. The procedure is quite the same for sending private messages. Write the name of the group chat and the body of your message.

![image](https://github.com/user-attachments/assets/e7f6cc6c-2fc3-4cf8-aa51-6d0283c62025)

![image](https://github.com/user-attachments/assets/68f5c77d-97ca-49ef-a875-50d15e0ac9c9)

![image](https://github.com/user-attachments/assets/92e6f9fa-987a-46b1-9f00-77747d2c9311)

And if you want to join a group chat, write the name of the group you want to join and if you have the permissions to do it, that will be it.

(Group created by gue21008test1)

![image](https://github.com/user-attachments/assets/6a195e04-724e-4ddb-900e-a83e32dec469)

![image](https://github.com/user-attachments/assets/e00a0500-b27a-44f3-a169-690040aca5ee)

![image](https://github.com/user-attachments/assets/4a1962dd-c872-45ab-8995-fa926c7ae719)

![image](https://github.com/user-attachments/assets/9d3195fd-b642-423e-87e4-4b2e7e5caa4f)

## Log Out And Delete Account

To log out, just press "Cerrar sesión" in the main page. When you do this, automatically it will return to the login page.

![image](https://github.com/user-attachments/assets/6176fb06-5285-4151-91e5-348e7c6255e1)

And finally, to delete your account, go to "Eliminar cuenta". When you click on that button, it will show in your computer a message for confirmation that warns you about deleting everything about your account.
Just press "Aceptar" and then your account will be deleted from the server.

![image](https://github.com/user-attachments/assets/a11a6fa0-74ba-4a7e-a0f1-a307d074424a)

And if you try to log in again, it won't let you do it.

![image](https://github.com/user-attachments/assets/7ce69dc0-8a0b-422c-af9e-1931dde6e8c6)

![image](https://github.com/user-attachments/assets/dc1d0928-33d2-402f-afe5-e0480019a93e)

![image](https://github.com/user-attachments/assets/c6316157-6ec9-42c2-b273-5fdc151a4471)

## The End

After you read all of this, you are prepared to use this XMPP Client, thank you so much for downloading and using this project! :D
