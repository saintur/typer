import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from '../../core/services/api-service';

@Component({
  selector: 'app-hall-of-fame',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './hall-of-fame.html',
  styleUrl: './hall-of-fame.scss',
})
export class HallOfFame {
  searchTypeData = [
    { label: 'Overall', value: '' },
    { label: 'Fastest', value: 'FAST' },
    { label: 'Busiest', value: 'BUSY' }
  ];

  langData = [
    { label: 'Overall', value: '' },
    { label: 'Mongolia', value: 'MONGOLIA' },
    { label: 'English', value: 'ENGLISH' }
  ];

  agesData = [
    { label: 'Overall', value: '' },
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Age (1–19)', value: '01' },
    { label: 'Age (20–39)', value: '20' },
    { label: 'Age (40–69)', value: '40' },
    { label: 'Age (69+)', value: '70' }
  ];

  searchForm: FormGroup = new FormGroup({
    searchType: new FormControl(''),
    langType: new FormControl(''),
    ages: new FormControl(''),
  });

  columnDefs = [
    { header: 'Name', dataIndex: 'name' },
    { header: 'Speed', dataIndex: 'speed' },
    { header: 'Accuracy', dataIndex: 'accuracy' },
    { header: 'Country', dataIndex: 'country' },
  ];

  rowData: any[] = [];

  constructor(private readonly apiService:ApiService ) {
  }

  onChange() {
    this.apiService.getHallOfFameList(this.searchForm.value).subscribe({
      next: data => {
      }
    })
  }

  currentPage = 1;
  rows = 10;

  get pagedData() {
    const start = (this.currentPage - 1) * this.rows;
    return this.rowData.slice(start, start + this.rows);
  }

  get totalPages() {
    return Math.ceil(this.rowData.length / this.rows);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
