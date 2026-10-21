import { redirect } from 'next/navigation'

// Ancien éditeur de cours (021) désactivé — voir /admin/curriculum.
export default function LegacyCourseRedirect() {
  redirect('/admin/curriculum')
}
