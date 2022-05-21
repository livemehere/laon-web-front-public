import React, { useState } from "react";

interface CheckLabelProps {
  text: string;
  className?: string;
  name: string;
  value: any;
  callback?: (name: string, value: number) => void;
}

const CheckLabel: React.FC<CheckLabelProps> = ({
  children,
  text,
  className,
  name,
  callback,
  value,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (value: any) => {
    setIsChecked(value);
    callback && callback(name, value ? 1 : 0);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleChange(e.target.checked)}
        />
        <span className={`tw-text-gray-500 ${className}`}> {text}</span>
      </label>
    </div>
  );
};

export default CheckLabel;
