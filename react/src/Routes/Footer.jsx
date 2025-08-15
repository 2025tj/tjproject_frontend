// src/components/Footer.js
import React from "react";

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      {/* 왼쪽 영역 */}
      <div className="flex flex-col text-sm text-gray-600 space-y-2">
        <div className="hover:underline cursor-pointer">
          이용약관 | 개인정보처리방침
        </div>
        <span>© 2025 NewsEmo. All rights reserved.</span>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex flex-col text-sm text-gray-500 text-left md:text-right space-y-1">
        <div>서울특별시 구로구 도림천로</div>
        <div>
          contact: 02)xxxx-xxxx | support@newsemo.com
        </div>
        <a href="/" className="text-blue-600 hover:underline">
          NewsEmo - 뉴스 감정 분석 플랫폼
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
