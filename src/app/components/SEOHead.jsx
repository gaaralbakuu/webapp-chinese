'use client';

import Head from 'next/head';

export default function SEOHead({ 
  title = "Học Tiếng Trung HSK",
  description = "Ứng dụng học từ vựng tiếng Trung hiệu quả theo cấp độ HSK",
  keywords = "tiếng trung, HSK, từ vựng, học tiếng trung, chinese learning, vocabulary",
  ogImage = "/og-image.png",
  url = "",
  type = "website"
}) {
  const fullTitle = title.includes("Học Tiếng Trung HSK") ? title : `${title} | Học Tiếng Trung HSK`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:site_name" content="Học Tiếng Trung HSK" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Chinese Learning Team" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Học Tiếng Trung HSK",
            "description": description,
            "url": url,
            "sameAs": [],
            "offers": {
              "@type": "Offer",
              "category": "Education",
              "priceCurrency": "VND",
              "price": "0",
              "description": "Miễn phí học từ vựng tiếng Trung"
            }
          })
        }}
      />
    </Head>
  );
}
