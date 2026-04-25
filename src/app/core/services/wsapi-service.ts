import { Injectable } from '@angular/core';
import {Competing} from '../../pages/competing/competing';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WsapiService {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topicPrivate: string = "/user/topic/private-messages";
  topicSystemPrivate: string = "/user/topic/race-tracks";
  topicMembers: string = "/user/topic/members";
  topicError: string = "/user/queue/errors";
  stompClient: any;
  guestToken: string = "";
  id: string = "";
  isGlobal: boolean = false;

  objComponent!: Competing | Competing; // neg Particitape
  constructor(objComponent: Competing) {
    // if (objComponent != null && objComponent != undefined) {
    //   this.objComponent = objComponent;
    //   this.isGlobal =false;
    // }
    if (objComponent != null && objComponent != undefined) {
      this.objComponent = objComponent;
      this.isGlobal =true;
    }
  }

  _connect(langId: String) {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({"Authorization": `Bearer ${_this.getAccessUserToken()}`}, function (frame: any) {
      _this.guestToken = frame.headers['user-name'];
      _this.objComponent.setUserToken(_this.guestToken);

      _this.stompClient.subscribe(_this.topicPrivate, function (sdkEvent: any) {
        _this.onPrivateMessageReceived(sdkEvent);
      });

      _this.stompClient.subscribe(_this.topicSystemPrivate, function (sdkEvent: any) {
        _this.onPrivateSystemMessageReceived(sdkEvent);
      });
      _this.stompClient.subscribe(_this.topicMembers, function (sdkEvent: any) {
        _this.onPrivateMemberReceived(sdkEvent);
      });
      _this.stompClient.subscribe(_this.topicError, function (sdkEvent: any) {
        _this.onPrivateErrorReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;

      const body = {
        lang: langId,
        category: "COMPETITION"
      }

      if(_this.isGlobal == false) {
        _this.stompClient.send("/app/race-track"+((_this.id=="")? '' :'/'+_this.id),
          {"Authorization": `Bearer ${_this.getAccessUserToken()}`},
          JSON.stringify(body));
      } else {
        _this.stompClient.send("/app/competition-track"+((_this.id=="")? '' :'/'+_this.id),
          {"Authorization": `Bearer ${_this.getAccessUserToken()}`},
          JSON.stringify(body));
      }

    }, this.errorCallBack);
  }

  getAccessUserToken(): string {
    if(localStorage.getItem('accessToken') != undefined ) {
      // got real user

      // then we need check if it is Guest
      if(this.guestToken != "") {
        // this is not accessed before the real user is login.
        // if it as accessed for Guest we need remove from room.
        // then we can add to room with real user.

        this.guestToken = "";
      }
      const token: any = JSON.parse(localStorage.getItem('accessToken')!) || [];
      return ""+token['token'];
      //return  "";
    } else {
      return this.guestToken;
    }
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: string) {
    console.log("errorCallBack -> " + error);
  }
  _send(path: string,message: string) {
    this.stompClient.send(
      path, //"/app/message",
      {"Authorization":`Bearer ${this.getAccessUserToken()}`},
      JSON.stringify(message)
    );
  }

  _sendPrivate(path: string,message: string) {
    this.stompClient.send(
      path, //"/app/private-message",
      {"Authorization":`Bearer ${this.getAccessUserToken()}`},
      //{Authorization: this.objComponent.yourToken},
      JSON.stringify(message)
    );
  }

  _sendProcess(path: string,data: any) {
    this.stompClient.send(
      path, //"/app/private-message",
      {"Authorization":`Bearer ${this.getAccessUserToken()}`},
      //{Authorization: this.objComponent.yourToken},
      JSON.stringify(data)
    );
  }
  _sendSystemPrivate(message: string) {
    this.stompClient.send("/app/race-track"+(this.objComponent.roomId='')? '' :'/'+this.objComponent.roomId, {"Authorization":`Bearer ${localStorage.getItem('accessToken')}`}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    // console.log("Message Recieved from Server :: " + message);
    // console.log(message.body);
    //this.objComponent.handleMessage(JSON.stringify(message.body));
  }

  onPrivateMessageReceived(message: any) {
    console.log("Message text Recieved from Server :: " + message);
    console.log(message.body);
    this.objComponent.handlePrivateMessage(JSON.parse(message.body));
  }

  onPrivateSystemMessageReceived(message: any) {
    // console.log("private message Recieved from Server :: " + message);
    // console.log(message.body);
    this.objComponent.handlePrivateMessage(JSON.parse(message.body));
  }

  onPrivateMemberReceived(message: any) {
    console.log("members Recieved from Server :: " + message);
    console.log(message.body);
    this.objComponent.handlePrivateMember(JSON.parse(message.body));
  }
  onPrivateErrorReceived(message: any) {
    // console.log("members Recieved from Server :: " + message);
    // console.log(message.body);
    this.objComponent.handlePrivateError(JSON.parse(message.body));
  }

  getMember():string {
    return this.guestToken;
  }
}
