"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  text: string;
  href: string;
}

export default function GradientButton({ text, href }: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-block px-8 py-3 rounded-full text-white font-medium shadow-lg cursor-pointer overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#2563eb,#14b8a6)",
        }}
      >
        <motion.span
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-white/20 skew-x-12"
        />

        <span className="relative z-10">{text}</span>
      </motion.div>
    </Link>
  );
}