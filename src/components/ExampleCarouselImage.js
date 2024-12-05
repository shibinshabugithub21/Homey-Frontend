import React from 'react';

const ExampleCarouselImage = ({ text, src }) => {
  return (
    <img
      className="d-block w-100"
      src={src} 
      alt={text} 
    />
  );
};

export default ExampleCarouselImage;
