import { MatDialogModule } from '@angular/material/dialog';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
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
      MatChipsModule,),
  ],
};
