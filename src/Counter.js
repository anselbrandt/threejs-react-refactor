import React from "react";

export default function Counter(props) {
  const { count } = props;
  return <React.Fragment>{Math.round(count)}</React.Fragment>;
}
