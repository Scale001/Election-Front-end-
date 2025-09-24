import React from "react";

export default function ButtonLoader() {
  // CSS styles defined inline
  const spinnerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const spinnerCircleStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid rgb(255, 128, 0)",
    animation: "spin 1s linear infinite",
  };

  // Create a style tag for the keyframes animation
  React.useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up function to remove the style when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={spinnerStyle}>
      <div style={spinnerCircleStyle}></div>
    </div>
  );
}
