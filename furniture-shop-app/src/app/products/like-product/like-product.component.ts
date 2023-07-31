import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFavorite } from 'src/app/initial/interfaces';

@Component({
  selector: 'app-like-product',
  templateUrl: './like-product.component.html',
  styleUrls: ['./like-product.component.css']
})
export class LikeProductComponent {

  @Input() favorite!: IFavorite | null;

  @Output() favoriteEvent = new EventEmitter<boolean>();

  get isFavorite() {
    return !!this.favorite;
  }

  favoriteHandler(like: boolean) {
    this.favoriteEvent.emit(like);
  }
}
