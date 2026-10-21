import { redirect } from 'next/navigation'

// L'ancien éditeur « Cours » (tables 021 courses/course_objectives/course_lessons)
// est désactivé. Toute la gestion de contenu passe désormais par /admin/curriculum
// (tables 027 chapters/lessons), que l'application lit directement.
export default function LegacyCoursesRedirect() {
  redirect('/admin/curriculum')
}
