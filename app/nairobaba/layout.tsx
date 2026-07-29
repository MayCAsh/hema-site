import type { Metadata } from "next";
import "./nairobaba.css";

export const metadata: Metadata = {
  title: "NAIROBABA | A HEMA Community",
  description:
    "A Nairobi table for fathers: honest conversation, shared routines and room to figure it out together.",
};

export default function NairobabaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
