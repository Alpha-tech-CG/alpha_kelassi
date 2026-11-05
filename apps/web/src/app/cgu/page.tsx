import type { Metadata } from 'next'
import Link from 'next/link'
import { formatFcfa, planPrice } from '@alpha-kelassi/types'
import { PublicShell } from '@/components/public-shell'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Cognix",
  description: "Conditions d'utilisation de la plateforme éducative Cognix.",
}

export default function CguPage() {
  const updated = '21 mai 2026'

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="rounded-[40px] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(15,27,45,0.25)] sm:p-12">
          <h1 className="mb-2 text-3xl font-bold">Conditions Générales d'Utilisation</h1>
          <p className="mb-10 text-sm text-gray-400">Dernière mise à jour : {updated}</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="mb-3 text-lg font-semibold">1. Objet</h2>
              <p>
                Les présentes CGU régissent l'utilisation de la plateforme Cognix (application web
                et mobile), service éducatif proposé par Alpha-Tech. En créant un compte, vous
                acceptez ces conditions.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">2. Accès au service</h2>
              <p>
                Cognix est accessible à toute personne disposant d'un téléphone ou d'un accès
                internet. Pour les utilisateurs mineurs (moins de 18 ans), l'inscription est
                autorisée avec l'accord d'un parent ou tuteur légal, qui reste responsable de
                l'utilisation du service.
              </p>
              <p className="mt-2">
                La formule Gratuit donne accès au premier chapitre de chaque matière, à une annale
                par matière et à 5 questions Cognix IA par jour. Les formules payantes (Starter,
                Pro, Pro Max) déverrouillent davantage de contenus et de services, décrits sur la
                page des formules.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">3. Utilisation acceptable</h2>
              <p className="mb-2">Il est interdit de :</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Partager vos identifiants ou accéder au compte d'autrui</li>
                <li>Tenter de contourner les mesures de sécurité ou les limitations</li>
                <li>Utiliser le tuteur IA pour générer du contenu illégal ou nuisible</li>
                <li>Revendre ou redistribuer les contenus réservés aux abonnés</li>
                <li>Utiliser des bots ou scripts pour accéder automatiquement au service</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">4. Formules payantes</h2>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Tarifs : Starter {formatFcfa(planPrice('starter', 'month'))}/mois ou{' '}
                  {formatFcfa(planPrice('starter', 'year'))}/an ; Pro{' '}
                  {formatFcfa(planPrice('pro', 'month'))}/mois ou{' '}
                  {formatFcfa(planPrice('pro', 'year'))}/an ; Pro Max{' '}
                  {formatFcfa(planPrice('pro_max', 'month'))}/mois ou{' '}
                  {formatFcfa(planPrice('pro_max', 'year'))}/an
                </li>
                <li>
                  Paiement par Mobile Money via FeexPay ; la formule est activée après confirmation
                  du paiement par l’opérateur
                </li>
                <li>
                  Aucun renouvellement automatique : chaque période est payée par un nouveau
                  paiement
                </li>
                <li>
                  Passage à une formule supérieure : effet immédiat, les jours restants de la
                  formule précédente étant convertis au prorata
                </li>
                <li>Passage à une formule inférieure : effet à la fin de la période en cours</li>
                <li>
                  À l’échéance, le compte revient à la formule Gratuit ; la progression et
                  l’historique sont conservés
                </li>
                <li>
                  Pas de remboursement pour les périodes entamées, sauf défaillance technique
                  majeure de notre part
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">5. Tuteur IA — Limitations</h2>
              <p>
                Le tuteur Cognix est basé sur un modèle d'intelligence artificielle (Google Gemini).
                Les réponses sont fournies à titre éducatif et ne remplacent pas l'enseignement d'un
                professeur. Alpha-Tech ne garantit pas l'exactitude absolue des réponses et décline
                toute responsabilité en cas d'erreur dans le contexte d'un examen officiel.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">6. Propriété intellectuelle</h2>
              <p>
                Les cours et examens mis en ligne restent la propriété de leurs auteurs respectifs
                (État congolais pour les examens officiels). La compilation, la présentation et les
                outils IA sont la propriété d'Alpha-Tech. Les utilisateurs n'acquièrent aucun droit
                de reproduction ou redistribution sur ces contenus.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">7. Disponibilité du service</h2>
              <p>
                Cognix s'efforce d'assurer une disponibilité de 99,5% mais ne peut garantir un accès
                ininterrompu. Des maintenances peuvent être effectuées, de préférence hors des
                périodes d'examens. Aucune compensation n'est due pour une interruption de moins de
                24h.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">
                8. Résiliation et suppression du compte
              </h2>
              <p>
                Vous pouvez supprimer votre compte à tout moment depuis{' '}
                <Link href="/compte/supprimer" className="text-blue-600 hover:underline">
                  cette page
                </Link>
                . Alpha-Tech se réserve le droit de suspendre un compte en cas de violation de ces
                CGU, après notification sauf en cas de fraude avérée.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">9. Droit applicable</h2>
              <p>
                Les présentes CGU sont soumises au droit de la République du Congo. Tout litige sera
                soumis aux tribunaux compétents de Brazzaville.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">10. Contact</h2>
              <p>
                Pour toute question :{' '}
                <a href="mailto:support@kelassi.app" className="text-blue-600">
                  support@kelassi.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicShell>
  )
}
