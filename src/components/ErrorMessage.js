function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>Error {message}</span>
    </p>
  );
}

export default ErrorMessage;
