import { redirect } from 'next/navigation'

/** La rubrique Statistiques s'ouvre sur l'activité des élèves. */
export default function Page() {
  redirect('/admin/stats/activite')
}
