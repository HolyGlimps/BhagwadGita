import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 p-4 z-50 text-black flex justify-end">
      <ul className="flex">
        <li className="mr-4">
          <Link href="/">Home</Link>
        </li>
        <li className="mr-4">
          <Link href="/about">About</Link>
        </li>
        <li className='mr-4'>
          <Link href="/about">Contact</Link>
        </li>
        <li className='mr-4'>
          <Link href="/about">Sign in</Link>
        </li>
        
      </ul>
    </nav>
  );
};

export default Navbar;