import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';

import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit {
  ARTICLE_URL: string = "/article";
  PREVIEW_URL: string = "/backend/browse/articles";
  
  articleList: Article[];
  newArticleName: String;


  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getArticles();
    this.newArticleName = "";
  }

  getArticles() {
    this.articleService.getArticles()
    .subscribe(articles => this.articleList = articles);
  }

  deleteArticle(article:Article) {
    this.articleService.deleteArticle(article).subscribe(resp => {console.log(resp); this.getArticles();});
  }

  createArticle() {
    let article = new Article();
    article.title = this.newArticleName.toString();
    this.articleService.createArticle(article).subscribe(resp => {console.log(resp); this.getArticles();});
  }

  editArticle(article:Article) {
    this.router.navigateByUrl(this.ARTICLE_URL + '/' + this.getArticlePath(article));
  }

  previewArticle(article:Article) {
    window.location.href = this.PREVIEW_URL + '/' + this.getArticlePath(article) + '/index.html';
  }

  getArticlePath(article:Article):string {
    return article.title + article.id;
  }
}
