import React, { useState } from 'react';
import './hover.scss'; // Assurez-vous de créer ce fichier CSS

interface ImageHoverZoomProps {
  src: string;
  alt: string;
}

const ImageHoverZoom: React.FC<ImageHoverZoomProps> = ({ src, alt }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <img
      src={src}
      alt={alt}
      className={isOpen ? 'open' : isHovered ? 'hovered' : '' }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    />
  );
};

export default ImageHoverZoom;