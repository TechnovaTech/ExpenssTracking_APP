import './globals.css'

export const metadata = {
  title: 'Expense Tracker Admin',
  description: 'Admin panel for expense tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
