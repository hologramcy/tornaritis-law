export type PracticeArea = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  locale: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  image_url: string;
  locale: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type NewsroomPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author_name: string;
  locale: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FormSubmission = {
  id: string;
  form_type: 'contact' | 'appointment';
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  locale: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  message: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

export type SiteContent = {
  id: string;
  content_key: string;
  locale: string;
  content_value: string;
  updated_at: string;
};

export type AdminUser = {
  user_id: string;
  display_name: string;
  role: 'admin' | 'editor';
  created_at: string;
};

export type Page = 'home' | 'about' | 'practice' | 'practice-detail' | 'newsroom' | 'news-detail' | 'team' | 'contact' | 'admin';

export type AppRoute = { page: Page; slug?: string };
