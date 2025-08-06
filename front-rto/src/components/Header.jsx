import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{ padding: '1rem', background: '#eee' }}>
      <nav>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      </nav>
    </header>
  )
}
