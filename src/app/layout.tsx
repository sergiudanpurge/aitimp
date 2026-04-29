import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Aitimp.ro — N-ai timp? Găsește pe cineva care are.',
  description: 'Marketplace de servicii din România',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
