import React from "react";

interface OmitRTLProps {
  children: React.ReactNode;
  omitRTL?: boolean;
}

const OmitRTL: React.FC<OmitRTLProps> = ({ children, omitRTL = true }) => {
  return (
    <div className={omitRTL ? "omit-rtl" : "inherit-dir"}>{children}</div>
  );
};

export default OmitRTL;
