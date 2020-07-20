import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';

const { SplashScreen, StatusBar } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isMobile: boolean;
  isDark: boolean;

  constructor(
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.isMobile = this.platform.is('mobile');
      console.log('isMobile', this.isMobile);

      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('isDark', this.isDark);

      if (this.isMobile) {
        if (this.isDark) {
          await StatusBar.setStyle({ style: StatusBarStyle.Dark });
        } else {
          await StatusBar.setStyle({ style: StatusBarStyle.Light });
        }
        await StatusBar.show();
      }
      await SplashScreen.hide();

    });
  }


}
