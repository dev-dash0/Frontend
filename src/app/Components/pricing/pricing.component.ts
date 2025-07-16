import { Component, inject } from '@angular/core';
import { PaymentService } from '../../Core/Services/payment.service';
import { ProfileService } from '../../Core/Services/profile.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  private readonly _ProfileService=inject(ProfileService);
  statePricing: 'normal' | 'premium' = 'normal';
  constructor(private _PaymentService: PaymentService
  ) {}

  ngOnInit() {
    this.getProfileType();
  }

  getProfileType() {
    this._ProfileService.getProfileData().subscribe({
      next: (res) => {
        this.statePricing = res.statepricing;
        console.log('statePricing', this.statePricing);
      },
      error: (err) => {
        console.error('Error fetching profile type:', err);
      }
    });
  }

  goToCheckout() {
   this._PaymentService.createCheckoutSession().subscribe({
        next: (res) => window.location.href = res.url,
        error: (err) => console.error('Payment error:', err),
      });
  }
  

}
