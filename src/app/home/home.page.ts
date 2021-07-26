import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // https://ionicframework.com/docs/angular/platform

  constructor(
    private afMessaging: AngularFireMessaging,
    public platform: Platform,
    private messagingService: MessagingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting

    if (this.platform.is('pwa')) {
      const toast = await this.toastCtrl.create({
        message: 'PWA!!',
        duration: 2000,
      });
      toast.present();
      this.setPwaPushNotifications();
    } else if (this.platform.is('android')) {
      const toast = await this.toastCtrl.create({
        message: 'Android...',
        duration: 2000,
      });
      toast.present();
      this.setAndroidPushNotifications();
    } else if (this.platform.is('mobileweb')) {
      const toast = await this.toastCtrl.create({
        message: 'Mobile web...',
        duration: 2000,
      });
      toast.present();
    }
  }

  setPwaPushNotifications() {
    this.requestPermission();
  }

  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        subHeader: msg.notification.body,
        message: msg.data.info,
        buttons: ['OK'],
      });

      await alert.present();
    });
  }

  requestPermission() {
    this.messagingService.requestPermission().subscribe(
      async (token) => {
        const toast = await this.toastCtrl.create({
          message: 'Got your token: ' + token,
          duration: 2000,
        });
        toast.present();
        this.listenForMessages();
      },
      async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async deleteToken() {
    this.messagingService.deleteToken();
    const toast = await this.toastCtrl.create({
      message: 'Token removed',
      duration: 2000,
    });
    toast.present();
  }

  setAndroidPushNotifications() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
      console.log(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
