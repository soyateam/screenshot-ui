import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  onGoingRequests: number = 0;
  isLoading: boolean = false;
  stateChange: Subject<boolean> = new Subject();

  addRequest() {
    this.onGoingRequests++;
    this.isLoading = true;
    this.notifyStateChange();
  }

  removeRequest() {
    if (this.onGoingRequests > 0) this.onGoingRequests--;

    if (this.onGoingRequests === 0) {
      this.isLoading = false;
      this.notifyStateChange();
    }
  }

  notifyStateChange() {
    this.stateChange.next(this.isLoading);
  }
}
