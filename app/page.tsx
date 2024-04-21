//MAIN HOME PAGE

//imports
import Link from 'next/link'

export default function Home() {

  return (
    <main>
      <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://images.squarespace-cdn.com/content/v1/5efa6fb96aa65d6effb76352/1599092838714-F6DPAXE4OXEVL7NE5QNQ/Koya+Board+Game-15.jpg)' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">🌲 Virtual Koya 🌳</h1>
            <p className="mb-5">Join the worldwide community of tree loving strategy game enthusaists.</p>
            <Link className="btn btn-primary" href='/login' >Join A Game</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
