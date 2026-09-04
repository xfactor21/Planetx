import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'conteXt Chrome Extension Privacy Policy',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ContextPrivacyPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#02030a',
        color: '#f7f9ff',
        fontFamily: 'Bahnschrift, "Segoe UI", sans-serif',
      }}
    >
      <article
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '48px 20px 80px',
          fontWeight: 350,
          lineHeight: 1.65,
        }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 480 }}>
          conteXt Chrome Extension Privacy Policy
        </h1>
        <p style={{ color: '#ff18ad', fontSize: 13 }}>Effective August 27, 2026</p>
        <p style={{ color: '#b8c5d9' }}>
          conteXt is a local encrypted credential vault for developer API keys, secrets,
          project mappings, environment mappings, account references, and user-written notes.
        </p>

        <h2 style={headingStyle}>Data Stored</h2>
        <p style={paragraphStyle}>
          The extension stores a user-created encrypted vault envelope in Chrome&apos;s local
          extension storage. The envelope contains ciphertext and the encryption metadata needed
          to unlock it, including salt, initialization vector, key-derivation iteration count,
          format version, and update timestamp.
        </p>
        <p style={paragraphStyle}>
          The extension does not store the user&apos;s vault passphrase. The derived encryption key
          exists in memory only while the vault is unlocked.
        </p>

        <h2 style={headingStyle}>Data Use</h2>
        <p style={paragraphStyle}>
          Vault data is used only to provide credential-management features requested by the user.
          conteXt does not sell, share, transmit, or use vault data for advertising, profiling,
          analytics, or unrelated purposes.
        </p>

        <h2 style={headingStyle}>Website and Browser Access</h2>
        <p style={paragraphStyle}>
          conteXt does not request host permissions and does not use content scripts. It cannot
          read websites, browsing history, cookies, page forms, or page content.
        </p>

        <h2 style={headingStyle}>Network Transmission</h2>
        <p style={paragraphStyle}>
          This version has no account system, cloud synchronization, telemetry, analytics,
          advertising, or provider API connection. Vault data is not transmitted to the developer
          or any third party.
        </p>

        <h2 style={headingStyle}>Retention and Deletion</h2>
        <p style={paragraphStyle}>
          Encrypted vault data remains in Chrome&apos;s local extension storage until the user deletes
          the vault or removes the extension. Users can download an encrypted backup before
          deletion or removal.
        </p>

        <h2 style={headingStyle}>Security</h2>
        <p style={paragraphStyle}>
          Vault content is encrypted with AES-GCM. The encryption key is derived from the user&apos;s
          passphrase with PBKDF2-SHA-256. No software can guarantee absolute security, and users
          are responsible for choosing and retaining a strong passphrase and protecting downloaded
          backups.
        </p>

        <h2 style={headingStyle}>Changes</h2>
        <p style={paragraphStyle}>
          Any future version that changes data access, collection, transmission, or sharing
          practices must update this policy and provide the disclosures required by Chrome Web
          Store policy before release.
        </p>

        <div
          style={{
            marginTop: 28,
            padding: 14,
            background: '#080c18',
            border: '1px solid #1d2b42',
            borderLeft: '3px solid #ff18ad',
          }}
        >
          A public support contact must be supplied by the publisher in the Chrome Web Store
          listing before publication.
        </div>
      </article>
    </main>
  )
}

const headingStyle = {
  margin: '32px 0 8px',
  color: '#00dcff',
  fontSize: 17,
  fontWeight: 470,
} as const

const paragraphStyle = { color: '#b8c5d9' } as const
