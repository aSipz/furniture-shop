import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { IRating } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnChanges {

  @Input() rating: IRating[] | string[] | undefined;

  @Output() rateEvent = new EventEmitter<number>();

  userRating: number | null = null;

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes['rating'];

    if (currentItem.currentValue) {
      this.rating = currentItem.currentValue;
    }

    if (this.rating) {
      const ratings = this.rating as IRating[];

      this.userRating = ratings.find(r => r.ownerId === this.userService.user?._id)?.rating ?? null;
    }
  }

  rateHandler(rating: number) {
    this.rateEvent.emit(rating);
  }

}
