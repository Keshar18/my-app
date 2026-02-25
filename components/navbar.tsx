"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold text-blue-600">
          💙 HolistiDoc AI
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {["Home", "Consultation", "Dashboard", "About", "Contact"].map(
            (item) => (
              <motion.div whileHover={{ scale: 1.1 }} key={item}>
                <Link href={`/${item === "Home" ? "" : item.toLowerCase()}`}>
                  {item}
                </Link>
              </motion.div>
            )
          )}

          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-white text-sm font-medium"
            style={{
              background: "linear-gradient(135deg,#2563eb,#14b8a6)",
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/consultation">Consultation</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Sign In</Link>
        </div>
      )}
    </nav>
  );
}