import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { register as registerSwiperElements } from 'swiper/element/bundle';


registerSwiperElements();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
