import { Button, Container } from '../components/ui'

export function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-sand-50">
      <Container className="py-24 text-center">
        <p className="font-display text-7xl font-bold text-navy-200">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy-950">Cette page a déménagé — comme nos anciennes interfaces.</h1>
        <p className="mx-auto mt-3 max-w-md text-navy-950/60">
          Le lien que vous avez suivi n’existe plus. Repartez de l’accueil, tout y est.
        </p>
        <div className="mt-8">
          <Button to="/" variant="primary" arrow>Retour à l’accueil</Button>
        </div>
      </Container>
    </section>
  )
}
