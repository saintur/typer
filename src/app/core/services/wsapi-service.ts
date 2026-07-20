import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {environment} from '../../../environments/environment';
import {Competing} from '../../pages/competing/competing';
import {Stomp} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WsapiService {
  webSocketEndPoint = environment.socket_url + 'ws';

  topicPrivate = '/user/topic/private-messages';
  topicSystemPrivate = '/user/topic/race-tracks';
  topicMembers = '/user/topic/members';
  topicError = '/user/queue/errors';

  stompClient: any;
  guestToken = '';
  id = '';
  isGlobal = false;

  objComponent?: Competing;

  registerComponent(component: Competing): void {
    this.objComponent = component;
  }

  unregisterComponent(): void {
    this.objComponent = undefined;
  }

  _connect(langId: string, isGlobal = true): void {
    if (!this.objComponent) {
      console.error('Component is not registered.');
      return;
    }

    this.isGlobal = isGlobal;

    console.log('Initialize WebSocket Connection');

    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect(
      {
        Authorization: `Bearer ${this.getAccessUserToken()}`,
      },
      (frame: any) => {
        this.guestToken = frame.headers['user-name'];
        this.objComponent?.setUserToken(this.guestToken);

        this.stompClient.subscribe(this.topicPrivate, (sdkEvent: any) => {
          this.onPrivateMessageReceived(sdkEvent);
        });

        this.stompClient.subscribe(this.topicSystemPrivate, (sdkEvent: any) => {
          this.onPrivateSystemMessageReceived(sdkEvent);
        });

        this.stompClient.subscribe(this.topicMembers, (sdkEvent: any) => {
          console.log(sdkEvent);
          this.onPrivateMemberReceived(sdkEvent);
        });

        this.stompClient.subscribe(this.topicError, (sdkEvent: any) => {
          this.onPrivateErrorReceived(sdkEvent);
        });

        const body = {
          lang: langId,
          category: 'COMPETITION',
        };

        const destination = this.getTrackDestination();
        this._send(destination, body);
      },
      this.errorCallBack,
    );
  }

  private getTrackDestination(): string {
    const basePath = this.isGlobal
      ? '/app/competition-track'
      : '/app/race-track';

    return basePath + (this.id === '' ? '' : '/' + this.id);
  }

  getAccessUserToken(): string {
    const accessTokenRaw = localStorage.getItem('accessToken');

    if (accessTokenRaw) {
      if (this.guestToken !== '') {
        this.guestToken = '';
      }

      try {
        const token = JSON.parse(accessTokenRaw);
        return String(token?.token || '');
      } catch {
        return '';
      }
    }

    return this.guestToken;
  }

  _disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  errorCallBack(error: string): void {
    console.log('errorCallBack -> ' + error);
  }

  _send(path: string, message: any): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('STOMP is not connected.');
      return;
    }
    console.log('sendPrivate -> ' + path);
    console.log('sendPrivate -> ' + message);

    this.stompClient.send(
      path,
      {
        Authorization: `Bearer ${this.getAccessUserToken()}`,
      },
      JSON.stringify(message),
    );
  }

  _sendPrivate(path: string, message: any): void {
    this._send(path, message);
  }

  _sendProcess(path: string, data: any): void {
    this._send(path, data);
  }

  _sendSystemPrivate(message: any): void {
    const roomId = this.objComponent?.roomId || '';

    const destination =
      '/app/race-track' + (roomId === '' ? '' : '/' + roomId);

    this._send(destination, message);
  }

  onPrivateMessageReceived(message: any): void {
    this.objComponent?.handlePrivateMessage(JSON.parse(message.body));
  }

  onPrivateSystemMessageReceived(message: any): void {
    this.objComponent?.handlePrivateMessage(JSON.parse(message.body));
  }

  onPrivateMemberReceived(message: any): void {
    this.objComponent?.handlePrivateMember(JSON.parse(message.body));
  }

  onPrivateErrorReceived(message: any): void {
    this.objComponent?.handlePrivateError(JSON.parse(message.body));
  }
}
