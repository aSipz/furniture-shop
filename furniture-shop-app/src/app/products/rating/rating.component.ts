import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRating } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  @Input() rating: IRating[] | string[] | undefined;

  @Output() rateEvent = new EventEmitter<number>();

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get getUserRating(): number | null {
    if (this.rating) {
      const ratings = this.rating as IRating[];
      return ratings.find(r => r.ownerId === this.userService.user?._id)
        ? ratings.find(r => r.ownerId === this.userService.user?._id)?.rating as number
        : null;
    }
    return null;
  }

  constructor(private userService: UserService) { }

  rateHandler(rating: number) {
    this.rateEvent.emit(rating);
  }

}
