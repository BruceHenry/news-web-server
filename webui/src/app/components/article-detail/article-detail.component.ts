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
  otherFiles: File[] = [];

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
      let fileNameArray = file.name.split('.');
      const extension = fileNameArray[fileNameArray.length - 1];
      if (extension === 'md') {
        this.markdownFile = file;
      }
      else {
        alert("Must be a .md file");
      }
    }
  }
  
  
  handleFileInput(files: FileList) {
    console.log(files)
    const file = files[0]
    if (file !== undefined && file !== null){
      this.otherFiles.push(file);
    }
  }

  removeFile(i: number) {
    this.otherFiles.splice(i, 1);
  }

  uploadMarkdownFile() {
    this.articleService.uploadMarkdownFile(this.article, this.markdownFile)
    .subscribe(resp => {console.log(resp);this.reloadIframe(this.article);this.markdownFile=null;});
  }

  removeAllFiles() {
    this.otherFiles = [];
  }

  uploadFiles() {
    this.articleService.uploadFiles(this.article, this.otherFiles)
    .subscribe(resp => {console.log(resp);this.reloadIframe(this.article);this.otherFiles=[];})
  }
}
