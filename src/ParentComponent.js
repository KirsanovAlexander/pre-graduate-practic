import React from 'react';
import { useHistory } from 'react-router-dom';
import MenuComponent from './MenuComponent';

const ParentComponent = () => {
  const history = useHistory();

  const handleMenuItemClick = (path) => {
    history.push(path);
  };

  return (
    <div>
      <MenuComponent handleMenuItemClick={handleMenuItemClick} />
    </div>
  );
};

export default ParentComponent;
