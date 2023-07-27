import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { faAngleRight, faAnglesRight, faAngleLeft, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import { filter, BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {

  angleRight = faAngleRight;
  angleLeft = faAngleLeft;
  anglesRight = faAnglesRight;
  anglesLeft = faAnglesLeft;

  currentPage = 1;
  query!: { [key: string]: any };

  @Input() totalPages!: number;
  @Input() pageSize!: number;

  private totalPages$$ = new BehaviorSubject<undefined | number>(undefined);
  private totalPages$ = this.totalPages$$.asObservable();

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sub = combineLatest([
      this.route.queryParams,
      this.totalPages$
    ]).pipe(
      filter((val) => val[1] !== undefined)
    ).subscribe(val => {
      this.query = val[0];

      const skip = +val[0]['skip'];
      const limit = +val[0]['limit'];

      if (limit !== this.pageSize || skip >= limit * this.totalPages || skip % limit !== 0) {

        this.changePageUrl();
        this.currentPage = 1;
      } else {
        this.currentPage = skip / this.pageSize + 1;

      }

    })

  }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes['totalPages'];

    if (currentItem.currentValue) {
      this.totalPages = currentItem.currentValue;
      this.totalPages$$.next(currentItem.currentValue);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  changePage(nextPage: number) {
    this.currentPage = nextPage;
    if (nextPage == 1) {
      return this.changePageUrl();
    }
    this.changePageUrl(nextPage);
  }

  private changePageUrl(page?: number) {

    this.query = {
      ...this.query,
      limit: page ? this.pageSize : null,
      skip: page ? (page - 1) * this.pageSize : null
    }

    this.changeQueryParams(this.query);
  }

  private changeQueryParams(queryParams: Params) {

    for (const key in queryParams) {
      if (queryParams[key] === '{}') {
        queryParams[key] = null;
      }
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

}
