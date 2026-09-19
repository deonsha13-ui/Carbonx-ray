import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center text-sm text-gray-500 border-t border-white/5 mt-12 bg-black">
      <p>
        © 2026 Carbon-Xray | Platform architecture by{' '}
        <span className="font-bold text-cyan-400">ample.ai</span>
      </p>
    </footer>
  );
};

export default Footer;