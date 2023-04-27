import Link from 'next/link';

const NavBar = () => (
  <div className="flex gap-4">
    <div>Chunithm Tournament</div>
    <Link href="/">Leaderboard</Link>
    <Link href="/rules">Rules</Link>
    <Link href="/submission">Submission</Link>
  </div>
);

export default NavBar;
