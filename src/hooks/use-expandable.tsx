import * as React from 'react';

export function useExpandable(minHeight: number) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(minHeight);
  const [showExpandButton, setShowExpandButton] = React.useState(true);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      const contentScrollHeight = contentRef.current.scrollHeight;
      setContentHeight(contentRef.current.scrollHeight);
      setShowExpandButton(contentScrollHeight > minHeight);
    }
  }, [minHeight]);

  return {
    isExpanded,
    setIsExpanded,
    contentHeight,
    contentRef,
    showExpandButton
  };
}
