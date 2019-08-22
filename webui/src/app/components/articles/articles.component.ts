import { Component, OnInit, Input} from '@angular/core';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit {
  articleList: Article[];
  newArticleName: String;


  constructor(
    private articleService: ArticleService
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
}
