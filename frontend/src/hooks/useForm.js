import { useState } from "react";

const useForm = callback => {
  const [values, setValues] = useState({ });
  const [formLoading, setFormLoading] = useState(false);

  const handleChange = event => {
    const auxValues = { ...values };
    auxValues[event.target.name] = event.target.value;
    setValues(auxValues);
  };

  const handleSubmit = callback => event => {
    event.preventDefault();
    setFormLoading(true);
    callback(event);
    setFormLoading(false);
  };

  return [{ values, formLoading }, handleChange, handleSubmit];
};

export default useForm;