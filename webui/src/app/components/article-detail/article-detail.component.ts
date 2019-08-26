import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import { Article } from 'src/app/models/article';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.sass']
})
export class ArticleDetailComponent implements OnInit {
  PREVIEW_URL: string = "/backend/browse/articles";
  
  article: Article;
  previewUrl: SafeResourceUrl;

  markdownFile: File = null;
  uploadFiles: File[] = [];

  constructor(
    public sanitizer:DomSanitizer,
    private route: ActivatedRoute,
    private location: Location,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    const path = this.route.snapshot.paramMap.get('path');
    this.articleService.getArticle(path).subscribe(article => this.getArticleServiceSubscriber(article));
  }

  getArticleServiceSubscriber(article: Article) {
    this.article = article;
    this.reloadIframe(article);
  }

  reloadIframe(article: Article) {
    let url = this.PREVIEW_URL + '/' + article.title + article.id + '/index.html';
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);  
  }

  handleMarkdownFileInput(files: FileList) {
    const file = files[0]
    if (file !== undefined && file !== null){
      this.markdownFile = file;
    }
    else {
      alert("file is empty!");
    }
  }
  
  
  handleFileInput(files: FileList, index: number) {
    const file = files[0]
    if (file !== undefined && file !== null){
      this.uploadFiles[index] = file;
    }
    console.log(this.uploadFiles);
  }

  uploadMarkdownFile() {
    this.articleService.uploadMarkdownFile(this.article, this.markdownFile).subscribe(resp => {console.log(resp);this.reloadIframe(this.article)});
  }

  addFile() {
    this.uploadFiles.push(null);
  }
}
