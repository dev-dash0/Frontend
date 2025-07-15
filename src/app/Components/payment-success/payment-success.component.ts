import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../Core/Services/payment.service';
import { ProfileService } from '../../Core/Services/profile.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent {

  private readonly _PaymentService=inject(PaymentService);
  private readonly _profileService=inject(ProfileService);

  ngOnInit() {
 this._PaymentService.updateUserStateToPremium().subscribe({
      next: (res) => {
        console.log(res.message);
        this._profileService.notifyProfileUpdated();
        localStorage.setItem("isPremium", "true");
      },
      error: err => console.error("Failed to upgrade account", err)
    });
  }
  
}
