'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '@/types/siteContent';
import defaultContent from '@/content/siteContent.json';

const ContentContext = createContext<SiteContent>(defaultContent as SiteContent);

interface ContentProviderProps {
  initialContent?: SiteContent;
  children: React.ReactNode;
}

export function ContentProvider({ initialContent, children }: ContentProviderProps) {
  const [content, setContent] = useState<SiteContent>(initialContent || (defaultContent as SiteContent));

  // If initialContent changes on server re-render, sync it
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent {
  const context = useContext(ContentContext);
  return context || (defaultContent as SiteContent);
}
