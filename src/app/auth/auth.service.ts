import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  signUp(email: string, password: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  signIn(email: string, password: string): Observable<any> {
    if (!email || !password) {
      return throwError('Email and password are required');
    }

    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  signOut(): Promise<void> {
    localStorage.removeItem('authToken');
    return this.afAuth.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  getAuthToken(): Observable<string> {
    return this.afAuth.idToken.pipe(
      switchMap((token) => {
        if (token) {
          localStorage.setItem('authToken', token);
          return [token];
        } else {
          return new Observable<string>((observer) => {
            observer.error('User is not authenticated');
          });
        }
      })
    );
  }

  getStoredAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map((user) => !!user));
  }
}
