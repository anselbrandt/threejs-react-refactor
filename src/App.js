import React, { useRef, useState, useEffect } from "react";
import styles from "./App.module.css";
import ThreeCanvas from "./ThreeCanvas";
import Counter from "./Counter";

function App() {
  const [count, setCount] = useState(0);
  const fps = 1;
  const maxCount = 10;
  const threeWidth = "800px";
  const threeHeight = "800px";

  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = () => {
    const now = Date.now();
    if (previousTimeRef.current !== undefined) {
      const deltaTime = now - previousTimeRef.current;
      if (deltaTime > 1000 / fps) {
        setCount((prevCount) => {
          if (prevCount < maxCount) {
            return prevCount + 1;
          } else {
            return 0;
          }
        });
        previousTimeRef.current = now;
      }
    } else {
      previousTimeRef.current = now;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className={styles.app}>
      <div
        className={styles.threeCanvas}
        style={{ width: threeWidth, height: threeHeight }}
      >
        <ThreeCanvas width={threeWidth} height={threeHeight} />
      </div>
      <Counter count={count} />
    </div>
  );
}

export default App;
