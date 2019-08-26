import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private getArticlesUrl = '/backend/articles';

  private deleteArticleUrl = '/backend/article';
  private createArticleUrl = '/backend/article';
  private getArticleUrl = '/backend/article';

  constructor(
    private http: HttpClient
  ) { }

  getArticles (): Observable<Article[]> {
    return this.http.get<Article[]>(this.getArticlesUrl)
      .pipe(
        catchError(this.handleError<Article[]>('getArticles', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  deleteArticle(article:Article) :Observable<string> {
    let articleFolderPath:string = article.title + article.id;
    return this.http.delete<string>(this.deleteArticleUrl + '/' + articleFolderPath);
  }

  createArticle(article:Article):Observable<string>  {
    return this.http.put<string>(this.createArticleUrl, article, this.httpOptions);
  }

  getArticle(path:String):Observable<Article> {
    return this.http.get<Article>(this.getArticleUrl + '/' + path, this.httpOptions);
  }

  uploadMarkdownFile(article:Article, file:File) : Observable<string> {
    const url = '/backend/file/' + article.title + article.id + '/markdown';
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(url, formData);//do not add Content-Type: multipart/form-data
  }

}
