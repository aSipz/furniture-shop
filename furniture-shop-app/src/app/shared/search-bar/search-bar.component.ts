import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { Subscription, debounceTime, distinctUntilChanged, tap, take } from 'rxjs';

import { productCategories, productSorting } from 'src/app/initial/constants';

const searchMap = {
  name(value: string) {
    return { '$regex': value, '$options': 'i' };
  },
  category(value: string) {
    return value;
  },
  price(value: string) {
    const min = Math.min(...value.split(', ').map(e => +e));
    const max = Math.max(...value.split(', ').map(e => +e));
    return { $gte: min, $lte: max };
  }
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {

  categories: string[] = productCategories;
  sorting: string[] = productSorting;

  searchForm = this.fb.group({
    name: [''],
    category: [''],
    priceGroup: this.fb.group({
      price1: [0],
      price2: [10000],
    }),
    order: ['name'],
  });

  query!: { [key: string]: any };

  subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      take(1)
    ).subscribe(query => {
      this.query = query;

      const search = query['search'] ? JSON.parse(query['search']) : {};

      const name = search['name']?.['$regex'] ?? '';
      const category = search['category'] ?? '';
      const price1 = search['price']?.['$gte'] ?? '0';
      const price2 = search['price']?.['$lte'] ?? '10000';
      const order = query['sort'] ?? 'name';
      const priceGroup = { price1, price2 };

      this.searchForm.setValue({ name, category, priceGroup, order });

    });
  }

  ngAfterViewInit() {
    const nameSub = this.searchForm.get('name')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToSearch(value ? value : '', 'name');
        })
      )
      .subscribe();

    const catSub = this.searchForm.get('category')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToSearch(value ? value : '', 'category');
        })
      )
      .subscribe();

    const priceSub = this.searchForm.get('priceGroup')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        const valArr = Object.values(value).map(v => v ? v.toString() : '0');
        this.addToSearch(valArr.some(v => !['0', '10000'].includes(v)) ? valArr.join(', ') : '', 'price');
      })
    ).subscribe()

    const orderSub = this.searchForm.get('order')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          this.addToOrder(value ? value : '');
        })
      )
      .subscribe();

    this.subs.push(nameSub!, catSub!, priceSub!, orderSub!);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
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

  private addToSearch(value: string, fieldName: keyof typeof searchMap) {
    if (value) {
      this.query = {
        ...this.query,
        search: JSON.stringify({
          ...JSON.parse(this.query['search'] ? this.query['search'] : '{}'),
          [fieldName]: searchMap[fieldName](value)
        }),
        skip: null,
        limit: null
      }
    } else {
      const { [fieldName]: _, skip, limit, ...newSearch } = JSON.parse(this.query['search'] ? this.query['search'] : '{}');
      this.query = {
        ...this.query,
        search: JSON.stringify(newSearch)
      }
    }
    this.changeQueryParams(this.query);
  }

  private addToOrder(value: string) {
    if (value && value !== 'Name') {
      this.query = {
        ...this.query,
        sort: value
      }
    } else {
      const { sort, ...newQuery } = this.query;
      this.query = newQuery;
    }
    this.changeQueryParams(this.query);
  }
}