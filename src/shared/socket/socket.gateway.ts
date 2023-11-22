import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, {
  cors: '*',
  namespace: 'socket.io',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // This is called when a client connects to the WebSocket server
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // This is called when a client disconnects from the WebSocket server
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatMessage')
  handleMessage(client: Socket, payload: any) {
    // Handle the 'chatMessage' event sent by the client
    this.server.emit('chatMessage', payload); // Broadcast the message to all connected clients
  }
}
