export interface IBlog {
  id: number;
  category_id: number; // <-- Add this
  title: string;
  blog_image: string;
  author_name: string;
  author_image: string;
  description: string;
  created_at: string;
  updated_at: string;
}
