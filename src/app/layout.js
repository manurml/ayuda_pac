export const metadata = {
  title: 'OlivarApp — Generador PAC',
  description: 'Genera tu solicitud de subvención PAC sin gestoría',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
