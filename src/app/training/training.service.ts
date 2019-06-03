import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    private availableExercise : Exercise[] = [
        { id:'crunches', name:'Crunches', duration: 5, calories: 7 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 10, calories: 9 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 20, calories: 8 },
        { id: 'burpees', name: 'Burpees', duration: 59, calories: 3},
        { id: 'crunches-2', name: 'Crunches-2', duration: 35, calories: 3 },
    ];

    private runningExercise: Exercise;

    private exercises : Exercise[] = [];

    
    constructor(private router: Router) { }

    getAvailableExercises() {
        return this.availableExercise.slice();
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercise.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    competeExercise() {
        this.exercises.push({ 
            ...this.runningExercise, 
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise,
            date: new Date(),
            duration: this.runningExercise.duration * (progress / 100) ,
            calories: this.runningExercise.calories * (progress / 100) ,
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    getCompletedOrCancelledExercises() {
        return this.exercises.slice() ;
    }
    
}