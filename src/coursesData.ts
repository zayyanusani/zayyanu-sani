import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'web-dev-101',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
    youtubeUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', // Example: HTML Full Course
    thumbnail: 'https://picsum.photos/seed/webdev/400/225'
  },
  {
    id: 'comm-expert',
    title: 'Communication for Experts',
    description: 'Master the art of professional communication in the digital age.',
    youtubeUrl: 'https://www.youtube.com/watch?v=HAnw168huqA', // Example: Communication Skills
    thumbnail: 'https://picsum.photos/seed/comm/400/225'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Academy',
    description: 'Grow your brand and reach your audience with modern marketing strategies.',
    youtubeUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Example: Digital Marketing
    thumbnail: 'https://picsum.photos/seed/marketing/400/225'
  }
];
