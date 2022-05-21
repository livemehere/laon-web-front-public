import React, { useState } from "react";

export type HandleChangeType = (key: string, value: any) => void;

const useInput = <T>(initialValue: T) => {
  const [input, setInput] = useState<T>(initialValue);

  const handleChange: HandleChangeType = (key: string, value: any) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return { input, handleChange, setInput };
};

export default useInput;
