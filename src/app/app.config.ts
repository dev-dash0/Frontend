import { MatDialogModule } from '@angular/material/dialog';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
} from '@angular/platform-browser';
import {
  provideAnimations,
} from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { tokenExpiryInterceptor } from './Core/Interceptors/token-expiry.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(
      MatDialogModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatIconModule,
      MatInputModule,
      MatFormFieldModule,
      MatSelectModule,
      MatChipsModule
    ),

    provideAnimations(), // required animations providers
    provideToastr(),
    // provideHttpClient(withInterceptors([TokenExpiryInterceptor])),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        tokenExpiryInterceptor,
        // headersInterceptor,
        // catchErrorInterceptor,
        // loadingInterceptor,
      ])
    ),
  ],
};
