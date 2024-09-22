import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse, User } from '../types/response.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    // Check if the user is already logged in by checking the cookie or local storage
    const userId = this.getCookie('userId');
    const email = this.getCookie('email');
    if (userId && email) {
      this.loggedIn.next(true);
    }
  }

  private loggedIn = new BehaviorSubject<boolean>(false);
  private endpoint = environment.apiUrl;
  private user: User | null = null;

  setUser(user: User) {
    this.user = user;
    // Set user information in cookies if they do not already exist
    this.setCookieIfNotExists('userId', user.userId.toString());
    this.setCookieIfNotExists('email', user.email);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setLoggedIn() {    
    this.loggedIn.next(true);
  }

  setLoggedOut() {
    this.loggedIn.next(false);
    this.clearCookies(); // Clear cookies on logout
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.endpoint}/auth/login/`;
    const body = { email, password };

    return this.http.post<ApiResponse<'user', User>>(url, body).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return of(false); // Handle error and emit false
      })
    );
  }

  logout() {
    this.loggedIn.next(false);
    this.clearCookies(); // Clear cookies on logout
  }

  // Utility functions to manage cookies
  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`)
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  private setCookieIfNotExists(name: string, value: string, days = 7) {
    if (!this.getCookie(name)) {
      this.setCookie(name, value, days);
    }
  }

  private setCookie(name: string, value: string, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
  }

  private clearCookies() {
    this.deleteCookie('userId');
    this.deleteCookie('email');
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
  }
}
