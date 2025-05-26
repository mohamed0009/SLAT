'use client';

import Link from "next/link";
import { Book, GraduationCap, HandMetal, Moon, PanelLeft } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white mt-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z%22 fill=%22%23ffffff%22%3E%3C/path%3E%3C/svg%3E')] h-full w-full bg-repeat-x bg-bottom animate-[wave_10s_linear_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <HandMetal className="h-8 w-8" />
              <span className="text-2xl font-bold">SLAT</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <Book className="h-4 w-4" />
                    <span>Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <GraduationCap className="h-4 w-4" />
                    <span>Tutorials</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <PanelLeft className="h-4 w-4" />
                    <span>FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span>Twitter</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 hover:underline">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                    </svg>
                    <span>Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm opacity-80">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">30ms</div>
                <div className="text-sm opacity-80">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-sm opacity-80">Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">
            © 2023-{new Date().getFullYear()} Sign Language Analysis Tool. All rights reserved. Made with{" "}
            <span className="inline-block animate-pulse text-red-400">♥</span> for accessibility
          </p>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Moon className="h-4 w-4" />
            <span className="text-sm">Switch Theme</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 