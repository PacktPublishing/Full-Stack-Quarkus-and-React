import {useState} from 'react';

export const useForm = ({initialValues = {}}) => {
  const [values, setValues] = useState(initialValues);
  const [invalid, setInvalid] = useState( {});
  const [error, setError] = useState('');
  const setValue = (name, value) => {
    setValues({...values, [name]: value});
  };
  const onChange = event => {
    const {name, value} = event.currentTarget;
    setError('');
    setInvalid({...invalid, [name]: !event.currentTarget.checkValidity()});
    setValue(name, value);
  };
  const isValid = Object.values(invalid).every(value => value === false);
  const clearForm = () => {
    setValues(initialValues);
    setInvalid({});
    setError('');
  }
  return {values, setValue, isValid, invalid, error, setError, clearForm, onChange};
}
