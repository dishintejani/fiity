import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
    @Output() sidenavClose = new EventEmitter<void>();
    isAuth = false;
    authSubscription: Subscription;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authSubscription = this.authService.authChange.subscribe(authStatus => {
            this.isAuth = authStatus;
        });
    }

    onCloseSidenav() {
        this.sidenavClose.emit();
    }

    onLogout() {
        this.authService.logout();
        this.onCloseSidenav();
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

}
