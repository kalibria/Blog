export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    authorId: string;
    createdAt: string; 
    updatedAt: string;
  }

// API response types
export interface ArticlesListResponse {
    articles: Article[];
}
    
export interface ArticleDetailResponse {
    article: Article;
}