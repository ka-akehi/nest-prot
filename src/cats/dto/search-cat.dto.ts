// 安全版／高度検索に渡されるクエリ文字列をまとめた DTO。
export class SearchCatQueryDto {
  keyword?: string;
  minAge?: number;
  maxAge?: number;
  sortBy?: 'id' | 'name' | 'age' | 'breed';
  order?: 1 | 0;
}
