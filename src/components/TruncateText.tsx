import React, { useState } from "react";
import Truncate from "react-truncate";

type Props = {
  lines?: number;
  text: string;
};

const TruncateText: React.FC<Props> = (props) => {
  const { lines = 2, text } = props;

  const [isExpanded, setIsExpanded] = useState<Boolean>(false);
  const [isTruncated, setIsTruncated] = useState<Boolean>(false);

  const handleTruncate = (truncated: Boolean) => {
    if (truncated !== isTruncated) {
      setIsTruncated(truncated);
    }
  };

  const toggleLines = (e: any) => {
    e.preventDefault();

    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Truncate
        lines={!isExpanded && lines}
        ellipsis={
          <span>
            ...{" "}
            <div className="toggle-text-btn" onClick={toggleLines}>
              Show more
            </div>
          </span>
        }
        onTruncate={handleTruncate}
      >
        {text}
      </Truncate>
      {!isTruncated && isExpanded && (
        <span>
          {" "}
          <div className="toggle-text-btn" onClick={toggleLines}>
            Show less
          </div>
        </span>
      )}
    </div>
  );
};

export default TruncateText;
