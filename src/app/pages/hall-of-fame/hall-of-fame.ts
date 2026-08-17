import { Component, computed, OnInit, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from '../../core/services/api-service';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';

interface HallOfFameRow {
  username: string;
  wpm: number;
  accuracy: number;
  takenCount: number;
  [key: string]: string | number;
}

@Component({
  selector: 'app-hall-of-fame',
  imports: [
    ReactiveFormsModule,
    Select,
    Button,
  ],
  templateUrl: './hall-of-fame.html',
  styleUrl: './hall-of-fame.scss',
})
export class HallOfFame implements OnInit {
  searchTypeData = [
    { label: 'Ерөнхий', value: '' },
    { label: 'Хамгийн хурдан', value: 'FAST' },
    { label: 'Хамгийн идэвхтэй', value: 'BUSY' }
  ];

  langData = [
    // { label: 'Ерөнхий', value: '' },
    { label: 'Монгол', value: 'MONGOLIA' },
    { label: 'Англи', value: 'ENGLISH' }
  ];

  agesData = [
    { label: 'Ерөнхий', value: '' },
    { label: 'Эрэгтэй', value: 'M' },
    { label: 'Эмэгтэй', value: 'F' },
    { label: 'Нас (1–19)', value: '01' },
    { label: 'Нас (20–39)', value: '20' },
    { label: 'Нас (40–69)', value: '40' },
    { label: 'Нас (69+)', value: '70' }
  ];

  searchForm: FormGroup = new FormGroup({
    searchType: new FormControl(''),
    langType: new FormControl('MONGOLIA'),
    ages: new FormControl(''),
  });

  columnDefs = [
    { header: 'Нэр', dataIndex: 'username' },
    { header: 'Хурд (МБҮ)', dataIndex: 'wpm' },
    { header: 'Нарийвчлал', dataIndex: 'accuracy' },
    { header: 'Оролдлого', dataIndex: 'takenCount' },
  ];

  rowData = signal<HallOfFameRow[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  rows = 10;

  pagedData = computed(() => {
    const start = (this.currentPage() - 1) * this.rows;
    return this.rowData().slice(start, start + this.rows);
  });

  totalPages = computed(() => Math.ceil(this.rowData().length / this.rows));

  constructor(private readonly apiService: ApiService) {
  }

  ngOnInit(): void {
    this.onChange();
    this.searchForm.valueChanges.subscribe(() => this.onChange());
  }

  onChange() {
    const { searchType, langType, ages } = this.searchForm.value;
    // The "ages" control holds either a gender code (M/F) or an age-bracket
    // code (01/20/40/70); the backend expects those as two separate fields.
    const isGender = ages === 'M' || ages === 'F';

    const body = {
      searchType,
      langType,
      genderType: isGender ? ages : '',
      ageType: !isGender ? ages : '',
    };

    this.loading.set(true);
    this.apiService.getHallOfFameList(body).subscribe({
      next: data => {
        this.rowData.set(((data as HallOfFameRow[]) ?? []).map(row => ({
          ...row,
          wpm: Math.round(row.wpm ?? 0),
          accuracy: Math.round(row.accuracy ?? 0),
        })));
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load hall of fame list:', err);
        this.loading.set(false);
      },
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
