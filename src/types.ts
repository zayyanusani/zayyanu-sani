export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  selectedCourseId?: string;
  enrolledAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
}
