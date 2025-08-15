import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "antd";

const Example = () => {
  return (
    <div className="flex justify-center">
      <FlyoutLink href="#" FlyoutContent={KeywordRankFlyout}>
        <span className="text-black font-semibold text-xl">랭킹 보기</span>
      </FlyoutLink>
    </div>
  );
};


const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <a href={href} className="relative text-white">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black z-50"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const KeywordRankFlyout = () => {
  const relatedKeywords = useSelector(
    (state) => state.association.relatedKeywords
  );
  const sortedKeywords = [...relatedKeywords].sort((a, b) => b.value - a.value);

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            <i className="ri-folder-chart-fill" style={{ marginRight: 8 }} />
            최근 한달
          </span>
          <span style={{ fontSize: 12, color: "#888" }}>(2025.07.14~2025.07.15)</span>
        </div>
      }
      style={{
        width: 360,
        borderRadius: 20,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ maxHeight: 580, overflowY: "auto" }}>
        <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ textAlign: "center", padding: "8px" }}>연관어</th>
              <th style={{ textAlign: "right", padding: "8px" }}>건수</th>
              <th style={{ textAlign: "center", padding: "8px" }}>순위</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeywords.map((keyword, index) => (
              <tr key={keyword.name}>
                <td style={{ textAlign: "center", padding: "8px" }}>{keyword.name}</td>
                <td style={{ textAlign: "right", padding: "8px" }}>
                  {keyword.value.toLocaleString()}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>{index + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Example;
