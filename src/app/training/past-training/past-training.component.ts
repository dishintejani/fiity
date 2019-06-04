import { TrainingService } from './../training.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  private exerciseChanged: Subscription;
  displayedColumns = ['date', 'name', 'calories','duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>()


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.exerciseChanged = this.trainingService.finishedExercisesChanged
      .subscribe((exercise: Exercise[]) => {
        this.dataSource.data = exercise;
        console.log(this.dataSource.data)
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.exerciseChanged.unsubscribe();
  }

}
