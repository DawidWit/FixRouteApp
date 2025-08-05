import React from 'react';
import '../../styles/Loader.css';

interface LoaderProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const Loader: React.FC<LoaderProps> = ({
  size = 20,
  color = '#fff',
  thickness = 3,
}) => {
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${thickness}px`,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    borderTopColor: color,        
  };

  return <span className="custom-loader" style={style}></span>;
};

export default Loader;