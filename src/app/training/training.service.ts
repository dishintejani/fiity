import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from './exercise.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availableExercise : Exercise[] = [];
    private runningExercise: Exercise;
    private exercisesCollection: AngularFirestoreCollection<Exercise>;
    private fbSubs : Subscription[] = [];

    
    constructor(private router: Router, private db: AngularFirestore) { }

    fetchAvailableExercises() {
        this.exercisesCollection = this.db.collection<Exercise>('availableExercises');
        this.fbSubs.push(
        this.exercisesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Exercise;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        ).subscribe((exercise: Exercise[]) => {
            this.availableExercise = exercise;
            this.exercisesChanged.next([...this.availableExercise])
        }));
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercise.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    competeExercise() {
        this.addDataToDatabase({ 
            ...this.runningExercise, 
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
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

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db.collection<Exercise>('finishedExercises').valueChanges()
        .subscribe((exercise: Exercise[]) => {
            this.finishedExercisesChanged.next([...exercise])
        }));
    }

    addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => {
            sub.unsubscribe();
        })
    }
    
}