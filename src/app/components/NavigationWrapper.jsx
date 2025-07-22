'use client';

import Navigation from './Navigation';

export default function NavigationWrapper() {
  return (
    <>
      {/* Always fixed navigation */}
      <Navigation isFixed={true} />
      {/* Fixed spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
}
