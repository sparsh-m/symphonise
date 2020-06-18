import React from 'react';

const buttonStyles = {
  borderColor: '#eee',
  borderWidth: 0,
  outline: 'none'
};
//{ className, disabled, id, onClick, value, style = {} }
const Button = props => (
  <button
    id={props.id}
    className={props.className}
    style={{ ...buttonStyles, ...props.style }}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.value}
  </button>
);

export default Button;