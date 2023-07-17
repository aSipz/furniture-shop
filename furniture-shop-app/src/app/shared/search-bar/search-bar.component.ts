import { Component } from '@angular/core';
import { productCategories } from '../constants';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  categories: string[] = productCategories;
  
}
