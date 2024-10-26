"use client";

import SideNav from "@/components/admin-panel/side-nav";
import MarginWidthWrapper from "@/components/admin-panel/margin-width-wrapper";
import Header from "../admin-panel/header";
import HeaderMobile from "@/components/admin-panel/header-mobile";
import PageWrapper from "@/components/admin-panel/page-wrapper";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header />
          <HeaderMobile />
          <PageWrapper>{children}</PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}