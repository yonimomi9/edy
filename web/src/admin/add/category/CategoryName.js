import React from 'react';
import PropTypes from 'prop-types'; // For prop validation
import styles from './CategoryName.module.css';

function CategoryName({ value, onChange }) {
  return (
      <div className="form-group">
          <label htmlFor="categoryName">Category Name:</label>
          <input
              type="text"
              id="categoryName"
              value={value}
              onChange={(e) => onChange(e.target.value)} // Call onChange with the new value
              className="form-control"
              placeholder="Enter category name"
          />
      </div>
  );
}


// Validate props
CategoryName.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CategoryName;
