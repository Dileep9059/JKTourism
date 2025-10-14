import useLocalStorage from "./useLocalStorage";

const useInput = (key, initValue) => {
  const [value, setvalue] = useLocalStorage(key, initValue);

  const resetUser = () => setvalue(initValue);

  const userAttributes = {
    value,
    onChange: (e) => setvalue(e.target.value),
  };
  return [value, resetUser, userAttributes];
};

export default useInput;